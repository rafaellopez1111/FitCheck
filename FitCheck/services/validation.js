import { buildResponse } from '../utils/helpers';
import {
  RESPONSE_CODES,
  ENTITIES,
  ALLOWED_ACTIONS,
  ACTIONS_REQUIRING_DATA,
  ACTIONS_REQUIRING_ID,
  FIELDS,
  PROTECTED_FIELDS,
  CATEGORIES,
  STYLES,
  PRIORITIES,
} from '../config/config';

const TEXT_FIELDS = [
  'name',
  'category',
  'photo',
  'brand',
  'size',
  'style',
  'notes',
  'store_link',
  'occasion',
  'priority',
];

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isBlank(value) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'string' && value.trim() === '')
  );
}

function badRequest(message) {
  return buildResponse(RESPONSE_CODES.bad_request, message);
}

export function validateRequest(request) {
  if (!isPlainObject(request)) {
    return badRequest('Request must be an object');
  }

  const { user_id, entity, action, data } = request;

  if (isBlank(user_id)) {
    return badRequest('User ID is required');
  }

  if (isBlank(entity) || !Object.values(ENTITIES).includes(entity)) {
    return badRequest(`Invalid entity: ${entity}`);
  }

  if (isBlank(action)) {
    return badRequest('Action is required');
  }

  if (!ALLOWED_ACTIONS[entity].includes(action)) {
    return buildResponse(
      RESPONSE_CODES.method_not_allowed,
      `Action ${action} is not allowed for ${entity}`
    );
  }

  if (ACTIONS_REQUIRING_DATA.includes(action) && !isPlainObject(data)) {
    return badRequest('Data is required and must be an object for this action');
  }

  if (ACTIONS_REQUIRING_ID.includes(action) && isBlank(data.id)) {
    return badRequest('ID is required for this action');
  }

  return null;
}

export function validateItem(entity, item) {
  if (!Object.values(ENTITIES).includes(entity)) {
    return badRequest(`Invalid entity: ${entity}`);
  }

  if (!isPlainObject(item)) {
    return badRequest('Item must be an object');
  }

  const rules = FIELDS[entity];
  const allowedFields = [...rules.required, ...rules.optional, ...PROTECTED_FIELDS];

  for (const field of rules.required) {
    if (isBlank(item[field])) {
      return badRequest(`Missing required field: ${field}`);
    }
  }

  for (const field of Object.keys(item)) {
    if (!allowedFields.includes(field)) {
      return badRequest(`Invalid field: ${field}`);
    }
  }

  for (const field of TEXT_FIELDS) {
    if (item[field] !== undefined && item[field] !== null && typeof item[field] !== 'string') {
      return badRequest(`${field} must be text`);
    }
  }

  if (item.category !== undefined && !CATEGORIES.includes(item.category)) {
    return badRequest(`Invalid category: ${item.category}`);
  }

  if (item.style !== undefined && item.style !== null && !STYLES.includes(item.style)) {
    return badRequest(`Invalid style: ${item.style}`);
  }

  if (item.priority !== undefined && item.priority !== null && !PRIORITIES.includes(item.priority)) {
    return badRequest(`Invalid priority: ${item.priority}`);
  }

  if (item.price !== undefined && item.price !== null) {
    if (typeof item.price !== 'number' || !Number.isFinite(item.price) || item.price < 0) {
      return badRequest('Price must be a number that is not negative');
    }
  }

  if (item.item_ids !== undefined) {
    if (!Array.isArray(item.item_ids) || item.item_ids.length === 0) {
      return badRequest('item_ids must be a list with at least one id');
    }
    if (item.item_ids.some((id) => typeof id !== 'string' || isBlank(id))) {
      return badRequest('item_ids must contain only valid ids');
    }
    if (new Set(item.item_ids).size !== item.item_ids.length) {
      return badRequest('item_ids must not contain duplicates');
    }
  }

  return null;
}