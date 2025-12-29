import { saveOfflineAction } from './offlineStorage';

export const registerSync = async (tag: string) => {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        try {
            await (registration as any).sync.register(tag);
            console.log('Background Sync Registered:', tag);
        } catch (err) {
            console.error('Background Sync failed:', err);
        }
    } else {
        console.log('Background Sync not supported');
    }
};

export const queueAction = async (actionType: string, payload: any) => {
    // Normally check if offline, but can be called explicitly
    console.log('Queuing action for offline sync:', actionType);
    await saveOfflineAction({ type: actionType, payload });
    await registerSync('sync-updates');
};

// Push Notification Subscription Helper
export const subscribeToPush = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        try {
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY
            });
            // Send subscription to server
            console.log('Push Subscription:', subscription);
            return subscription;
        } catch (err) {
            console.error('Push Subscription failed:', err);
        }
    }
    return null;
};
