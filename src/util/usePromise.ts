import { DependencyList, useEffect } from "react";

export default function usePromise(func: () => void, dependencies?: DependencyList) {
	return useEffect(() => {
		new Promise((value) => func());
	}, dependencies);
}
