import axios from "utils/handleAxios";
import { ApiEndPoints } from "./constant";

export const Adminlogin = ({ email, password }) => {
	return axios.post(ApiEndPoints.login, {
		email,
		password,
	});
};

export const getAllReWards = (page, limit, search) =>
	axios.get(ApiEndPoints.getReWards, {
		params: {
			page,
			perPage: limit,
			search,
		},
	});
export const addReWards = (data) => axios.post(ApiEndPoints.addReward, data);

export const updateReWards = (data) =>
	axios.put(`${ApiEndPoints.addReward}/${data.rewardId}`, data);

export const getCoupons = (rewardId) =>
	axios.get(
		`${ApiEndPoints.addReward}/${rewardId}/${ApiEndPoints.couponCodes}`
	);
export const removeCoupon = (rewardCouponCodeId) =>
	axios.delete(`${ApiEndPoints.rewardCouponCode}/${rewardCouponCodeId}`);

export const updateCoupon = ({
	rewardCouponCodeId,
	couponCode,
	availability,
}) =>
	axios.put(`${ApiEndPoints.rewardCouponCode}/${rewardCouponCodeId}`, {
		couponCode,
		availability,
	});
export const addNewCoupon = ({ rewardId, coupons }) =>
	axios.post(
		`${ApiEndPoints.addReward}/${rewardId}/${ApiEndPoints.couponCodes}`,
		{ coupons }
	);
export const createSignURL = ({ type, extension, contentType }) =>
	axios.get(`${ApiEndPoints.addReward}${ApiEndPoints.presignedUrl}`, {
		params: { type, extension, contentType },
	});

export const appInfo = () => {
	return axios.get(`/app-info`);
};

export const updateAppInfo = (data) => {
	return axios.put(`/app-info`, data);
};

export const updateProfile = (data) => {
	const form = new FormData();
	form.append("first_name", data.first_name);
	form.append("last_name", data.last_name);
	form.append("password", data.password);
	form.append("email", data.email);
	form.append("token", data.token);
	form.append("profile", data.image);
	form.append("id", data.id);
	return axios.post(`/admin-profile`, form);
};

export const sendPush = (data) => {
	return axios.put(`/send-push`, data);
};

export const updateAllStatus = () => Promise.reject();
export const deleteUser = () => Promise.reject();
