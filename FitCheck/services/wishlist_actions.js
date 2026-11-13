import { buildResponse, generateId, now, pickAllowedFields } from '../utils/helpers';
import { insertOne, getOneInfo, getAllInfo, deleteOne } from './storage';
import { validateItem } from './validation';
import { ENTITIES, FIELDS, RESPONSE_CODES } from '../config/config';

export async function createWishlistItem(request) {
  const userId = request.user_id;
  const entity = ENTITIES.wishlist;
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

  return buildResponse(RESPONSE_CODES.ok, 'Wishlist item created successfully', item);
}

export async function updateWishlistItem(request) {
  const userId = request.user_id;
  const entity = ENTITIES.wishlist;
  const timestamp = now();

  const existingItem = await getOneInfo(userId, entity, request.data.id);
  if (!existingItem) {
    return buildResponse(RESPONSE_CODES.not_found, 'Wishlist item not found');
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

  return buildResponse(RESPONSE_CODES.ok, 'Wishlist item updated successfully', item);
}

export async function deleteWishlistItem(request) {
  const userId = request.user_id;
  const entity = ENTITIES.wishlist;
  const id = request.data.id;

  const existingItem = await getOneInfo(userId, entity, id);
  if (!existingItem) {
    return buildResponse(RESPONSE_CODES.not_found, 'Wishlist item not found');
  }

  await deleteOne(userId, entity, id);

  return buildResponse(RESPONSE_CODES.ok, 'Wishlist item deleted successfully', { id });
}

export async function getWishlistItem(request) {
  const userId = request.user_id;
  const entity = ENTITIES.wishlist;

  const item = await getOneInfo(userId, entity, request.data.id);
  if (!item) {
    return buildResponse(RESPONSE_CODES.not_found, 'Wishlist item not found');
  }

  return buildResponse(RESPONSE_CODES.ok, 'Wishlist item retrieved successfully', item);
}

export async function getAllWishlistItems(request) {
  const userId = request.user_id;
  const entity = ENTITIES.wishlist;

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

  return buildResponse(RESPONSE_CODES.ok, 'Wishlist items retrieved successfully', summaries);
}

export async function markWishlistItemAsBought(request) {
  const userId = request.user_id;
  const wishlistEntity = ENTITIES.wishlist;
  const clothingEntity = ENTITIES.clothing;
  const id = request.data.id;
  const timestamp = now();

  const wishlistItem = await getOneInfo(userId, wishlistEntity, id);
  if (!wishlistItem) {
    return buildResponse(RESPONSE_CODES.not_found, 'Wishlist item not found');
  }

  const clothingItem = {
    ...pickAllowedFields(clothingEntity, wishlistItem),
    id: generateId(clothingEntity),
    version: 1,
    created_on: timestamp,
    created_by: userId,
    updated_on: timestamp,
    updated_by: userId,
  };

  const invalid = validateItem(clothingEntity, clothingItem);
  if (invalid) {
    return invalid;
  }

  await insertOne(userId, clothingEntity, clothingItem.id, clothingItem);
  await deleteOne(userId, wishlistEntity, id);

  return buildResponse(RESPONSE_CODES.ok, 'Wishlist item marked as bought', clothingItem);
}