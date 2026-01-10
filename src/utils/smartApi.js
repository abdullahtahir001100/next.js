import axios from '@/utils/smartApi';

const DB_NAME = 'smz-store-db';
const STORE_NAME = 'api-cache';

const CACHED_URLS = [
  '/api/settings',
  '/api/shopProducts',
  '/api/products',
  '/api/inquiries',
  '/api/collection-admin',
  '/api/sections',
  '/api/content_all'
];

// ✅ Safe DB getter
const getDb = async () => {
  if (typeof window === "undefined") return null;

  const { openDB } = await import('idb');

  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
};

const smartGet = async (url, config = {}) => {
  const cleanUrl = url.split('?')[0];
  const shouldCache = CACHED_URLS.some(endpoint =>
    cleanUrl.includes(endpoint)
  );

  // ✅ Cache READ (client only)
  if (shouldCache && typeof window !== "undefined") {
    try {
      const db = await getDb();
      if (db) {
        const cachedData = await db.get(STORE_NAME, url);
        if (cachedData) {
          return {
            data: cachedData,
            status: 200,
            statusText: 'OK',
            headers: {},
            config
          };
        }
      }
    } catch (e) {
      console.warn("Cache read failed");
    }
  }

  // 🌐 Server request
  const response = await axios.get(url, config);

  // ✅ Cache WRITE
  if (shouldCache && response.status === 200 && typeof window !== "undefined") {
    try {
      const db = await getDb();
      if (db) {
        const freshData = response.data.data ?? response.data;
        await db.put(STORE_NAME, freshData, url);
      }
    } catch (e) {
      console.warn("Cache write failed");
    }
  }

  return response;
};

const api = {
  get: smartGet,
  post: axios.post,
  put: axios.put,
  delete: axios.delete
};

export default api;
