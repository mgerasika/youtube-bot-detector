import { useEffect, useState, useCallback } from "react";

// Define types for flexibility
interface UseIndexedDBProps<T> {
  dbName: string;
  storeName: string;
  version?: number;
  keyPath?: keyof T; // Optional key path for object store
}

export function useIndexedDB<T>({
  dbName,
  storeName,
  version = 1,
  keyPath,
}: UseIndexedDBProps<T>) {
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize the database and set up object store
  useEffect(() => {
    const request = indexedDB.open(dbName, version);

    request.onupgradeneeded = (_ev) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: keyPath as string });
      }
    };

    request.onsuccess = () => {
      setDb(request.result);
    };

    request.onerror = () => {
      setError("Failed to open IndexedDB");
    };
  }, [dbName, storeName, version, keyPath]);

  // Function to add data
  const addDataAsync = useCallback(
    async (data: T): Promise<void> => {
      if (!db) throw 'not connected';
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);

      try {
        await new Promise((resolve, reject) => {
          const request = store.add(data);
          request.onsuccess = () => resolve(true);
          request.onerror = () => reject(request.error);
        });
      } catch (e) {
        setError("Failed to add data");
      }
    },
    [db, storeName]
  );

  // Function to retrieve data by key
  const getDataAsync = useCallback(
     async (key: IDBValidKey): Promise<T | undefined> => {
      if (!db) throw 'not connected';
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);

      return await new Promise((resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result as T);
        request.onerror = () => reject(request.error);
      });
    },
    [db, storeName]
  );

  // Function to delete data by key
  const deleteDataAsync = useCallback(
    async (key: IDBValidKey): Promise<void> => {
      if (!db) throw 'not connected';
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);

      await new Promise((resolve, reject) => {
        const request = store.delete(key);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
      });
    },
    [db, storeName]
  );

  return { addDataAsync, getDataAsync, deleteDataAsync, error, isConnected:!!db };
}
