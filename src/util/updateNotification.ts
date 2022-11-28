import { AppStore, reminder, setReminderNotificationId } from "../module/app_store";
import * as Notifications from "expo-notifications";

export const updateNotification = (store: AppStore, reminder: reminder) => {
	let unsubscribe = store.subscribe(() => {
		unsubscribe();

		let newReminder = store
			.getState()
			.notes?.find((value) => value.type === "reminder" && value.id === reminder.id) as reminder;

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
	store.getState().notes?.forEach((reminder) => {
		if (reminder.type !== "reminder") return;

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
