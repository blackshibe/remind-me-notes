import { Icon } from "@rneui/themed";
import React from "react";
import { View, Text } from "../style/customComponents";
import { image } from "../store";
import getAppTheme from "../style/styles";

export const NoteFiles = (props: { files: image[] }) => {
	const mainStyle = getAppTheme();
	const invertedText = {
		backgroundColor: "rgba(0,0,0,0)",
		color: mainStyle.backgroundColor,
		borderColor: mainStyle.color,
	};

	return props.files.length ? (
		<View style={[{ flex: 1, marginTop: 8, flexDirection: "row", alignItems: "center" }, invertedText]}>
			<Icon
				name={"file"}
				type={"font-awesome"}
				size={12}
				style={{ marginRight: 8 }}
				color={mainStyle.backgroundColor}
			/>
			<Text style={[invertedText]}>{props.files.length} files</Text>
		</View>
	) : (
		<></>
	);
};
