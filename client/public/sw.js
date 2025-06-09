const CACHE_NAME = 'dermatech-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/offline.html',
  // Add other critical assets here
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  '/api/auth/me',
  '/api/appointments',
  '/api/health-records',
  '/api/notifications',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Install event');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Claim all clients immediately
  self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }
  
  // Handle other requests (assets, etc.)
  event.respondWith(handleAssetRequest(request));
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  const url = new URL(request.url);
  const cacheable = API_CACHE_PATTERNS.some(pattern => 
    url.pathname.startsWith(pattern)
  );
  
  if (!cacheable) {
    return fetch(request);
  }
  
  try {
    // Try network first
    const response = await fetch(request);
    
    if (response.ok && request.method === 'GET') {
      // Cache successful GET responses
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Network failed for API request, trying cache');
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for critical API endpoints
    if (url.pathname === '/api/auth/me') {
      return new Response(JSON.stringify({ error: 'Offline' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    throw error;
  }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    // Try network first
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Network failed for navigation, trying cache');
    
    // Try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return cached root for SPA routing
    const rootResponse = await caches.match('/');
    if (rootResponse) {
      return rootResponse;
    }
    
    // Last resort - offline page
    return caches.match(OFFLINE_URL);
  }
}

// Handle asset requests with cache-first strategy
async function handleAssetRequest(request) {
  // Try cache first for assets
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // If not in cache, fetch from network
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Failed to fetch asset:', request.url);
    
    // For images, return a placeholder
    if (request.destination === 'image') {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f1f5f9"/><text x="100" y="100" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-size="14" fill="#64748b">Image Offline</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    
    throw error;
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync());
  }
});

// Handle background sync
async function handleBackgroundSync() {
  try {
    // Get pending actions from IndexedDB
    const pendingActions = await getPendingActions();
    
    for (const action of pendingActions) {
      try {
        await fetch(action.url, action.options);
        await removePendingAction(action.id);
        console.log('[SW] Synced action:', action.id);
      } catch (error) {
        console.log('[SW] Failed to sync action:', action.id, error);
      }
    }
  } catch (error) {
    console.log('[SW] Background sync failed:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('[SW] Push event received');
  
  const options = {
    body: 'You have a new notification from DermaTech',
    icon: '/manifest-icon-192.png',
    badge: '/manifest-icon-192.png',
    tag: 'dermatech-notification',
    data: {},
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/manifest-icon-192.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ],
    requireInteraction: false,
    silent: false
  };
  
  if (event.data) {
    try {
      const data = event.data.json();
      options.body = data.message || options.body;
      options.data = data;
      
      if (data.appointment) {
        options.body = `Appointment reminder: ${data.appointment.doctor} at ${data.appointment.time}`;
        options.actions = [
          { action: 'join', title: 'Join Now' },
          { action: 'reschedule', title: 'Reschedule' }
        ];
      }
    } catch (error) {
      console.log('[SW] Failed to parse push data:', error);
    }
  }
  
  event.waitUntil(
    self.registration.showNotification('DermaTech', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click:', event.action);
  
  event.notification.close();
  
  const data = event.notification.data;
  let url = '/';
  
  switch (event.action) {
    case 'view':
      url = data.url || '/';
      break;
    case 'join':
      url = '/appointments';
      break;
    case 'reschedule':
      url = '/appointments';
      break;
    case 'dismiss':
      return; // Don't open anything
    default:
      url = data.url || '/';
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.postMessage({ type: 'NAVIGATE', url });
          return client.focus();
        }
      }
      
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});

// Utility functions for IndexedDB operations
async function getPendingActions() {
  // In a real implementation, this would read from IndexedDB
  return [];
}

async function removePendingAction(id) {
  // In a real implementation, this would remove from IndexedDB
  console.log('Removing pending action:', id);
}

// Periodic background sync for health data
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'health-data-sync') {
    event.waitUntil(syncHealthData());
  }
});

async function syncHealthData() {
  try {
    // Sync critical health data in background
    console.log('[SW] Syncing health data');
    
    const response = await fetch('/api/health-records?sync=true');
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put('/api/health-records', response.clone());
    }
  } catch (error) {
    console.log('[SW] Health data sync failed:', error);
  }
}

console.log('[SW] Service Worker loaded');
