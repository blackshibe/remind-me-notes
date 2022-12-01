import * as FileSystem from "expo-file-system";
import { getDownloadURL, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { image, imageType } from "./app_store";
import { FIREBASE_STORAGE } from "./firebase";

export const useImage = (image?: image) => {
	let [uri, setUri] = useState(image?.name);

	useEffect(() => {
		if (!image) return;

		// cloud image is a fallback
		FileSystem.readAsStringAsync(`${FileSystem.documentDirectory}/${image.name}`)
			.then((value) => {
				// throw "lol";
				setUri(value);
			})
			.catch(async (val) => {
				// not found
				if (image.type === imageType.cloud) {
					const imageRef = ref(FIREBASE_STORAGE, image.name);
					setUri(await getDownloadURL(imageRef));
				}
			});
	}, [image]);

	return uri;
};

export const upload_local_image = (filename: string, base64: string) => {
	const path = `${FileSystem.documentDirectory}/${filename}`;
	FileSystem.writeAsStringAsync(path, "data:image/jpeg;base64," + base64);
};

export const delete_local_image = (filename: string) => {
	FileSystem.deleteAsync(`${FileSystem.documentDirectory}/${filename}`);
};
