import { ref, set, get, query, orderByKey, limitToLast } from 'firebase/database';
import { db } from '../config/firebase';

export async function insertOne(userId, entity, id, data) {
  const version = String(data.version).padStart(6, '0');
  const path = `users/${userId}/${entity}/${id}/${version}`;
  await set(ref(db, path), data);
}

export async function getOneInfo(userId, entity, id) {
  const path = `users/${userId}/${entity}/${id}/${String(await getHighestVersion(userId, entity, id)).padStart(6, '0')}`;
  const snapshot = await get(ref(db, path));
  return snapshot.val();
}

export async function getHighestVersion(userId, entity, id) {
    const path = `users/${userId}/${entity}/${id}`;
    const snapshot = await get(query(ref(db, path), orderByKey(), limitToLast(1)));
    
    if (snapshot.exists()) {
        const highestVersionKey = Object.keys(snapshot.val())[0];

        return parseInt(highestVersionKey, 10);
    }
    return 0;
}

export async function getAllInfo(userId, entity) {
    const path = `users/${userId}/${entity}`;
    const snapshot = await get(ref(db, path));

    if (!snapshot.exists()) {
        return [];
    }

    const items = snapshot.val();

    const result = Object.values(items).map((versions) => {
        const highestVersionKey = Object.keys(versions).sort();
        const highestVersion = versions[highestVersionKey[highestVersionKey.length - 1]];
        return highestVersion;
    });

    return result;
}

export async function deleteOne(userId, entity, id) {
  const path = `users/${userId}/${entity}/${id}`;
  await set(ref(db, path), null);
}