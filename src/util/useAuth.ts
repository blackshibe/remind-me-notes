import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { FIREBASE_APP } from "../firebase";

const auth = getAuth(FIREBASE_APP);

export const useAuthUser = () => {
	let authUser = useState(auth.currentUser);

	useEffect(() => {
		let unsub = auth.onAuthStateChanged((user) => {
			authUser[1](user);
		});

		return () => unsub();
	}, []);

	return authUser[0];
};
