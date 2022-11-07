import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { get, getDatabase, ref, set } from "firebase/database";
import { AppStoreState } from "./store";

const firebaseConfig = {
	apiKey: "AIzaSyDoRPGSk6e0v-qgQqm3rP6OteheZ91wnHM",
	authDomain: "remind-me-fd28a.firebaseapp.com",
	databaseURL: "https://remind-me-fd28a-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "remind-me-fd28a",
	storageBucket: "remind-me-fd28a.appspot.com",
	messagingSenderId: "1022313587212",
	appId: "1:1022313587212:android:cf899e03beb3598fa48429",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const FIREBASE_DATABASE = getDatabase(app);
export const FIREBASE_AUTH = getAuth(app);
export const FIREBASE_APP = initializeApp(firebaseConfig);

FIREBASE_AUTH.onAuthStateChanged((value) => console.log(`auth state changed: ${value?.email}`));

export const readUserData = async () => {
	console.log("reading firebase", "data/" + FIREBASE_AUTH.currentUser!.uid);

	let data = await get(ref(FIREBASE_DATABASE, "data/" + FIREBASE_AUTH.currentUser!.uid));
	return data as unknown as AppStoreState | undefined;
};

export const setUserData = (data: AppStoreState) => {
	console.log("saving to firebase", "data/" + FIREBASE_AUTH.currentUser!.uid);
	set(ref(FIREBASE_DATABASE, "data/" + FIREBASE_AUTH.currentUser!.uid), data).then((value) =>
		console.log("database written to")
	);
};
