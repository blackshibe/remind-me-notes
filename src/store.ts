import { AnyAction, configureStore, createSlice, EnhancedStore, Reducer, ThunkMiddleware } from "@reduxjs/toolkit";
import * as FileSystem from "expo-file-system";
import { UserCredential } from "firebase/auth";
import { ref, set } from "firebase/database";
import { AppState, AppStateStatus } from "react-native";
import { FIREBASE_AUTH, FIREBASE_DATABASE, readUserData, setUserData } from "./firebase";

type wrap<T> = { payload: T; type: string };

export type note = {
	header: string;
	text: string;
	id: number;
	selected?: boolean;
	session_id: number;
	files: image[];
};

export type image = {
	uri: string;
	id: number;
	width: number;
	height: number;
};

export type reminder = {
	// useless
	header: string;

	due_time: number;
	text: string;
	notification_id: string;
	session_id: number;
	id: number;
	selected?: boolean;
	files: image[];
};

type noteEdit = {
	id: number;
	text?: string;
	header?: string;
};

type selectedNote = { type: "note" | "reminder"; id: number };
type selectedDate = { type: "date"; id: number };

export const enum timeFormat {
	twelve = 0,
	twentyfour = 1,
}

export type AppStoreState = {
	notes?: note[];
	reminders?: reminder[];

	next_note_id: number;
	next_reminder_id: number;
	next_file_id: number;

	theme?: "light" | "dark";
	push_token?: string;
	time_format: timeFormat;
	session_id: number;

	// used for comparing data states with each other
	operation_id: number;
	last_modified: number;
	first_visit_ended: boolean;
	store_initialized: boolean;

	selected_note?: selectedNote;
	selected_date?: selectedDate;
	selected_image?: image;

	conflict?: AppStoreState;
};

export type AppStore = EnhancedStore<AppStoreState, AnyAction, [ThunkMiddleware<AppStoreState, AnyAction, undefined>]>;

const STORAGE_LOCATION = `${FileSystem.documentDirectory}storage_v36.json`;

let overwriteInitialState: AppStoreState | undefined = undefined;
const INITIAL_STATE = (): AppStoreState => {
	if (overwriteInitialState) return overwriteInitialState;
	return {
		time_format: timeFormat.twentyfour,
		next_note_id: 1,
		next_reminder_id: 1,
		next_file_id: 1,
		session_id: 1,
		operation_id: 1,
		first_visit_ended: false,
		store_initialized: false,
		last_modified: new Date().getTime(),
	};
};

let todosSlice = createSlice({
	name: "todos",
	initialState: INITIAL_STATE,
	reducers: {
		reset(state: AppStoreState, action: wrap<undefined>) {
			overwriteInitialState = undefined;
			return INITIAL_STATE();
		},

		openNote(state: AppStoreState, action: wrap<selectedNote | undefined>) {
			state.selected_note = action.payload;
		},

		attachFileToNote(
			state: AppStoreState,
			action: wrap<{ file: { uri: string; height: number; width: number }; id: number }>
		) {
			let note = state.notes?.find((value) => value.id === action.payload.id);
			if (note)
				note.files.push({
					id: state.next_file_id,
					uri: action.payload.file.uri,
					height: action.payload.file.height,
					width: action.payload.file.width,
				});

			state.next_file_id += 1;
		},

		attachFileToReminder(
			state: AppStoreState,
			action: wrap<{ file: { uri: string; height: number; width: number }; id: number }>
		) {
			let note = state.reminders?.find((value) => value.id === action.payload.id);
			if (note)
				note.files.push({
					id: state.next_file_id,
					uri: action.payload.file.uri,
					height: action.payload.file.height,
					width: action.payload.file.width,
				});

			state.operation_id += 1;
			state.next_file_id += 1;
		},

		deleteFileFromNote(state: AppStoreState, action: wrap<{ note_id: number; file_id: number }>) {
			let note = state.notes?.find((value) => value.id === action.payload.note_id);
			if (note) note.files = note.files.filter((value) => action.payload.file_id != value.id);
		},

		deleteFileFromReminder(state: AppStoreState, action: wrap<{ note_id: number; file_id: number }>) {
			let note = state.reminders?.find((value) => value.id === action.payload.note_id);
			if (note) note.files = note.files.filter((value) => action.payload.file_id != value.id);
		},

		addNote(state: AppStoreState, action: wrap<{ text: string; header: string }>) {
			if (!state.notes) state.notes = [];
			state.notes.push({
				text: action.payload.text,
				header: action.payload.header,
				id: state.next_note_id,
				session_id: state.session_id,
				files: [],
			});

			state.operation_id += 1;
			state.next_note_id += 1;
			state.store_initialized = true;
		},
		addReminder(state: AppStoreState, action: wrap<{ text: string; notification_id: string; date: number }>) {
			if (!state.reminders) state.reminders = [];
			state.reminders.push({
				header: "Reminder",
				notification_id: action.payload.notification_id,
				due_time: action.payload.date, // new Date().getTime() + 60 * 60 * 1000,
				text: action.payload.text,
				id: state.next_reminder_id,
				session_id: state.session_id,
				files: [],
			});

			state.operation_id += 1;
			state.next_reminder_id += 1;
			state.store_initialized = true;
		},

		selectNote(state: AppStoreState, action: wrap<number>) {
			let note = state.notes?.find((value) => value.id === action.payload);
			if (note) note.selected = !note.selected;
		},
		selectReminder(state: AppStoreState, action: wrap<number>) {
			let reminder = state.reminders?.find((value) => value.id === action.payload);
			if (reminder) reminder.selected = !reminder.selected;
		},
		pickReminderDate(state: AppStoreState, action: wrap<selectedDate | undefined>) {
			state.selected_date = action.payload;
		},
		setReminderDate(state: AppStoreState, action: wrap<[selectedDate, number]>) {
			let reminder = state.reminders?.find((value) => value.id === action.payload[0].id);
			if (reminder) reminder.due_time = action.payload[1];
		},
		setReminderNotificationId(state: AppStoreState, action: wrap<[number, string]>) {
			let reminder = state.reminders?.find((value) => value.id === action.payload[0]);
			if (reminder) reminder.notification_id = action.payload[1];
		},

		deleteNote(state: AppStoreState, action: wrap<number>) {
			state.notes = state.notes?.filter((value) => action.payload != value.id);
		},
		deleteReminder(state: AppStoreState, action: wrap<number>) {
			state.reminders = state.reminders?.filter((value) => action.payload != value.id);
		},

		editNote(state: AppStoreState, action: wrap<noteEdit>) {
			let note = state.notes?.find((value) => value.id === action.payload.id);
			if (note) {
				let new_header = action.payload.header;
				let new_content = action.payload.text;
				if (new_header !== undefined) note.header = new_header;
				if (new_content !== undefined) {
					note.text = new_content;
				}
			}
		},
		editReminder(state: AppStoreState, action: wrap<noteEdit>) {
			let note = state.reminders?.find((value) => value.id === action.payload.id);
			if (note) {
				let new_content = action.payload.text;
				if (new_content !== undefined) note.text = new_content;
			}
		},

		setPushToken(state: AppStoreState, action: wrap<string>) {
			state.push_token = action.payload;
		},
		openImage(state: AppStoreState, action: wrap<image | undefined>) {
			state.selected_image = action.payload;
		},

		storeFirstVisit(state: AppStoreState, action: wrap<boolean>) {
			state.first_visit_ended = action.payload;
		},

		setTheme(state: AppStoreState, action: wrap<"light" | "dark">) {
			state.theme = action.payload;
			state.store_initialized = true;
		},

		setTimeFormat(state: AppStoreState, action: wrap<timeFormat>) {
			state.time_format = action.payload;
			state.store_initialized = true;
		},

		bumpSessionIndex(state: AppStoreState, action: wrap<undefined>) {
			state.session_id += 1;
		},

		overwriteUserData(state: AppStoreState, action: wrap<AppStoreState>) {
			return action.payload;
		},

		setSyncConflict(state: AppStoreState, action: wrap<AppStoreState | undefined>) {
			state.conflict = action.payload;
			if (state.conflict) delete state.conflict.conflict;
		},

		updateLastModified(state: AppStoreState) {
			state.last_modified = new Date().getTime();
		},
	},
});

export const {
	setPushToken,
	openNote,
	selectNote,
	addNote,
	deleteNote,
	editNote,
	addReminder,
	editReminder,
	deleteReminder,
	selectReminder,
	setReminderDate,
	setTheme,
	deleteFileFromNote,
	deleteFileFromReminder,
	pickReminderDate,
	attachFileToNote,
	attachFileToReminder,
	setReminderNotificationId,
	setTimeFormat,
	openImage,
	storeFirstVisit,
	bumpSessionIndex,
	overwriteUserData,
	setSyncConflict,
	updateLastModified,
	reset,
} = todosSlice.actions;
export async function createStore() {
	await FileSystem.readAsStringAsync(STORAGE_LOCATION)
		.then((value) => {
			overwriteInitialState = JSON.parse(value);
		})
		.catch(console.log);

	let store = configureStore<AppStoreState>({
		reducer: todosSlice.reducer,
	});

	AppState.addEventListener("change", (appState: AppStateStatus) => {
		if (appState === "background") {
			let storeState = store.getState();
			FileSystem.writeAsStringAsync(STORAGE_LOCATION, JSON.stringify(storeState));
		}
	});

	let storeDirty = false;
	const saveLoop = () => {
		if (storeDirty) {
			// juust in case
			let storeState = store.getState();

			// non serializable fields
			delete storeState.selected_note;
			delete storeState.selected_image;
			delete storeState.selected_date;
			delete storeState.conflict;

			FileSystem.writeAsStringAsync(STORAGE_LOCATION, JSON.stringify(storeState));

			if (FIREBASE_AUTH.currentUser && !storeState.conflict && storeState.store_initialized)
				setUserData(storeState);

			store.dispatch(updateLastModified());
			storeDirty = false;
		}
		setTimeout(saveLoop, 1000);
	};

	saveLoop();

	store.subscribe(() => (storeDirty = true));
	store.dispatch(bumpSessionIndex());

	return store;
}
