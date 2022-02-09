self.addEventListener('push', function (event) {
  if (!(self.Notification && self.Notification.permission === 'granted')) {
    return;
  }

  const sendNotification = dataStr => {
    const data = JSON.parse(dataStr);

    return self.registration.showNotification(data.title, {
      body: data.body,
      badge: data.badge,
      image: data.image,
      data: { actions: data.actions, url: data.url },
      icon: data.icon,
      vibrate: data.vibrate,
      tag: data.tag,
      actions: data.actions,
    });
  };

  if (event.data) {
    const message = event.data.text();
    event.waitUntil(sendNotification(message));
  }
});

self.addEventListener('notificationclick', function(event) {
  const clickedNotification = event.notification;
  const clickedAction = clickedNotification.data.actions.find(({ action }) => action === event.action);
  const url = clickedNotification.data.url;

  event.waitUntil(clients.matchAll({ type: 'window' }).then(clientsArr => {
    if (!event.action) {
      const hadWindowToFocus = clientsArr.find(windowClient => windowClient.url === url);

      if (hadWindowToFocus && url) {
        return hadWindowToFocus.focus();
      } else if (url) {
        return clients.openWindow(url).then(windowClient => windowClient ? windowClient.focus() : null)
      }
    } else if (clickedAction && clickedAction.url) {
      return clients.openWindow(clickedAction.url);
    }
  }));

  clickedNotification.close();
});
