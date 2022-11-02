import React from "react";
import { Pressable } from "react-native";
import { View } from "../style/customComponents";

type props<T, E> = {
	data: T[];
	renderer: (props: { element: T; key: number; extra: E }) => JSX.Element;
	columns: number;
	extra_props: E;
};

export const MasonryList = <T, E>(props: props<T, E>): JSX.Element => {
	let children: JSX.Element[] = [];
	let columns: JSX.Element[][] = [];
	let current_column = 0;

	props.data.forEach((element, index) => {
		// todo: dragging behavior
		children.push(<props.renderer element={element} key={index} extra={props.extra_props} />);
	});

	children.forEach((element) => {
		columns[current_column] = columns[current_column] || [];
		columns[current_column].push(element);

		current_column += 1;
		current_column %= props.columns;
	});

	return (
		<View style={{ flex: 1, flexDirection: "row" }}>
			{columns.map((value, index) => {
				return (
					<View
						style={{
							flex: 1,
							flexDirection: "column",
						}}
						key={index}
					>
						{value}
					</View>
				);
			})}
		</View>
	);
};
