import React from "react";

import { Icon } from "@rneui/themed";
import getAppTheme, { styles } from "../style/styles";
import { TouchableOpacity } from "../style/customComponents";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

type buttonProps = {
	onclick: () => void;
	name: string;
	style?: any;
};

export const GalleryButton = ({ onclick, name, style }: buttonProps) => {
	const mainStyle = getAppTheme();

	return (
		<TouchableOpacity
			onPress={onclick}
			style={[
				styles.invertedNote,
				{ flex: 1, backgroundColor: mainStyle.backgroundColor, justifyContent: "center" },
				style,
			]}
		>
			<Animated.View entering={FadeIn}>
				<Icon name={name} type={"font-awesome"} size={18} color={mainStyle.color} />
			</Animated.View>
		</TouchableOpacity>
	);
};
