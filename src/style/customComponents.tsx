import { TouchableOpacity as OldOpacity, Text as OldText, TextInput as OldTextInput } from "react-native";
import Animated from "react-native-reanimated";
import getAppTheme from "./styles";

export const View = (props: Animated.View["props"]) => {
	let style = getAppTheme();
	return <Animated.View {...props} style={[style, props.style]} />;
};

export const Text = (props: OldText["props"]) => {
	let style = getAppTheme();
	return <OldText {...props} style={[style, props.style, { backgroundColor: "rgba(0,0,0,0)" }]} />;
};

export const TouchableOpacity = (props: OldOpacity["props"]) => {
	let style = getAppTheme();
	return <OldOpacity {...props} activeOpacity={0.7} style={[style, props.style]} />;
};

export const TextInput = (props: OldTextInput["props"]) => {
	let style = getAppTheme();
	return <OldTextInput {...props} style={[style, props.style]} />;
};
