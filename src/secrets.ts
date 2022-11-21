// FIREBASE_API_KEY=AIzaSyDoRPGSk6e0v-qgQqm3rP6OteheZ91wnHM
// FIREBASE_AUTH_DOMAIN=remind-me-fd28a.firebaseapp.com
// FIREBASE_DATABASE_URL=https://remind-me-fd28a-default-rtdb.europe-west1.firebasedatabase.app
// FIREBASE_PROJECT_ID=remind-me-fd28a
// FIREBASE_STORAGE_BUCKET=remind-me-fd28a.appspot.com
// FIREBASE_MESSAGING_SENDER_ID=1022313587212
// FIREBASE_APP_ID=1:1022313587212:android:cf899e03beb3598fa48429

import Constants from "expo-constants";

function getConstant(name: string) {
	const val = Constants.expoConfig?.extra?.[name];
	if (!val) throw `secret ${name} was not defined`;

	return val as string;
}

export const SECRETS = {
	FIREBASE_API_KEY: getConstant("FIREBASE_API_KEY"),
	FIREBASE_AUTH_DOMAIN: getConstant("FIREBASE_AUTH_DOMAIN"),
	FIREBASE_DATABASE_URL: getConstant("FIREBASE_DATABASE_URL"),
	FIREBASE_PROJECT_ID: getConstant("FIREBASE_PROJECT_ID"),
	FIREBASE_STORAGE_BUCKET: getConstant("FIREBASE_STORAGE_BUCKET"),
	FIREBASE_MESSAGING_SENDER_ID: getConstant("FIREBASE_MESSAGING_SENDER_ID"),
	FIREBASE_APP_ID: getConstant("FIREBASE_APP_ID"),
};
