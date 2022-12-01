import React from "react";
import { Dimensions } from "react-native";
import ImageZoom from "react-native-image-pan-zoom";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useSelector, useStore } from "react-redux";
import { AppStoreState, deleteFile, image, pinFile } from "../module/app_store";
import { useImage } from "../module/images";
import { Text, View } from "../style/customComponents";
import getAppTheme from "../style/styles";
import quickWarnAlert from "../util/quickWarnAlert";
import { BottomBarButton } from "./BottomBarButton";
import { GalleryButton } from "./GalleryButton";

export const ImageView = ({
	selectedImage,
	unselect,
	note_id,
}: {
	selectedImage: image;
	note_id: number;
	unselect: () => void;
}) => {
	const mainStyle = getAppTheme();
	let store = useStore();
	let notes = useSelector((state: AppStoreState) => state.notes);
	let note = notes?.find((value) => value.id === note_id);
	let isPinned = note?.pinned_image === selectedImage.name;
	let uri = useImage(selectedImage);

	return (
		<View>
			<ImageZoom
				// @ts-ignore typescript is wrong here again
				style={[mainStyle, { width: "100%", height: "100%" }]}
				cropWidth={Dimensions.get("window").width}
				cropHeight={Dimensions.get("window").height}
				imageWidth={Dimensions.get("window").width}
				imageHeight={Dimensions.get("window").height}
			>
				<Animated.Image
					entering={FadeIn}
					exiting={FadeOut}
					style={{
						width: Dimensions.get("window").width,
						height: Dimensions.get("window").height,
						resizeMode: "contain",
					}}
					source={{
						uri,
					}}
				/>
			</ImageZoom>
			{/* <View
				style={{
					position: "absolute",
					display: "flex",
					width: "100%",
					top: 24,
					paddingRight: 16,
					paddingLeft: 16,
					backgroundColor: "rgba(0,0,0,0)",
				}}
			>
				<Text>Added on the 24th Nov 2022</Text>
				<Text>synced to cloud</Text>
			</View> */}
			<View
				style={{
					position: "absolute",
					display: "flex",
					width: "100%",
					height: 70,
					bottom: 24,
					paddingRight: 8,
					paddingLeft: 8,
					backgroundColor: "rgba(0,0,0,0)",
					justifyContent: "space-between",
					flexDirection: "row",
				}}
			>
				<GalleryButton
					onclick={() => {
						if (isPinned) {
							store.dispatch(
								pinFile({
									noteId: note_id,
									imageName: undefined,
								})
							);
						} else {
							store.dispatch(
								pinFile({
									noteId: note_id,
									imageName: selectedImage.name,
								})
							);
						}
					}}
					name={isPinned ? "star-half" : "star"}
				/>

				<GalleryButton
					onclick={() =>
						quickWarnAlert(() => {
							store.dispatch(deleteFile({ imageName: selectedImage.name, noteId: note_id }));
							unselect();
						}, "Do you want to delete this file?")
					}
					name={"trash"}
				/>
			</View>
		</View>
	);
};
