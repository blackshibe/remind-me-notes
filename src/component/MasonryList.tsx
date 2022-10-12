import React, { createRef, useEffect } from "react";
import { Pressable, View } from "react-native";

type props<T> = {
	data: T[];
	renderer: (props: { item: T }) => JSX.Element;
	columns: number;
};

export const MasonryList = <T,>(props: props<T>): JSX.Element => {
	let children: JSX.Element[] = [];

	props.data.forEach((element, index) => {
		// todo: dragging behavior
		children.push(
			<Pressable
				onLongPress={(event) => {
					// console.log("Start");
				}}
				onPressOut={(event) => {
					// console.log("End");
				}}
				key={index}
				style={{ width: "100%" }}
			>
				{props.renderer({ item: element })}
			</Pressable>
		);
	});

	let current_column = 0;
	let columns: JSX.Element[][] = [];
	children.forEach((element) => {
		console.log(current_column);
		columns[current_column] = columns[current_column] || [];
		columns[current_column].push(element);

		current_column += 1;
		current_column %= props.columns;
	});

	return (
		<View style={{ width: "100%", height: "100%", flex: 1, flexDirection: "row" }}>
			{columns.map((value, index) => (
				<View
					style={{
						flex: 1,
						width: `${Math.floor((1 / props.columns) * 100)}%`,
						flexDirection: "column",
					}}
					key={index}
				>
					{value}
				</View>
			))}
		</View>
	);
};
