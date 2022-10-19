import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { AppStoreState } from "../store";
import EditNote from "./EditNote";
import EditReminder from "./EditReminder";

export default function EditNoteRouter(props: { navigation: any }) {
	const selected_note = useSelector((state: AppStoreState) => state.selected_note);

	useEffect(() => {
		if (!selected_note) props.navigation.navigate("Main");
	}, [selected_note]);

	if (!selected_note) return <></>;
	else if (selected_note.type === "reminder") {
		return <EditReminder navigation={props.navigation} selected_id={selected_note.id} />;
	} else if (selected_note.type == "note") {
		return <EditNote navigation={props.navigation} selected_id={selected_note.id} />;
	}

	throw "what the fuck";
}
