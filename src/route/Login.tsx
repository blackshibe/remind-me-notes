import { useNavigation } from "@react-navigation/native";
import { Button } from "@rneui/themed";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { useSelector, useStore } from "react-redux";
import { IntroButton } from "../component/IntroButton";
import { AppStore, AppStoreState, overwriteUserData, setSyncConflict, storeFirstVisit } from "../module/app_store";
import { View, Text } from "../style/customComponents";
import getAppTheme, { styles } from "../style/styles";
import { appLoginTabNavigator } from "../LoginWrap";
import { StackNavigationProp } from "@react-navigation/stack";
import { updateNotifications } from "../util/updateNotification";
import { FIREBASE_AUTH, readUserData } from "../module/firebase";

export default function Login(props: {}) {
	const navigator = useNavigation<StackNavigationProp<appLoginTabNavigator, "Intro">>();
	const store = useStore<AppStoreState>();

	let passwd = useState("");
	let username = useState("");
	let fuckup = useState("");

	return (
		<View
			style={
				(styles.pageContainer,
				{ justifyContent: "center", alignContent: "center", flex: 1, alignItems: "center" })
			}
		>
			<Text style={styles.header}>Setup</Text>

			<View style={{ paddingTop: 25, minWidth: "70%" }}>
				<TextInput
					onChangeText={(value) => username[1](value)}
					style={{ backgroundColor: "black", color: "white", padding: 10, borderRadius: 8, marginBottom: 8 }}
					placeholder={"username"}
					placeholderTextColor={"grey"}
				/>

				<TextInput
					secureTextEntry={true}
					onChangeText={(value) => passwd[1](value)}
					style={{ backgroundColor: "black", color: "white", padding: 10, borderRadius: 8, marginBottom: 8 }}
					placeholder={"password"}
					placeholderTextColor={"grey"}
				/>

				<Text>{fuckup[0]}</Text>

				<IntroButton
					press={() => {
						createUserWithEmailAndPassword(FIREBASE_AUTH, username[0] + "@whatever.com", passwd[0])
							.then((userCredential) => {
								const user = userCredential.user;
								console.log("App created account as ", user.email);
								console.log("local data initialized:", store.getState().store_initialized);

								store.dispatch(storeFirstVisit(true));
							})
							.catch((error) => {
								const errorCode = error.code;
								const errorMessage = error.message;

								fuckup[1](errorMessage);
								console.log(errorCode, errorMessage);
							});
					}}
					text="Register"
				/>

				<IntroButton
					press={() => {
						signInWithEmailAndPassword(FIREBASE_AUTH, username[0] + "@whatever.com", passwd[0])
							.then(async (userCredential) => {
								let local_state = store.getState();
								let cloud_state = await readUserData();

								console.log("app signed in as", userCredential.user.email);
								console.log("local data initialized:", local_state.store_initialized);
								console.log("cloud initialized:", cloud_state !== undefined);

								let conflict_occuring =
									cloud_state?.operation_id !== local_state.operation_id &&
									local_state.store_initialized;

								if (conflict_occuring && cloud_state) {
									store.dispatch(setSyncConflict(cloud_state));
									navigator.navigate("Conflict");
								} else {
									if (cloud_state) store.dispatch(overwriteUserData(cloud_state));

									updateNotifications(store);
									store.dispatch(storeFirstVisit(true));
								}
							})
							.catch((error) => {
								const errorCode = error.code;
								const errorMessage = error.message;

								fuckup[1](errorMessage);
								console.log(`failure while signing in: code=${errorCode} message=${errorMessage}`);
							});
					}}
					text="Login"
				/>
			</View>
		</View>
	);
}
