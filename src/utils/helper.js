import { NotificationManager } from "components/common/react-notifications";

export const localData = (key, value) => {
	window.localStorage.setItem(key, JSON.stringify(value));
};
export const getData = (key) => {
	const data = window.localStorage.getItem(key);
	if (data !== undefined || data !== null || data !== "") {
		return JSON.parse(data);
	} else {
		return false;
	}
};

export const checkAuth = (key) => {
	const data = window.localStorage.getItem(key);
	if (data !== undefined && data !== null && data !== "") {
		return true;
	} else {
		return false;
	}
};

export const token = (key) => {
	const data = window.localStorage.getItem(key);
	if (data !== undefined && data !== null && data !== "") {
		const info = JSON.parse(data);
		return info.accessToken;
	}
	return null;
};

export const timeConvert = (n) => {
	if (n <= 60) {
		return `${n} minute${n > 1 && "s"}`;
	}
	let num = n;
	let hours = num / 60;
	let rhours = Math.floor(hours);
	let minutes = (hours - rhours) * 60;
	let rminutes = Math.round(minutes);
	return `${rhours} hr ${rminutes} minute${rminutes > 1 && "s"}`;
};

export const showErrorMessage = (message) => {
	NotificationManager.warning(
		message,
		"Something went wrong",
		3000,
		null,
		null,
		""
	);
};

export const getDashwardCounts = () => {
	const data = window.localStorage.getItem("LoginUser");
	console.log(data);
	if (data !== undefined || data !== null || data !== "") {
		const {
			totalRewards = 0,
			availableRewards = 0,
			redeemedRewards = 0,
		} = JSON.parse(data);
		return {
			totalRewards,
			availableRewards,
			redeemedRewards,
		};
	}
	return {
		totalRewards: 0,
		availableRewards: 0,
		redeemedRewards: 0,
	};
};
