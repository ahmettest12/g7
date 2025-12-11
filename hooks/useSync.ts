
import { useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { useAppContext } from '../state/AppContext';
import { SyncQueueItem } from '../types';

export function useSync() {
    const { state, addNotification } = useAppContext();
    const [isSyncing, setIsSyncing] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

    // Determines the API URL based on the environment
    // In Vercel static deployment, if VITE_API_URL is not set, we assume offline/local-only mode
    // to prevent 404 errors when trying to hit a non-existent /api
    const API_URL = process.env.VITE_API_URL || ''; 

    // Monitor network status
    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            // Trigger sync immediately when coming back online
            syncNow();
        };
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Monitor queue size using Dexie live query
    const queueCount = useLiveQuery(() => db.syncQueue.count(), []) || 0;

    const syncNow = useCallback(async () => {
        // Only attempt sync if we are online AND we have a backend URL configured
        // This allows the app to run in "Local Mode" on Vercel without a backend
        if (!navigator.onLine || isSyncing || !API_URL) return;
        
        // 1. Get pending items
        const pendingItems = await db.syncQueue.toArray();
        if (pendingItems.length === 0) return;

        setIsSyncing(true);
        try {
            const companyId = state.currentUser?.companyId; 
            if (!companyId) {
                console.warn("Sync skipped: No company ID found (User might be logged out)");
                return;
            }

            // 2. Send to Server
            const response = await fetch(`${API_URL}/sync`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ companyId, changes: pendingItems })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Sync failed: ${response.status} - ${errorText}`);
            }

            // 3. On Success: Clear Queue & Update Local Entity Status
            await (db as any).transaction('rw', db.syncQueue, db.products, db.sales, async () => {
                // Delete items from queue
                const idsToDelete = pendingItems.map((i: SyncQueueItem) => i.id!);
                await db.syncQueue.bulkDelete(idsToDelete);

                // Mark entities as synced locally
                for (const item of pendingItems) {
                     if (item.dataType === 'PRODUCT' && item.payload.id) {
                         await db.products.update(item.payload.id, { syncStatus: 'synced' });
                     } else if (item.dataType === 'SALE' && item.payload.id) {
                         await db.sales.update(item.payload.id, { syncStatus: 'synced' });
                     }
                }
            });
            
            setLastSyncTime(new Date());
            console.log(`Sync successful: ${pendingItems.length} items processed.`);

        } catch (err) {
            console.error("Sync error:", err);
            // Optional: Notify user of sync failure
        } finally {
            setIsSyncing(false);
        }
    }, [isSyncing, state.currentUser, API_URL]);

    // Periodic Sync (every 60 seconds)
    useEffect(() => {
        if (!API_URL) return; // Don't set interval if no backend configured

        const interval = setInterval(() => {
            if (queueCount > 0 && navigator.onLine) {
                syncNow();
            }
        }, 60000); 
        return () => clearInterval(interval);
    }, [syncNow, queueCount, API_URL]);

    return { isOnline, isSyncing, queueCount, syncNow, lastSyncTime };
}
