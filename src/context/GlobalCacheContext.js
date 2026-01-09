"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { openDB } from 'idb';

const CacheContext = createContext();

const DB_NAME = 'smz-store-db';
const STORE_NAME = 'api-cache';

// ✅ FINAL LIST: Sirf wo 5 APIs jo aapne confirm ki hain
const API_ENDPOINTS = [
  { key: 'collection-admin', url: '/api/CollectionAdmin' },
  { key: 'inquiries', url: '/api/inquiries' },
  { key: 'products', url: '/api/products' },
  { key: 'settings', url: '/api/settings' },
  { key: 'shop-products', url: '/api/shopProducts' }
];

export const GlobalCacheProvider = ({ children }) => {
  const [db, setDb] = useState(null);
  const [globalData, setGlobalData] = useState({}); 
  const [isReady, setIsReady] = useState(false);

  // 1. Database Initialize
  useEffect(() => {
    const initDB = async () => {
      const database = await openDB(DB_NAME, 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        },
      });
      setDb(database);
    };
    initDB();
  }, []);

  // 2. Fetch & Cache Logic
  const fetchAndCacheData = async (key, url) => {
    if (!db) return;

    try {
      // A. Cache se data uthao (Instant Load)
      const cachedData = await db.get(STORE_NAME, key);
      if (cachedData) {
        setGlobalData((prev) => ({ ...prev, [key]: cachedData }));
      }

      // B. API Call
      const response = await fetch(url);
      
      // Agar API fail ho, toh code break na ho
      if (!response.ok) return;

      const resJson = await response.json();
      const freshData = resJson.data || resJson;

      // C. Agar naya data mila, toh update karo
      if (JSON.stringify(freshData) !== JSON.stringify(cachedData)) {
        await db.put(STORE_NAME, freshData, key);
        setGlobalData((prev) => ({ ...prev, [key]: freshData }));
      }

    } catch (error) {
      // Silent Fail
    }
  };

  // 3. Loop Chalao Sirf Inhi 5 APIs Par
  useEffect(() => {
    if (db) {
      const loadAllData = async () => {
        await Promise.all(
          API_ENDPOINTS.map((endpoint) => 
            fetchAndCacheData(endpoint.key, endpoint.url)
          )
        );
        setIsReady(true);
      };
      loadAllData();
    }
  }, [db]);

  return (
    <CacheContext.Provider value={{ db, globalData, isReady }}>
      {children}
    </CacheContext.Provider>
  );
};

export const useGlobalCache = () => useContext(CacheContext);