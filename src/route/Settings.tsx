import React from "react";
import { useSelector, useStore } from "react-redux";
import { AppStoreState, setTheme, setTimeFormat, storeFirstVisit, timeFormat } from "../store";
import getAppTheme, { styles } from "../style/styles";
import { Header } from "../component/Header";
import { Button, useThemeMode } from "@rneui/themed";
import { View, Text } from "../style/customComponents";
import { Switch } from "../component/Switch";
import { IntroButton } from "../component/IntroButton";
import { getAuth, signOut } from "firebase/auth";
import { FIREBASE_APP } from "../firebase";
import { useAuthUser } from "../util/useAuth";
import quickWarnAlert from "../util/quickWarnAlert";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

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
									signOut(getAuth(FIREBASE_APP));
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
				</View>
			</View>
		</View>
	);
}
