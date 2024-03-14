import React, { Fragment, useState, useCallback } from "react";
import { Colxx, Separator } from "components/common/CustomBootstrap";
import { Row, Card, CardBody } from "reactstrap";
import swal from "sweetalert";
import { addReWards as addReWardApi } from "Apis/admin";
import RewardForm from "containers/RewardForm";
import Loading from "components/Loading";
import { NotificationManager } from "components/common/react-notifications";
import {
	checkRequiredField,
	checkAllRequiredFieldsWithKey,
	validLink,
	couponCodeValidation,
} from "utils/FormValidation";
import { showErrorMessage } from "utils/helper";
import { initialState, requiredFields, valueValidation } from "./constants";

const AddRewards = React.memo(() => {
	const [rewardForm, setRewardForm] = useState({ ...initialState });
	const [formError, setFormError] = useState({ ...requiredFields });
	const [loading, setIsLoading] = useState(false);

	const checkAllField = () => {
		const errors = checkAllRequiredFieldsWithKey(requiredFields, rewardForm);
		const couponCodes = [];
		rewardForm.couponCodes.forEach(({ couponCode }, index) => {
			couponCodes[index] = {
				couponCode: couponCodeValidation(couponCode),
				availability: "",
			};
		});
		setFormError((currentError) => ({
			...currentError,
			...errors,
			couponCodes,
			...validLink("linkToClaimOffer", rewardForm.linkToClaimOffer),
		}));
		return Object.values(errors).some((value) => value.length > 0);
	};
	const handleAddMoreCoupon = useCallback((index) => {
		setFormError((currentState) => {
			const couponCodes = [...currentState.couponCodes];
			if (index === 0) {
				couponCodes.push({
					couponCode: "",
					availability: "",
				});
				return {
					...currentState,
					couponCodes,
				};
			}
			couponCodes.splice(index, 1);
			return {
				...currentState,
				couponCodes,
			};
		});
		setRewardForm((currentState) => {
			const couponCodes = [...currentState.couponCodes];
			if (index === 0) {
				couponCodes.push({
					couponCode: "",
					availability: "",
				});
				return {
					...currentState,
					couponCodes,
				};
			}
			couponCodes.splice(index, 1);
			return {
				...currentState,
				couponCodes,
			};
		});
	}, []);
	const handleSubmit = (event) => {
		event.preventDefault();
		if (checkAllField()) {
			return false;
		}
		const formData = {
			...rewardForm,
			coupons: rewardForm.couponCodes.map(({ couponCode, availability }) => ({
				code: couponCode,
				availability: availability?.length ? availability : 0,
			})),
		};
		setIsLoading(true);
		addReWardApi(formData)
			.then(() => {
				swal("Rewards added successfully", {
					icon: "success",
				});
				const couponCodes = rewardForm.couponCodes.map(() => ({
					couponCode: "",
					availability: "",
				}));
				setFormError({ ...initialState, couponCodes });
				setRewardForm({ ...initialState, couponCodes });
				NotificationManager.success(
					"Rewards add successfully",
					"Success",
					3000,
					null,
					null,
					""
				);
			})
			.catch((err) => {
				if (err.response || err.message) {
					const { data = {} } = err.response || {};
					showErrorMessage(data.message || err.message);
				}
			})
			.finally(() => {
				setIsLoading(false);
			});
	};
	const removeError = useCallback(({ target: { name } }) => {
		setFormError((err) => ({ ...err, [name]: "" }));
	}, []);
	const handleCouponFocus = useCallback((index, _, name) => {
		setFormError((err) => {
			const couponCodes = err.couponCodes;
			couponCodes[index][name] = "";
			return {
				...err,
				couponCodes,
			};
		});
	}, []);
	const handleCouponBlur = useCallback((index, value, name) => {
		setFormError((err) => {
			const couponCodes = err.couponCodes;
			if (name === "couponCode") {
				couponCodes[index][name] = couponCodeValidation(value);
			}
			return {
				...err,
				couponCodes,
			};
		});
	}, []);
	const checkError = useCallback(
		({ target: { name, value } }) => {
			const errors = {};
			switch (true) {
				case name === "linkToClaimOffer":
					Object.assign(errors, validLink(name, value));
					break;
				default:
					Object.assign(errors, checkRequiredField(name, value));
					break;
			}
			setFormError((err) => ({ ...err, ...errors }));
		},
		[setFormError]
	);

	const handleInput = useCallback(({ target: { name, value } }) => {
		if (
			Object.prototype.hasOwnProperty.call(valueValidation, name) &&
			value.replace(/<\/?[^>]+(>|$)/g, "").length >= valueValidation[name]
		) {
			swal(
				`You can add only ${valueValidation[name]} character in this field`,
				{
					icon: "error",
				}
			);
			return false;
		}
		if (name === "pathPoints") {
			value = value.replace(/[^0-9]/g, "");
		}
		setRewardForm((currentState) => ({ ...currentState, [name]: value }));
	}, []);
	const handleInputCoupon = useCallback((index, value, name) => {
		setRewardForm((currentState) => {
			const couponCodes = JSON.parse(JSON.stringify(currentState.couponCodes));
			couponCodes[index][name] = value;
			return {
				...currentState,
				couponCodes,
			};
		});
	}, []);

	return (
		<Fragment>
			<Row>
				<Colxx xxs="12">
					<h1>Add Reward</h1>
					<Separator className="mb-5 mt-3" />
				</Colxx>
			</Row>
			<Row className="mb-4">
				<Colxx xxs="12">
					<Card>
						<CardBody className="color-white">
							<Loading loading={loading} />
							<RewardForm
								onSubmit={handleSubmit}
								loading={loading}
								rewardForm={rewardForm}
								handleInput={handleInput}
								formError={formError}
								onFocus={removeError}
								onBlur={checkError}
								addCoupon={handleInputCoupon}
								addMoreCoupon={handleAddMoreCoupon}
								onCouponFocus={handleCouponFocus}
								onCouponBlur={handleCouponBlur}
							/>
						</CardBody>
					</Card>
				</Colxx>
			</Row>
		</Fragment>
	);
});

export default AddRewards;
