import { buildResponse, generateId, now, pickAllowedFields } from '../utils/helpers';
import { insertOne, getOneInfo, getAllInfo, deleteOne } from './storage';
import { validateItem } from './validation';
import { ENTITIES, FIELDS, RESPONSE_CODES } from '../config/config';

export async function createClothingItem(request) {
  const userId = request.user_id;
  const entity = ENTITIES.clothing;
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

  await insertOne(userId, entity, item.id, item);

  return buildResponse(RESPONSE_CODES.ok, 'Clothing item created successfully', item);
}

export async function updateClothingItem(request) {
  const userId = request.user_id;
  const entity = ENTITIES.clothing;
  const timestamp = now();

  const existingItem = await getOneInfo(userId, entity, request.data.id);
  if (!existingItem) {
    return buildResponse(RESPONSE_CODES.not_found, 'Clothing item not found');
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

  await insertOne(userId, entity, item.id, item);

  return buildResponse(RESPONSE_CODES.ok, 'Clothing item updated successfully', item);
}

export async function deleteClothingItem(request) {
  const userId = request.user_id;
  const entity = ENTITIES.clothing;
  const id = request.data.id;

  const existingItem = await getOneInfo(userId, entity, id);
  if (!existingItem) {
    return buildResponse(RESPONSE_CODES.not_found, 'Clothing item not found');
  }

  await deleteOne(userId, entity, id);

  const outfits = (await getAllInfo(userId, ENTITIES.outfit)) ?? [];
  const affected = outfits.filter((outfit) => outfit.item_ids.includes(id));

  for (const outfit of affected) {
    const remaining = outfit.item_ids.filter((itemId) => itemId !== id);

    if (remaining.length === 0) {
      await deleteOne(userId, ENTITIES.outfit, outfit.id);
    } else {
      await insertOne(userId, ENTITIES.outfit, outfit.id, {
        ...outfit,
        item_ids: remaining,
        version: (outfit.version ?? 0) + 1,
        updated_on: now(),
        updated_by: userId,
      });
    }
  }

  return buildResponse(RESPONSE_CODES.ok, 'Clothing item deleted successfully', { id });
}

export async function getClothingItem(request) {
  const userId = request.user_id;
  const entity = ENTITIES.clothing;

  const item = await getOneInfo(userId, entity, request.data.id);
  if (!item) {
    return buildResponse(RESPONSE_CODES.not_found, 'Clothing item not found');
  }

  return buildResponse(RESPONSE_CODES.ok, 'Clothing item retrieved successfully', item);
}

export async function getAllClothingItems(request) {
  const userId = request.user_id;
  const entity = ENTITIES.clothing;

  const items = (await getAllInfo(userId, entity)) ?? [];

  const summaries = items
    .sort((a, b) => (b.created_on ?? '').localeCompare(a.created_on ?? ''))
    .map((item) =>
      Object.fromEntries(
        FIELDS[entity].summary
          .filter((field) => item[field] !== undefined)
          .map((field) => [field, item[field]])
      )
    );

  return buildResponse(RESPONSE_CODES.ok, 'Clothing items retrieved successfully', summaries);
}