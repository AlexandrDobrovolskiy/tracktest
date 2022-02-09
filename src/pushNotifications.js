export const NotificationErrors = {
  BLOCKED_PERMISSIONS: 'blocked-permissions',
};

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function checkNotificationPermission() {
  return new Promise((resolve, reject) => {
    if (Notification.permission === 'denied') {
      return reject({ error: NotificationErrors.BLOCKED_PERMISSIONS });
    }

    if (Notification.permission === 'granted') {
      return resolve();
    }

    if (Notification.permission === 'default') {
      return Notification.requestPermission().then(result => {
        if (result !== 'granted') {
          reject({ error: NotificationErrors.BLOCKED_PERMISSIONS });
        } else {
          resolve();
        }
      });
    }

    return reject(new Error('Unknown permission'));
  });
}

export const getSubscription = () => checkNotificationPermission()
  .then(() => navigator.serviceWorker.ready)
  .then(serviceWorkerRegistration => serviceWorkerRegistration.pushManager.getSubscription())
  .then(subscription => subscription ? ({
    endpoint: subscription.endpoint,
    authToken: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth')))),
    publicKey: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')))),
    contentEncoding: (PushManager.supportedContentEncodings || ['aesgcm'])[0],
  }) : null);

export const subscribe = () => checkNotificationPermission()
  .then(() => navigator.serviceWorker.ready)
  .then(serviceWorkerRegistration =>
    serviceWorkerRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array("BB2UY7ag43i3J3APnE-X2zHtyxiSXv_-wHXJY187_7aF82hhCpOqAKOfOIUszJQu2eD-bMYzCDQWoJNszN-eZKg"),
    })
  )
  .then(subscription => ({
    endpoint: subscription.endpoint,
    authToken: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth')))),
    publicKey: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')))),
    contentEncoding: (PushManager.supportedContentEncodings || ['aesgcm'])[0],
  }))
  .catch(e => {
    if (Notification.permission === 'denied') {
      console.warn('Notifications are denied by the user.');
    } else {
      console.error('Impossible to subscribe to push notifications', e);
    }
  })
