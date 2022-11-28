import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { AppStoreState } from "../module/app_store";
import EditNote from "./EditNote";

// this file is mostly unnecessary now
export default function EditNoteRouter(props: { navigation: any }) {
	const selectedNote = useSelector((state: AppStoreState) => state.selected_note);

	useEffect(() => {
		if (!selectedNote) props.navigation.navigate("Main");
	}, [selectedNote]);

	if (!selectedNote) return <></>;

	return <EditNote navigation={props.navigation} type={selectedNote.type} selected_id={selectedNote.id} />;
}
