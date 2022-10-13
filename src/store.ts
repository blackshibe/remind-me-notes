import { AnyAction, configureStore, createSlice, EnhancedStore, Reducer, ThunkMiddleware } from "@reduxjs/toolkit";
import * as FileSystem from "expo-file-system";

type wrap<T> = { payload: T; type: string };

export type note = {
	header: string;
	text: string;
	id: number;
	selected?: boolean;
};

type selectNote = {
	a: string;
};

export type AppStoreState = {
	notes: note[];
	next_note_id: number;
	selected_note?: selectNote;
};

export type AppStore = EnhancedStore<AppStoreState, AnyAction, [ThunkMiddleware<AppStoreState, AnyAction, undefined>]>;

const STORAGE_LOCATION = `${FileSystem.documentDirectory}storage.json`;

let initialState: AppStoreState = { notes: [], next_note_id: 0 };
let todosSlice = createSlice({
	name: "todos",
	initialState: () => initialState,
	reducers: {
		highlightNote(state: AppStoreState, action: wrap<selectNote | undefined>) {
			state.selected_note = action.payload;
		},
		addTodo(state: AppStoreState, action: wrap<{ text: string; header: string }>) {
			state.notes.push({
				text: action.payload.text,
				header: action.payload.header,
				id: state.next_note_id,
			});

			state.next_note_id += 1;
		},
		selectNote(state: AppStoreState, action: wrap<number>) {
			let note = state.notes.find((value) => value.id === action.payload);
			if (note) note.selected = !note.selected;
		},
		deleteNote(state: AppStoreState, action: wrap<number>) {
			state.notes = state.notes.filter((value) => action.payload != value.id);
		},
		restoreFromStorage(state: AppStoreState, action: wrap<AppStoreState>) {
			state = action.payload;
		},
	},
});

export const { highlightNote, selectNote, addTodo, deleteNote } = todosSlice.actions;
export async function createStore() {
	await FileSystem.readAsStringAsync(STORAGE_LOCATION)
		.then((value) => {
			console.log(value);
			initialState = JSON.parse(value);
		})
		.catch(console.log);

	let store = configureStore<AppStoreState>({
		reducer: todosSlice.reducer,
	});

	store.subscribe(() => {
		console.log("Saving data, todo: cooldown to saving data");
		FileSystem.writeAsStringAsync(STORAGE_LOCATION, JSON.stringify(store.getState()));
	});

	return store;
}
