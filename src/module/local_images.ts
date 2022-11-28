import * as FileSystem from "expo-file-system";
import { useEffect, useState } from "react";

export const useLocalImage = (filename?: string) => {
	let [uri, setUri] = useState(filename);

	useEffect(() => {
		if (!filename) return;
		FileSystem.readAsStringAsync(`${FileSystem.documentDirectory}/${filename}`)
			.then((value) => setUri(value))
			.catch((val) => console.log("image not found", val));
	}, []);

	return uri;
};

export const upload_local_image = (filename: string, base64: string) => {
	const path = `${FileSystem.documentDirectory}/${filename}`;
	FileSystem.writeAsStringAsync(path, "data:image/jpeg;base64," + base64);
};

export const delete_local_image = (filename: string) => {
	FileSystem.deleteAsync(`${FileSystem.documentDirectory}/${filename}`);
};
