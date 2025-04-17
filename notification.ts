// notification.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Called once at app startup
export async function initNotifications() {
  // Ask for permission
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return false;
  // On Android, channel config
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily-reminder', {
      name: 'Daily Study Reminder',
      importance: Notifications.AndroidImportance.DEFAULT
    });
  }
  return true;
}

// Schedule a daily notification at given hour/minute
export async function scheduleDailyReminder(hour = 9, minute = 0) {
  // Cancel existing daily reminders
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "📚 Time to study!",
      body: "Come back to CodeClimb and continue your lessons today.",
      sound: true
    },
    trigger: {
      hour,
      minute,
      repeats: true,
      channelId: 'daily-reminder'
    }
  });
}

// Cancel all reminders
export async function cancelDailyReminder() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
