import { useNavigation } from "@react-navigation/native";
import { Button } from "@rneui/themed";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { useSelector, useStore } from "react-redux";
import { IntroButton } from "../component/IntroButton";
import { AppStore, AppStoreState, storeFirstVisit } from "../store";
import { View, Text } from "../style/customComponents";
import { FIREBASE_APP, FIREBASE_AUTH, readUserData } from "../firebase";
import getAppTheme, { styles } from "../style/styles";

export default function Login(props: {}) {
	const mainStyle = getAppTheme();
	const navigator = useNavigation();
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
				{/* // FIXME */}
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

								console.log("App signed in as", userCredential.user.email);
								console.log("local data initialized:", local_state.store_initialized);
								console.log("cloud initialized:", cloud_state !== undefined);

								if (cloud_state)
									console.log(
										"cloud data differs from local state:",
										cloud_state?.operation_id !== local_state.operation_id
									);

								store.dispatch(storeFirstVisit(true));
							})
							.catch((error) => {
								const errorCode = error.code;
								const errorMessage = error.message;

								fuckup[1](errorMessage);
								console.log(errorCode, errorMessage);
							});
					}}
					text="Login"
				/>
			</View>
		</View>
	);
}
