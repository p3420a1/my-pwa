export const additional = {
	currentPage: 1,
	totalItemCount: 18,
	totalPage: 2,
	search: "",
	pageSizes: [10, 20, 50, 100],
};
export const gender = {
	1: "Male",
	2: "Female",
	3: "Other",
};

export const initialState = {
	partnerName: "",
	title: "",
	iconUrl: "",
	bannerUrl: "",
	pathPoints: "",
	expirationDate: "",
	redemptionDate: "",
	linkToClaimOffer: "",
	status: "available",
	terms: "",
	description: "",
	couponCodes: [
		{
			couponCode: "",
			availability: "",
		},
	],
};
export const requiredFields = {
	partnerName: "",
	title: "",
	iconUrl: "",
	bannerUrl: "",
	pathPoints: "",
	expirationDate: "",
	redemptionDate: "",
	linkToClaimOffer: "",
	couponCodes: [
		{
			couponCode: "",
			availability: "",
		},
	],
};
export const editState = {
	partnerName: "",
	title: "",
	iconUrl: "",
	bannerUrl: "",
	pathPoints: "",
	expirationDate: "",
	redemptionDate: "",
	linkToClaimOffer: "",
	status: "",
	terms: "",
	description: "",
	couponCodes: [
		{
			couponCode: "",
			availability: "",
		},
	],
};
export const ageRange = [
	"1-10",
	"10-20",
	"20-30",
	"30-40",
	"40-50",
	"50-60",
	"60-100",
];

export const tabs = [
	{
		key: "usersDetails",
		name: "Provider Details",
	},

	{
		key: "documents",
		name: "Documents",
	},
	{
		key: "services",
		name: "Services",
	},
	{
		key: "bookings",
		name: "Bookings",
	},
];

export const s3URL = process.env.REACT_APP_S3_URL;

export const valueValidation = {
	terms: 155,
	title: 55,
	description: 600,
	partnerName: 25,
};
