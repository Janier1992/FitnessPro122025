import { openDB } from 'idb';

const DB_NAME = 'fitness-flow-offline';
const STORE_NAME = 'offline-actions';

export const initDB = async () => {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        },
    });
};

export const saveOfflineAction = async (action: any) => {
    const db = await initDB();
    await db.add(STORE_NAME, { ...action, timestamp: Date.now() });
};

export const getOfflineActions = async () => {
    const db = await initDB();
    return db.getAll(STORE_NAME);
};

export const deleteOfflineAction = async (id: number) => {
    const db = await initDB();
    await db.delete(STORE_NAME, id);
};

export const clearOfflineActions = async () => {
    const db = await initDB();
    await db.clear(STORE_NAME);
};
