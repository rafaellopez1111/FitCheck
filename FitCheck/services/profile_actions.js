import { buildResponse, now, pickAllowedFields } from '../utils/helpers';
import { insertOne, getOneInfo, getAllInfo, deleteOne } from './storage';
import { validateItem } from './validation';
import { ENTITIES, RESPONSE_CODES } from '../config/config';

export async function createProfile(request) {
  const userId = request.user_id;
  const entity = ENTITIES.profile;
  const timestamp = now();

  const existingItem = await getOneInfo(userId, entity, userId);
  if (existingItem) {
    return buildResponse(RESPONSE_CODES.bad_request, 'Profile already exists');
  }

  const item = {
    ...pickAllowedFields(entity, request.data),
    id: userId,
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

  await insertOne(userId, entity, userId, item);

  return buildResponse(RESPONSE_CODES.ok, 'Profile created successfully', item);
}

export async function updateProfile(request) {
  const userId = request.user_id;
  const entity = ENTITIES.profile;
  const timestamp = now();

  const existingItem = await getOneInfo(userId, entity, userId);
  if (!existingItem) {
    return buildResponse(RESPONSE_CODES.not_found, 'Profile not found');
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

  await insertOne(userId, entity, userId, item);

  return buildResponse(RESPONSE_CODES.ok, 'Profile updated successfully', item);
}

export async function getProfile(request) {
  const userId = request.user_id;

  const profile = await getOneInfo(userId, ENTITIES.profile, userId);
  if (!profile) {
    return buildResponse(RESPONSE_CODES.not_found, 'Profile not found');
  }

  const clothing = (await getAllInfo(userId, ENTITIES.clothing)) ?? [];
  const wishlist = (await getAllInfo(userId, ENTITIES.wishlist)) ?? [];
  const outfits = (await getAllInfo(userId, ENTITIES.outfit)) ?? [];

  const stats = {
    clothing_count: clothing.length,
    wishlist_count: wishlist.length,
    outfit_count: outfits.length,
    wishlist_total: wishlist.reduce(
      (sum, item) => sum + (typeof item.price === 'number' ? item.price : 0),
      0
    ),
  };

  return buildResponse(RESPONSE_CODES.ok, 'Profile retrieved successfully', { ...profile, stats });
}

export async function deleteProfile(request) {
  const userId = request.user_id;

  const existingItem = await getOneInfo(userId, ENTITIES.profile, userId);
  if (!existingItem) {
    return buildResponse(RESPONSE_CODES.not_found, 'Profile not found');
  }

  const clothing = (await getAllInfo(userId, ENTITIES.clothing)) ?? [];
  const wishlist = (await getAllInfo(userId, ENTITIES.wishlist)) ?? [];
  const outfits = (await getAllInfo(userId, ENTITIES.outfit)) ?? [];

  await Promise.all([
    ...clothing.map((item) => deleteOne(userId, ENTITIES.clothing, item.id)),
    ...wishlist.map((item) => deleteOne(userId, ENTITIES.wishlist, item.id)),
    ...outfits.map((item) => deleteOne(userId, ENTITIES.outfit, item.id)),
  ]);
  await deleteOne(userId, ENTITIES.profile, userId);

  return buildResponse(RESPONSE_CODES.ok, 'Profile and all data deleted successfully', { id: userId });
}