import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/config';

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