import React, { useState } from "react";
import { Vibration, Text } from "react-native";
import { useStore } from "react-redux";
import quickWarnAlert from "../util/quickWarnAlert";
import { BottomBarButton } from "./BottomBarButton";
import { TouchableOpacity, View } from "../style/customComponents";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import getAppTheme from "../style/styles";
import { deleteFile, image, imageType, openImage, pinFile } from "../module/app_store";
import { delete_local_image, useImage } from "../module/images";
import { Icon } from "@rneui/themed";

type fileSampleProps = { noteId: number; index: string | number; type: string; full: boolean; data: image };
export const FileSample = ({ index, noteId: note_id, data: selectedImage, type }: fileSampleProps) => {
	let [selected, setSelected] = useState(false);
	const mainStyle = getAppTheme();
	let store = useStore();
	let uri = useImage(selectedImage);

	return (
		<TouchableOpacity
			key={index}
			style={{
				flex: 1,
				height: 128,
				marginRight: 8,
				aspectRatio: 1,
				justifyContent: "center",
			}}
			onLongPress={() => {
				Vibration.vibrate(50);
				setSelected(true);
			}}
			onPress={() => store.dispatch(openImage(selectedImage))}
		>
			{selected ? (
				<View
					style={{
						flex: 1,
					}}
				>
					<BottomBarButton
						style={{ margin: 0, marginBottom: 4 }}
						onclick={() =>
							quickWarnAlert(() => {
								delete_local_image(selectedImage.name);
								store.dispatch(deleteFile({ imageName: selectedImage.name, noteId: note_id }));
							}, "Do you want to delete this file?")
						}
						name={"trash"}
					/>
					<BottomBarButton
						style={{ margin: 0, marginTop: 4 }}
						onclick={() => setSelected(false)}
						name={"undo"}
					/>
				</View>
			) : (
				<Animated.View
					style={{
						backgroundColor: "black",
						flex: 1,
						justifyContent: "center",
						borderRadius: 8,
					}}
				>
					<Animated.Image
						entering={FadeIn}
						source={{ uri }}
						style={{
							width: "100%",
							height: "100%",
							borderRadius: 8,
							borderWidth: 2,
							borderColor: mainStyle.color,
						}}
					/>
				</Animated.View>
			)}
			<View
				style={{
					position: "absolute",
					display: "flex",
					justifyContent: "flex-start",
					bottom: 8,
					left: 8,
					backgroundColor: "rgba(0,0,0,0)",
				}}
			>
				{selectedImage.type !== imageType.local && (
					<Icon
						name={selectedImage.type == imageType.cloud ? "cloud" : "file-upload"}
						size={16}
						color={"white"}
					/>
				)}
			</View>
		</TouchableOpacity>
	);
};
