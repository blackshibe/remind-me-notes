import { AnyAction, configureStore, createSlice, EnhancedStore, Reducer, ThunkMiddleware } from "@reduxjs/toolkit";
import * as FileSystem from "expo-file-system";

type wrap<T> = { payload: T; type: string };

export type note = {
	header: string;
	text: string;
	id: number;
	selected?: boolean;
	files: file[];
};

export type file = {
	type: "image" | "unknown";
	uri: string;
	name: string;
	id: number;
};

export type reminder = {
	due_time: number;
	text: string;
	id: number;
	selected?: boolean;
	files: file[];
};

type noteEdit = {
	id: number;
	text?: string;
	header?: string;
};

type selectedNote = { type: "note" | "reminder"; id: number };
export type AppStoreState = {
	notes: note[];
	reminders: reminder[];

	next_note_id: number;
	next_reminder_id: number;
	next_file_id: number;

	push_token?: string;
	selected_note?: selectedNote;
};

export type AppStore = EnhancedStore<AppStoreState, AnyAction, [ThunkMiddleware<AppStoreState, AnyAction, undefined>]>;

const STORAGE_LOCATION = `${FileSystem.documentDirectory}storage_v5.json`;

let initialState: AppStoreState = { notes: [], reminders: [], next_note_id: 1, next_reminder_id: 1, next_file_id: 1 };
let todosSlice = createSlice({
	name: "todos",
	initialState: () => initialState,
	reducers: {
		openNote(state: AppStoreState, action: wrap<selectedNote | undefined>) {
			state.selected_note = action.payload;
		},

		attachFileToNote(
			state: AppStoreState,
			action: wrap<{ file: { type: "image" | "unknown"; uri: string; name: string }; id: number }>
		) {
			let note = state.notes.find((value) => value.id === action.payload.id);
			if (note)
				note.files.push({
					id: state.next_file_id,
					type: action.payload.file.type,
					uri: action.payload.file.uri,
					name: action.payload.file.name,
				});

			state.next_file_id += 1;
		},

		deleteFileFromNote(state: AppStoreState, action: wrap<{ note_id: number; file_id: number }>) {
			let note = state.notes.find((value) => value.id === action.payload.note_id);
			if (note) note.files = note.files.filter((value) => action.payload.file_id != value.id);
		},

		addNote(state: AppStoreState, action: wrap<{ text: string; header: string }>) {
			state.notes.push({
				text: action.payload.text,
				header: action.payload.header,
				id: state.next_note_id,
				files: [],
			});

			state.next_note_id += 1;
		},
		addReminder(state: AppStoreState, action: wrap<{ text: string }>) {
			state.reminders.push({
				due_time: new Date().getTime() + 60 * 60 * 1000,
				text: action.payload.text,
				id: state.next_reminder_id,
				files: [],
			});

			state.next_reminder_id += 1;
		},

		selectNote(state: AppStoreState, action: wrap<number>) {
			let note = state.notes.find((value) => value.id === action.payload);
			if (note) note.selected = !note.selected;
		},
		selectReminder(state: AppStoreState, action: wrap<number>) {
			let reminder = state.reminders.find((value) => value.id === action.payload);
			if (reminder) reminder.selected = !reminder.selected;
		},

		deleteNote(state: AppStoreState, action: wrap<number>) {
			state.notes = state.notes.filter((value) => action.payload != value.id);
		},
		deleteReminder(state: AppStoreState, action: wrap<number>) {
			state.reminders = state.reminders.filter((value) => action.payload != value.id);
		},

		editNote(state: AppStoreState, action: wrap<noteEdit>) {
			let note = state.notes.find((value) => value.id === action.payload.id);
			if (note) {
				let new_header = action.payload.header;
				let new_content = action.payload.text;
				if (new_header !== undefined) note.header = new_header;
				if (new_content !== undefined) note.text = new_content;
			}
		},
		editReminder(state: AppStoreState, action: wrap<noteEdit>) {
			let note = state.reminders.find((value) => value.id === action.payload.id);
			if (note) {
				let new_content = action.payload.text;
				if (new_content !== undefined) note.text = new_content;
			}
		},

		setPushToken(state: AppStoreState, action: wrap<string>) {
			state.push_token = action.payload;
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
	deleteFileFromNote,
	attachFileToNote,
} = todosSlice.actions;
export async function createStore() {
	await FileSystem.readAsStringAsync(STORAGE_LOCATION)
		.then((value) => {
			initialState = JSON.parse(value);
		})
		.catch(console.log);

	let store = configureStore<AppStoreState>({
		reducer: todosSlice.reducer,
	});

	store.subscribe(() => {
		new Promise(() => {
			let store_state = store.getState();
			store_state.selected_note = undefined;
			// i'm lazy
			console.log("todo: cooldown to saving redux state");
			FileSystem.writeAsStringAsync(STORAGE_LOCATION, JSON.stringify(store_state));
		});
	});

	return store;
}
