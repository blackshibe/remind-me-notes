import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { getAuth, signOut } from "firebase/auth";
import React, { useEffect } from "react";
import { Image } from "react-native";
import { useSelector, useStore } from "react-redux";
import { IntroButton } from "../component/IntroButton";
import { appLoginTabNavigator } from "../LoginWrap";
import { AppStore, AppStoreState, storeFirstVisit } from "../module/app_store";
import { FIREBASE_AUTH } from "../module/firebase";
import { View, Text } from "../style/customComponents";
import getAppTheme, { styles } from "../style/styles";
import { useAuthUser } from "../util/useAuth";

import funny from "./fox.png";

export default function Intro(props: {}) {
	const mainStyle = getAppTheme();
	const navigator = useNavigation<StackNavigationProp<appLoginTabNavigator, "Intro">>();
	const store = useStore<AppStore>();
	const user = useAuthUser();

	const conflict = useSelector((state: AppStoreState) => state.conflict);

	useEffect(() => {
		if (conflict) navigator.navigate("Conflict" as never);
	}, [conflict]);

	return (
		<View
			style={[
				styles.pageContainer,
				{ justifyContent: "center", alignContent: "center", flex: 1, alignItems: "center" },
				mainStyle,
			]}
		>
			<View style={{ width: "90%" }}>
				<Text style={styles.header}>Remind Me</Text>
				<Text style={[styles.headerSmall, { marginBottom: 30 }]}>Convenient notes</Text>

				<View style={{ margin: 5, marginBottom: 20 }}>
					<Text style={{ marginBottom: 10 }}>
						Remind me is an open-source app that lets you easily create notes and reminders in one place.
					</Text>
					<Text>You can back up your data with an online account, or simply use the app offline.</Text>
				</View>

				{!user ? (
					<IntroButton press={() => navigator.navigate("Login")} text="Login / Register" />
				) : (
					<IntroButton
						press={() => {
							store.dispatch(storeFirstVisit(true));
						}}
						text="Continue"
					/>
				)}

				{!user ? (
					<IntroButton
						press={() => {
							store.dispatch(storeFirstVisit(true));
						}}
						text="Use the app offline"
					/>
				) : (
					<IntroButton
						press={() => {
							store.dispatch(storeFirstVisit(true));
							FIREBASE_AUTH.signOut();
						}}
						text="Log out"
					/>
				)}
			</View>
		</View>
	);
}
