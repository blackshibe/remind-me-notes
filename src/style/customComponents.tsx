import { View as OldView } from "react-native";
import getAppTheme from "./styles";

export const View = (props: OldView["props"]) => {
	let style = getAppTheme();
	return <OldView {...props} style={[style, props.style]} />;
};
