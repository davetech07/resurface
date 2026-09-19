// services/notifications.ts

import * as Notifications from "expo-notifications";

// Controls what happens when a notification fires while the app is open.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function setupNotifications(): Promise<boolean> {
  // Android 13+ requires a channel to exist before the permission
  // prompt will even appear.
  await Notifications.setNotificationChannelAsync("resurface-reminders", {
    name: "Resurface Reminders",
    importance: Notifications.AndroidImportance.HIGH,
  });

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function scheduleItemNotification(
  itemId: string,
  title: string,
  fireAt: string,
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    identifier: itemId, // reuse the item's own id as the notification id —
    // this means we can cancel it later with just the item id, no extra
    // mapping needed
    content: {
      title: "Time to revisit",
      body: title,
      data: { itemId },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: new Date(fireAt),
    },
  });
}

export async function cancelItemNotification(itemId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(itemId);
}
