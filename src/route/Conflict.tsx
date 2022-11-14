import { useNavigation } from "@react-navigation/native";
import { getAuth, signOut } from "firebase/auth";
import React, { useEffect } from "react";
import { Image } from "react-native";
import { useSelector, useStore } from "react-redux";
import { IntroButton } from "../component/IntroButton";
import { FIREBASE_APP, FIREBASE_AUTH } from "../firebase";
import { AppStore, AppStoreState, overwriteUserData, setSyncConflict, storeFirstVisit, timeFormat } from "../store";
import { View, Text } from "../style/customComponents";
import getAppTheme, { styles } from "../style/styles";
import { ensureNoSerializables } from "../util/ensureNoSerializables";
import { getConvenientTime } from "../util/getConvenientTime";
import quickWarnAlert from "../util/quickWarnAlert";
import { updateNotifications } from "../util/updateNotification";

export default function Intro(props: {}) {
	const mainStyle = getAppTheme();
	const store = useStore<AppStoreState>();

	const conflict = useSelector((state: AppStoreState) => state.conflict);
	const last_modified = useSelector((state: AppStoreState) => state.last_modified);

	useEffect(() => {
		if (!conflict) {
			store.dispatch(setSyncConflict());
			store.dispatch(storeFirstVisit(true));
		}
	}, []);

	if (!conflict) return <></>;

	// i don't know why but last_modified is undefined otherwise
	const conflict_last_modified = ensureNoSerializables(conflict).last_modified;

	return (
		<View
			style={[
				styles.pageContainer,
				{ justifyContent: "center", alignContent: "center", flex: 1, alignItems: "center" },
				mainStyle,
			]}
		>
			<View style={{ width: "90%" }}>
				<Text style={styles.header}>Cloud data exists</Text>

				<Text style={{ marginBottom: 10 }}>
					There's app data stored in the cloud. What do you want to do with it?
				</Text>
				<Text style={{ marginBottom: 10 }}>
					Whichever option you choose, your current store state will be backed up.
				</Text>

				<Text>{getConvenientTime(timeFormat.twentyfour, new Date(conflict_last_modified || 0))}</Text>
				<Text>{getConvenientTime(timeFormat.twentyfour, new Date(last_modified))}</Text>

				<Text>{(conflict_last_modified || 0) / 1000}</Text>
				<Text>{last_modified / 1000}</Text>

				<View style={{ paddingTop: 25 }}>
					<IntroButton
						press={() => {
							quickWarnAlert(
								() => {
									if (!conflict) return;

									store.dispatch(overwriteUserData(conflict));
									store.dispatch(setSyncConflict());
									store.dispatch(storeFirstVisit(true));
									updateNotifications(store);
								},
								"Are you sure you want to use cloud data?",
								"Confirm"
							);
						}}
						text="Use Cloud data"
					/>
					<IntroButton
						press={() => {
							quickWarnAlert(
								() => {
									store.dispatch(setSyncConflict());
									store.dispatch(storeFirstVisit(true));
									updateNotifications(store);
								},
								"Are you sure you want to use your local data?",
								"Confirm"
							);
						}}
						text="Use Local data"
					/>
				</View>
			</View>
		</View>
	);
}
