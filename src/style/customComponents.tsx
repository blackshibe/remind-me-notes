import {
	View as OldView,
	TouchableOpacity as OldOpacity,
	Text as OldText,
	TextInput as OldTextInput,
} from "react-native";
import getAppTheme from "./styles";

export const View = (props: OldView["props"]) => {
	let style = getAppTheme();
	return <OldView {...props} style={[style, props.style]} />;
};

export const Text = (props: OldText["props"]) => {
	let style = getAppTheme();
	return <OldText {...props} style={[style, props.style]} />;
};

export const TouchableOpacity = (props: OldOpacity["props"]) => {
	let style = getAppTheme();
	return <OldOpacity {...props} activeOpacity={0.5} style={[style, props.style]} />;
};

export const TextInput = (props: OldTextInput["props"]) => {
	let style = getAppTheme();
	return <OldTextInput {...props} style={[style, props.style]} />;
};
