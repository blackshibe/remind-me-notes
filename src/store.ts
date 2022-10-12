import { AnyAction, configureStore, createSlice, Reducer } from "@reduxjs/toolkit";

type todo = {
	id: string;
	text: string;
	completed: boolean;
};

type todoAdded = {
	payload: {
		id: string;
		text: string;
	};
};

type selectNote = {
	a: string;
};

export type AppStoreState = {
	todos: todo[];
	selected_note?: selectNote;
};

type wrap<T> = { payload: T; type: string };

const initialState: AppStoreState = { todos: [] };
const todosSlice = createSlice({
	name: "todos",
	initialState,
	reducers: {
		selectNote(state: AppStoreState, action: wrap<selectNote | undefined>) {
			console.log("action.payload", action.payload);
			state.selected_note = action.payload;
			console.log("state.selected_note", action.payload);
			console.log(state.selected_note);
		},
		todoAdded(state: AppStoreState, action: todoAdded) {
			state.todos.push({
				id: action.payload.id,
				text: action.payload.text,
				completed: false,
			});
		},
		todoToggled(state: AppStoreState, action: todoAdded) {
			// 	// const todo = state.find((todo) => todo.id === action.payload);
			// 	// if (todo) todo.completed = !todo.completed;
		},
	},
});

export const { selectNote, todoAdded, todoToggled } = todosSlice.actions;
export const store = configureStore<AppStoreState>({
	reducer: todosSlice.reducer,
});
