import React, { useState } from "react";
import { useSelector, useStore } from "react-redux";
import {
	AppStore,
	AppStoreState,
	overwriteUserData,
	reset,
	setTheme,
	setTimeFormat,
	storeFirstVisit,
	timeFormat,
} from "../module/app_store";
import getAppTheme, { styles } from "../style/styles";
import { Header } from "../component/Header";
import { useThemeMode } from "@rneui/themed";
import { View, Text } from "../style/customComponents";
import { Switch } from "../component/Switch";
import { IntroButton } from "../component/IntroButton";
import { signOut } from "firebase/auth";
import { useAuthUser } from "../util/useAuth";
import quickWarnAlert from "../util/quickWarnAlert";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { FIREBASE_AUTH } from "../module/firebase";
import * as Notifications from "expo-notifications";
import usePromise from "../util/usePromise";
import { NotificationRequest } from "expo-notifications";
import * as FileSystem from "expo-file-system";
import { ToastAndroid } from "react-native";
import * as DocumentPicker from "expo-document-picker";

const { StorageAccessFramework } = FileSystem;
const AnimatedText = (props: { text: string }) => (
	<Animated.View entering={FadeIn} exiting={FadeOut}>
		<Text style={styles.settingsItem}>{props.text}</Text>
	</Animated.View>
);

export default function Settings() {
	const mainStyle = getAppTheme();
	const { mode } = useThemeMode();
	const store = useStore<AppStoreState>();
	const currentTimeFormat = useSelector<AppStoreState>((state) => state.time_format);
	const user = useAuthUser();

	const toggleTheme = () => {
		store.dispatch(setTheme(mode === "dark" ? "light" : "dark"));
	};

	const toggleFormat = () => {
		store.dispatch(
			setTimeFormat(currentTimeFormat == timeFormat.twentyfour ? timeFormat.twelve : timeFormat.twentyfour)
		);
	};

	// let notifs = useState<NotificationRequest[]>([]);

	// usePromise(async () => {
	// 	notifs[1](await Notifications.getAllScheduledNotificationsAsync());
	// });

	return (
		<View style={[styles.pageContainer]}>
			<Header route={{ name: "App Settings" }} />
			<View style={[{ padding: 16, width: "100%" }]}>
				<View>
					<Text style={styles.headerSmall}>General</Text>
					<View style={styles.settingsItem}>
						<Text style={[mainStyle]}>Dark Theme</Text>
						<Switch onChange={toggleTheme} value={mode === "dark"} />
					</View>
					<View style={styles.settingsItem}>
						<Text style={[mainStyle]}>24hr Time Format</Text>
						<Switch onChange={toggleFormat} value={currentTimeFormat === timeFormat.twentyfour} />
					</View>
				</View>

				<View style={{ marginBottom: 20 }}>
					<Text style={styles.headerSmall}>Account</Text>
					{user && <AnimatedText text={`You are logged in as ${user.email?.replace("@whatever.com", "")}`} />}
					{!user && <AnimatedText text="Online backups are not set up." />}

					{user ? (
						<IntroButton
							text={"Log out"}
							press={() => {
								quickWarnAlert(() => {
									signOut(FIREBASE_AUTH);
								}, "are you sure you want to log out?");
							}}
						/>
					) : (
						<IntroButton
							text={"Set it up"}
							press={() => {
								store.dispatch(storeFirstVisit(false));
							}}
						/>
					)}

					<IntroButton
						text={"Reset app data"}
						press={() => {
							quickWarnAlert(() => {
								store.dispatch(reset());
								signOut(FIREBASE_AUTH);
								store.dispatch(storeFirstVisit(false));
							}, "are you sure you want to delete all your data? this will also delete all the changes in your sync account, and not sign you out.");
						}}
					/>
				</View>

				<View>
					<Text style={styles.headerSmall}>Backups</Text>
					<Text style={{ marginBottom: 10 }}>Images are not backed up along with app data.</Text>

					<IntroButton
						text={"Export app data"}
						press={() => {
							quickWarnAlert(
								async () => {
									let state = store.getState();
									delete state.conflict;

									let filename = new Date().toISOString();

									// Requests permissions for external directory
									const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync(
										"RemindMe"
									);

									if (permissions.granted) {
										// Gets SAF URI from response
										const uri = permissions.directoryUri;

										// Gets all files inside of selected directory
										console.log(`${decodeURI(uri)}/${filename}`);
										let safFileUri = await StorageAccessFramework.createFileAsync(
											uri,
											filename,
											"application/json"
										);

										await StorageAccessFramework.writeAsStringAsync(
											safFileUri,
											JSON.stringify(state)
										);

										ToastAndroid.show("Data saved!", ToastAndroid.LONG);
									} else {
										ToastAndroid.show("Permissions denied, not saving file", ToastAndroid.LONG);
									}
								},
								"You will now be prompted to select a folder to save your data in. It's best to create a new one.",
								"Warning"
							);
						}}
					/>
					<IntroButton
						text={"Import app data"}
						press={async () => {
							let document = await DocumentPicker.getDocumentAsync({ type: "application/json" });

							if (document.type === "cancel") {
								ToastAndroid.show("Cancelled data import", ToastAndroid.LONG);
								return;
							}

							let contents = await FileSystem.readAsStringAsync(document.uri);
							let backup: AppStoreState = JSON.parse(contents);

							quickWarnAlert(
								() => {
									store.dispatch(overwriteUserData(backup));
								},
								`The backup you imported has ${
									backup.notes?.length || "no"
								} notes. Do you want to overwrite it?`,
								"Are you sure?"
							);
						}}
					/>
				</View>

				{/* {notifs[0].map((value, index) => (
					<View>
						<Text style={{ color: "white" }}>{index}</Text>
						<Text style={{ color: "white" }}>{value.content.title}</Text>
						<Text style={{ color: "white" }}>{value.content.body}</Text>
					</View>
				))} */}
			</View>
		</View>
	);
}
