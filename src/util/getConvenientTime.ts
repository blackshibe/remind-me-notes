const HOUR_IN_SECONDS = 60 * 60;
const DAY_IN_SECONDS = HOUR_IN_SECONDS * 24;
const WEEK_IN_SECONDS = DAY_IN_SECONDS * 7;

const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

//
const snapMinutes = (mins: number) => {
	let gridded = mins / 15;
	gridded = Math.round(gridded);

	return gridded == 0 ? "00" : gridded * 15;
};

export const getConvenientDate = (date: Date) => {
	let timeDifferenceSeconds = (date.getTime() - new Date().getTime()) / 1000;

	if (timeDifferenceSeconds < 60) {
		return `now`;
	} else if (timeDifferenceSeconds < HOUR_IN_SECONDS) {
		return `in ${Math.round(timeDifferenceSeconds / 60)} mins`;
	} else if (timeDifferenceSeconds < DAY_IN_SECONDS) {
		return `in ${Math.round(timeDifferenceSeconds / 60 / 60)} hours`;
	} else if (timeDifferenceSeconds < WEEK_IN_SECONDS) {
		return weekday[date.getDay()];
	}

	return `${date.toLocaleDateString()}, ${weekday[date.getDay()]}`;
};

export const getConvenientTime = (date: Date) => {
	let hours = date.getHours();
	let mins = snapMinutes(date.getMinutes());

	if (hours == 0 && mins == 0) return "midnight";

	return `${hours}:${mins < 10 ? `0${mins}` : mins}`;
};

export const getAccurateConvenientTime = (date: Date) => {
	let hours = date.getHours();
	let mins = date.getMinutes();

	if (hours == 0 && mins == 0) return "midnight";
	return `${hours}:${mins < 10 ? `0${mins}` : mins}`;
};
