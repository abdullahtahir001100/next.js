import axios from '@/utils/smartApi';
import { openDB } from 'idb';

const DB_NAME = 'smz-store-db';
const STORE_NAME = 'api-cache';

// Ye wo list hai jiska data hume cache se uthana hai
const CACHED_URLS = [
  '/api/settings',
  '/api/shopProducts',
  '/api/products',
  '/api/inquiries',
  '/api/collection-admin',
  '/api/sections',
  '/api/content_all'
];

// Helper to get DB
const getDb = async () => {
  return await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
};

// --- CUSTOM GET FUNCTION ---
const smartGet = async (url, config = {}) => {
  // 1. Check karein kya ye URL hamari cache list mein hai?
  // (Hum sirf exact matches check kar rahe hain, parameters hata kar)
  const cleanUrl = url.split('?')[0];
  const shouldCache = CACHED_URLS.some(endpoint => cleanUrl.includes(endpoint));

  if (shouldCache) {
    try {
      const db = await getDb();
      // Har URL ke liye unique key banegi (params ke sath)
      // e.g. "shop-products-/api/shopProducts?sort=new"
      const cacheKey = url; 
      
      // A. Pehle DB check karein
      const cachedData = await db.get(STORE_NAME, cacheKey);

      if (cachedData) {
        console.log(`⚡ [SmartAPI] Loading from Cache: ${url}`);
        // Fake Axios Response bana kar return karo
        return { 
          data: cachedData, 
          status: 200, 
          statusText: 'OK', 
          headers: {}, 
          config 
        };
      }
    } catch (err) {
      console.warn("Cache read failed, going to server...", err);
    }
  }

  // B. Agar Cache mein nahi hai, ya URL cache list mein nahi hai -> Server Call
  console.log(`🌐 [SmartAPI] Fetching from Server: ${url}`);
  const response = await axios.get(url, config);

  // C. Naya data aane par DB mein save karein (sirf agar ye cachable URL hai)
  if (shouldCache && response.status === 200) {
    try {
      const db = await getDb();
      const freshData = response.data.data || response.data; // Adjust based on your API structure
      await db.put(STORE_NAME, freshData, url);
    } catch (err) {
      console.warn("Cache write failed", err);
    }
  }

  return response;
};

// Export object that looks like Axios
const api = {
  get: smartGet,
  post: axios.post,   // Post request hamesha server pe jayegi
  put: axios.put,
  delete: axios.delete
};

export default api;