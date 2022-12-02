import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { get, getDatabase, ref, set } from "firebase/database";
import { getStorage } from "firebase/storage";
import { ensureNoSerializables } from "../util/ensureNoSerializables";
import { AppStoreState } from "./app_store";
import { SECRETS } from "./secrets";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
	apiKey: SECRETS.FIREBASE_API_KEY,
	authDomain: SECRETS.FIREBASE_AUTH_DOMAIN,
	databaseURL: SECRETS.FIREBASE_DATABASE_URL,
	projectId: SECRETS.FIREBASE_PROJECT_ID,
	storageBucket: SECRETS.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: SECRETS.FIREBASE_MESSAGING_SENDER_ID,
	appId: SECRETS.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const FIREBASE_DATABASE = getDatabase(app);
export const FIREBASE_AUTH = getAuth(app);
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_STORAGE = getStorage(app);

FIREBASE_AUTH.onAuthStateChanged((value) => console.log(`auth state changed: ${value?.email}`));

const fixArray = <T>(obj: { [index: string]: T } | T[]): T[] => {
	if (!obj) return [];
	let arr: T[] = [];

	Object.keys(obj).forEach((index) => {
		arr[parseInt(index)] = (obj as never)[index];
	});

	return arr;
};

export const readUserData = async () => {
	console.log("reading firebase", "data/" + FIREBASE_AUTH.currentUser!.uid);

	let data = await get(ref(FIREBASE_DATABASE, "data/" + FIREBASE_AUTH.currentUser!.uid));
	let cloud_state = data as unknown as AppStoreState | undefined;
	if (!cloud_state) return;

	// cloud_state is non mutable because fuck you
	let fixed_cloud_state = ensureNoSerializables(cloud_state) as AppStoreState;

	// firebase deletes empty values because fuck you
	if (!fixed_cloud_state.notes) fixed_cloud_state.notes = [];

	// and also firebase turns arrays into objects because fuck you
	fixed_cloud_state.notes = fixArray(fixed_cloud_state.notes);
	fixed_cloud_state.notes.forEach((element) => (element.files = fixArray(element.files || [])));

	return fixed_cloud_state;
};

export const setUserData = (data: AppStoreState) => {
	console.log("saving to firebase", "data/" + FIREBASE_AUTH.currentUser!.uid);

	// https://stackoverflow.com/questions/34708566/firebase-update-failed-first-argument-contains-undefined-in-property#49122699
	https: set(ref(FIREBASE_DATABASE, "data/" + FIREBASE_AUTH.currentUser!.uid), ensureNoSerializables(data)).then(
		(value) => console.log("database written to")
	);
};
