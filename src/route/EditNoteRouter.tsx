import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { AppStoreState } from "../store";
import EditNote from "./EditNote";

// this file is mostly unnecessary now
export default function EditNoteRouter(props: { navigation: any }) {
	const selected_note = useSelector((state: AppStoreState) => state.selected_note);

	useEffect(() => {
		if (!selected_note) props.navigation.navigate("Main");
	}, [selected_note]);

	if (!selected_note) return <></>;
	return <EditNote navigation={props.navigation} type={selected_note.type} selected_id={selected_note.id} />;
}
