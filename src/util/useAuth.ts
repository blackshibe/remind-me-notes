import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { FIREBASE_AUTH } from "../module/firebase";

export const useAuthUser = () => {
	let authUser = useState(FIREBASE_AUTH.currentUser);

	useEffect(() => {
		let unsub = FIREBASE_AUTH.onAuthStateChanged((user) => {
			authUser[1](user);
		});

		return () => unsub();
	}, []);

	return authUser[0];
};
