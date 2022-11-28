import dayjs from "dayjs";
import { timeFormat } from "../module/app_store";

const HOUR_IN_SECONDS = 60 * 60;
const DAY_IN_SECONDS = HOUR_IN_SECONDS * 24;
const WEEK_IN_SECONDS = DAY_IN_SECONDS * 7;

const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const datePassed = (date: Date) => {
	return new Date().getTime() > date.getTime();
};

export const shouldDisplayTime = (date: Date) => {
	let timeDifferenceSeconds = (date.getTime() - new Date().getTime()) / 1000;
	return timeDifferenceSeconds > HOUR_IN_SECONDS;
};

export const getConvenientDate = (date: Date) => {
	let timeDifferenceSeconds = (date.getTime() - new Date().getTime()) / 1000;

	if (timeDifferenceSeconds < 3) {
		return `now`;
	} else if (timeDifferenceSeconds < 60) {
		return `in ${Math.round(timeDifferenceSeconds)} seconds`;
	} else if (timeDifferenceSeconds < HOUR_IN_SECONDS) {
		return `in ${Math.round(timeDifferenceSeconds / 60)} mins`;
	} else if (timeDifferenceSeconds < DAY_IN_SECONDS) {
		return `in ${Math.round(timeDifferenceSeconds / 60 / 60)} hours`;
	} else if (timeDifferenceSeconds < WEEK_IN_SECONDS) {
		return weekday[date.getDay()];
	}

	return dayjs(date).format("HH:mm").toString();
};

export const getConvenientTime = (format: timeFormat, date: Date) => {
	return format === timeFormat.twentyfour
		? dayjs(date).format("HH:mm").toString()
		: dayjs(date).format("hh:mm A").toString();
};
