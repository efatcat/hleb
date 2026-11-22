self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('message', e => {
  const { type, title, release, url } = e.data || {};
  if(type !== 'schedule') return;
  const when = new Date(release).getTime();
  if(when <= Date.now()) return;
  if(typeof TimestampTrigger === 'undefined') return; // fallback на клиентскую проверку
  self.registration.showNotification('HLEB GAME — вышла игра!', {
    body: `${title} уже доступна. Нажмите, чтобы играть.`,
    icon: '/hleb/LOGOhg.png',
    tag: 'hleb-release-' + title,
    data: { url },
    showTrigger: new TimestampTrigger(when),
  });
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data && e.notification.data.url;
  e.waitUntil(self.clients.openWindow(url || '/hleb/'));
});
