"use client"; // Client side hook hai
import { useState, useEffect } from 'react';
import { openDB } from 'idb';

const DB_NAME = 'smz-database';
const STORE_NAME = 'api-cache';

export function useCachedData(url, key) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Database open karo
      const db = await openDB(DB_NAME, 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        },
      });

      // 2. Pehle Local IndexedDB check karo
      const cachedData = await db.get(STORE_NAME, key);

      if (cachedData) {
        console.log("Loading from IndexedDB Cache...");
        setData(cachedData);
        setLoading(false);
        
        // Optional: Background mein fresh data laane ke liye API call bhi kar sakte ho
        // taaki next time updated data mile (Stale-while-revalidate pattern client side pe)
      } 
      
      // 3. Agar Cache nahi hai ya hume fresh data chahiye
      if (!cachedData) {
        try {
          console.log("Fetching from API...");
          const response = await fetch(url);
          const result = await response.json();

          // State update karo
          setData(result);
          
          // Future ke liye IndexedDB mein save karo
          await db.put(STORE_NAME, result, key);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [url, key]);

  return { data, loading };
}