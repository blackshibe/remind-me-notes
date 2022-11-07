import { useNavigation } from "@react-navigation/native";
import { getAuth, signOut } from "firebase/auth";
import React from "react";
import { Image } from "react-native";
import { useSelector, useStore } from "react-redux";
import { IntroButton } from "../component/IntroButton";
import { FIREBASE_APP, FIREBASE_AUTH } from "../firebase";
import { AppStore, AppStoreState, storeFirstVisit } from "../store";
import { View, Text } from "../style/customComponents";
import getAppTheme, { styles } from "../style/styles";
import { useAuthUser } from "../util/useAuth";

import funny from "./fox.png";

export default function Intro(props: {}) {
	const mainStyle = getAppTheme();
	const navigator = useNavigation();
	const store = useStore<AppStore>();
	const user = useAuthUser();

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
				<Text style={[styles.headerSmall, { marginBottom: 30 }]}>bruh..... the fuck is this shit???</Text>

				<Image style={{ height: "40%", resizeMode: "center", width: "100%" }} source={funny} />

				<Text style={{ marginBottom: 10 }}>
					Remind me is an app where you can watch your favourite cat videos. We also sell illegal firearms
					here.
				</Text>
				<Text>You can back up your data with an online account, or simply use the app offline.</Text>

				<View style={{ paddingTop: 25 }}>
					{/* // FIXME */}
					{!user ? (
						<IntroButton press={() => navigator.navigate("Login" as never)} text="Login / Register" />
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
		</View>
	);
}
