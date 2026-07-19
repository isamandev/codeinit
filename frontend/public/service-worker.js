self.addEventListener("push", function (event) {
  console.log("Push event received:", event);

  if (!event.data) {
    console.log("Push event has no data.");
    return;
  }

  let notificationData = {};

  try {
    notificationData = event.data.json();
  } catch (error) {
    console.error("Error parsing notification data:", error);
    return;
  }

  const options = {
    body: notificationData.body || "You have a new notification.",
    icon: notificationData.icon || "/icon.png",
    badge: notificationData.badge || "/badge.png",
    data: notificationData.data || {},
    requireInteraction: false,
  };

  event.waitUntil(
    self.registration.showNotification(
      notificationData.title || "New Notification",
      options,
    ),
  );
});

self.addEventListener("notificationclick", function (event) {
  console.log("Notification click event:", event);

  event.notification.close();

  const jobId = event.notification.data.jobId;
  const urlToOpen = jobId ? `/jobs/${jobId}` : "/jobs";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        for (const client of clientList) {
          client.focus();
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});
