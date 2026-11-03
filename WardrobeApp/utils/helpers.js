import { ID_PREFIXES, RESPONSE_CODES, FIELDS } from '../config/config';

export function buildResponse(code, message, data = null) {
  const success = code === RESPONSE_CODES.OK;
  return {
    'code': code,
    'success': success,
    'message': message,
    'data': data,
  };
}

export function generateId(entityType) {
  const prefix = ID_PREFIXES[entityType];
  return `${prefix}${Math.random().toString(36).substring(2, 9)}`;
}

export function pickAllowedFields(entity, input){
    if (input === null || typeof input !== 'object') {
        return {};
    }
    const allowedFields = FIELDS[entity].required.concat(FIELDS[entity].optional);
    const filteredInput = {};
    for (const field of allowedFields) {
        if (input.hasOwnProperty(field)) {
            filteredInput[field] = input[field];
        }
    }
    return filteredInput;
}

export function now() {
  return new Date().toISOString();
}