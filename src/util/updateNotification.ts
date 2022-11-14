import { AppStore, reminder, setReminderNotificationId } from "../store";
import * as Notifications from "expo-notifications";

export const updateNotification = (store: AppStore, reminder: reminder) => {
	let unsubscribe = store.subscribe(() => {
		unsubscribe();

		let newReminder = store.getState().reminders?.find((value) => value.id === reminder.id);

		Notifications.cancelScheduledNotificationAsync(reminder.notification_id);
		if (!newReminder) return;

		Notifications.scheduleNotificationAsync({
			content: {
				title: "Reminder is due",
				body: newReminder.text,
				data: {},
			},
			trigger: { channelId: "default", date: newReminder.due_time },
		}).then((new_id) => {
			store.dispatch(setReminderNotificationId([reminder.id, new_id]));
		});
	});
};

export const updateNotifications = (store: AppStore) => {
	Notifications.cancelAllScheduledNotificationsAsync();
	store.getState().reminders?.forEach((reminder) => {
		let unsubscribe = store.subscribe(() => {
			unsubscribe();

			Notifications.scheduleNotificationAsync({
				content: {
					title: "Reminder is due",
					body: reminder.text,
					data: {},
				},
				trigger: { channelId: "default", date: reminder.due_time },
			}).then((new_id) => {
				store.dispatch(setReminderNotificationId([reminder.id, new_id]));
			});
		});
	});
};
