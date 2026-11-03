import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, ID_PREFIXES, RESPONSE_CODES, FIELDS } from '../config/config';

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

export function readCollection(entity){
    const key = STORAGE_KEYS[entity];
    return AsyncStorage.getItem(key)
        .then((data) => {
            if (data) {
                return JSON.parse(data);
            } else {
                return [];
            }
        })
}

export function writeCollection(entity, list){
    const key = STORAGE_KEYS[entity];
    return AsyncStorage.setItem(key, JSON.stringify(list))
}


export function now() {
  return new Date().toISOString();
}