import { buildResponse, generateId, now, pickAllowedFields } from '../utils/helpers';
import { insertOne, getOneInfo, getAllInfo, deleteOne } from './storage';
import { validateItem } from './validation';
import { ENTITIES, FIELDS, RESPONSE_CODES } from '../config/config';

export async function createOutfit(request) {
  const userId = request.user_id;
  const entity = ENTITIES.outfit;
  const timestamp = now();

  const item = {
    ...pickAllowedFields(entity, request.data),
    id: generateId(entity),
    version: 1,
    created_on: timestamp,
    created_by: userId,
    updated_on: timestamp,
    updated_by: userId,
  };

  const invalid = validateItem(entity, item);
  if (invalid) {
    return invalid;
  }

  const found = await Promise.all(
    item.item_ids.map((itemId) => getOneInfo(userId, ENTITIES.clothing, itemId))
  );
  const missing = item.item_ids.filter((itemId, index) => !found[index]);
  if (missing.length > 0) {
    return buildResponse(
      RESPONSE_CODES.bad_request,
      `Clothing items not found: ${missing.join(', ')}`
    );
  }

  await insertOne(userId, entity, item.id, item);

  return buildResponse(RESPONSE_CODES.ok, 'Outfit created successfully', item);
}

export async function updateOutfit(request) {
  const userId = request.user_id;
  const entity = ENTITIES.outfit;
  const timestamp = now();

  const existingItem = await getOneInfo(userId, entity, request.data.id);
  if (!existingItem) {
    return buildResponse(RESPONSE_CODES.not_found, 'Outfit not found');
  }

  const changes = pickAllowedFields(entity, request.data);
  if (Object.keys(changes).length === 0) {
    return buildResponse(RESPONSE_CODES.bad_request, 'No fields to update');
  }

  const merged = {
    ...existingItem,
    ...changes,
    version: (existingItem.version ?? 0) + 1,
    updated_on: timestamp,
    updated_by: userId,
  };

  const item = Object.fromEntries(
    Object.entries(merged).filter(([, value]) => value !== null)
  );

  const invalid = validateItem(entity, item);
  if (invalid) {
    return invalid;
  }

  if (changes.item_ids !== undefined) {
    const found = await Promise.all(
      item.item_ids.map((itemId) => getOneInfo(userId, ENTITIES.clothing, itemId))
    );
    const missing = item.item_ids.filter((itemId, index) => !found[index]);
    if (missing.length > 0) {
      return buildResponse(
        RESPONSE_CODES.bad_request,
        `Clothing items not found: ${missing.join(', ')}`
      );
    }
  }

  await insertOne(userId, entity, item.id, item);

  return buildResponse(RESPONSE_CODES.ok, 'Outfit updated successfully', item);
}

export async function deleteOutfit(request) {
  const userId = request.user_id;
  const entity = ENTITIES.outfit;
  const id = request.data.id;

  const existingItem = await getOneInfo(userId, entity, id);
  if (!existingItem) {
    return buildResponse(RESPONSE_CODES.not_found, 'Outfit not found');
  }

  await deleteOne(userId, entity, id);

  return buildResponse(RESPONSE_CODES.ok, 'Outfit deleted successfully', { id });
}

export async function getOutfit(request) {
  const userId = request.user_id;
  const entity = ENTITIES.outfit;

  const outfit = await getOneInfo(userId, entity, request.data.id);
  if (!outfit) {
    return buildResponse(RESPONSE_CODES.not_found, 'Outfit not found');
  }

  const clothes = await Promise.all(
    outfit.item_ids.map((itemId) => getOneInfo(userId, ENTITIES.clothing, itemId))
  );
  const items = clothes.filter((item) => item !== null);

  return buildResponse(RESPONSE_CODES.ok, 'Outfit retrieved successfully', { ...outfit, items });
}

export async function getAllOutfits(request) {
  const userId = request.user_id;
  const entity = ENTITIES.outfit;

  const outfits = (await getAllInfo(userId, entity)) ?? [];

  const summaries = outfits
    .sort((a, b) => (b.created_on ?? '').localeCompare(a.created_on ?? ''))
    .map((outfit) =>
      Object.fromEntries(
        FIELDS[entity].summary
          .filter((field) => outfit[field] !== undefined)
          .map((field) => [field, outfit[field]])
      )
    );

  return buildResponse(RESPONSE_CODES.ok, 'Outfits retrieved successfully', summaries);
}