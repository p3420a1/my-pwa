import React, { Fragment, useState, useCallback, useEffect } from "react";
import swal from "sweetalert";
import moment from "moment";
import { Redirect } from "react-router-dom";
import { Colxx, Separator } from "components/common/CustomBootstrap";
import { Row, Card, CardBody } from "reactstrap";
import {
	getCoupons,
	updateReWards,
	removeCoupon,
	updateCoupon,
	addNewCoupon,
} from "Apis/admin";
import RewardForm from "containers/RewardForm";
import Loading from "components/Loading";
import { NotificationManager } from "components/common/react-notifications";
import {
	checkRequiredField,
	checkAllRequiredFieldsWithKey,
	validLink,
	couponCodeValidation,
} from "utils/FormValidation";
import { initialState, requiredFields, valueValidation } from "./constants";
import { showErrorMessage } from "utils/helper";
const EditAdvisor = React.memo(({ location }) => {
	const editRewards = {
		...initialState,
		...location.state.redward,
		expirationDate: moment(location.state.redward.expirationDate),
		redemptionDate: moment(location.state.redward.redemptionDate),
		couponCodes: [
			{
				rewardCouponCodeId: null,
				couponCode: "",
				availability: "",
			},
		],
	};
	const [rewardForm, setRewardForm] = useState(editRewards);
	const [loading, setIsLoading] = useState(false);
	const [redirect, setRedirect] = useState(false);
	const [formError, setFormError] = useState(requiredFields);

	useEffect(() => {
		setIsLoading(true);
		getCoupons(location.state.redward.rewardId)
			.then(({ data }) => {
				setRewardForm((currState) => ({
					...currState,
					couponCodes: data || [
						{
							rewardCouponCodeId: 0,
							couponCode: "",
							availability: 0,
						},
					],
				}));
			})
			.catch((err) => {
				if (err.response || err.message) {
					const { data = {} } = err.response || {};
					NotificationManager.warning(
						data.error_message || err.message,
						"Something went wrong",
						3000,
						null,
						null,
						""
					);
				}
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [location.state.redward]);
	const checkAllField = () => {
		const errors = checkAllRequiredFieldsWithKey(requiredFields, rewardForm);
		setFormError((currentError) => ({
			...currentError,
			...errors,
			...validLink("linkToClaimOffer", rewardForm.linkToClaimOffer),
		}));
		return Object.values(errors).some((value) => value.length > 0);
	};
	const handleAddMoreCoupon = useCallback(() => {
		setFormError((currentState) => {
			const couponCodes = [...currentState.couponCodes];
			couponCodes.push("");
			return {
				...currentState,
				couponCodes,
			};
		});
		setRewardForm((currentState) => {
			const couponCodes = [...currentState.couponCodes];
			couponCodes.push({
				rewardCouponCodeId: null,
				couponCode: "",
			});
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
		const formData = { ...rewardForm };
		setIsLoading(true);
		updateReWards(formData)
			.then(() => {
				swal(`${rewardForm.title} reward updated successfully`, {
					icon: "success",
				});
				setRedirect(true);
				NotificationManager.success(
					`${rewardForm.title} reward updated successfully`,
					"Success",
					3000,
					null,
					null,
					""
				);
			})
			.catch((err) => {
				if (err.response) {
					const { data } = err.response;
					showErrorMessage(data.message);
				}
			})
			.finally(() => {
				setIsLoading(false);
			});
	};
	const handleRemoveCoupon = useCallback(
		(index, rewardCouponCodeId) => {
			const filterCoupon = rewardForm.couponCodes.filter(
				({ rewardCouponCodeId }) => rewardCouponCodeId
			);
			if (filterCoupon?.length === 1) {
				swal("You can't removed the all coupons", {
					icon: "error",
				});
				return;
			}
			swal({
				title: `Are you sure want to remove the coupon?`,
				icon: "warning",
				dangerMode: true,
				buttons: ["No", "Yes"],
			}).then((willDelete) => {
				if (willDelete) {
					setIsLoading(true);
					removeCoupon(rewardCouponCodeId)
						.then(() => {
							swal("Coupon removed Successfully", {
								icon: "success",
							});
							setRewardForm((currentState) => {
								const couponCodes = [...currentState.couponCodes];
								couponCodes.splice(index, 1);
								return {
									...currentState,
									couponCodes,
								};
							});
						})
						.catch((err) => {
							if (err.response || err.message) {
								const { data = {} } = err.response || {};
								showErrorMessage(err.message || data.message);
							}
						})
						.finally(() => {
							setIsLoading(false);
						});

					return;
				}
				swal("Process Cancel");
			});
		},
		[rewardForm.couponCodes]
	);
	const removeError = useCallback(({ target: { name } }) => {
		setFormError((err) => ({ ...err, [name]: "" }));
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
	const hanldeUpdateOrAddCoupon = useCallback(
		({ couponCode, rewardCouponCodeId, index, availability }) => {
			const checkCouponValidationMessage = couponCodeValidation(couponCode);
			if (checkCouponValidationMessage) {
				swal(checkCouponValidationMessage, {
					icon: "error",
				});
				return;
			}
			setIsLoading(true);
			if (!rewardCouponCodeId) {
				addNewCoupon({
					rewardId: location.state.redward.rewardId,
					coupons: [
						{
							code: couponCode,
							availability: availability?.length ? availability : 0,
						},
					],
				})
					.then(({ data }) => {
						swal("New coupon added successfully", {
							icon: "success",
						});
						setRewardForm((currentState) => {
							const couponCodes = [...currentState.couponCodes];
							couponCodes[index].rewardCouponCodeId =
								data[0].rewardCouponCodeId;
							return {
								...currentState,
								couponCodes,
							};
						});
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
				return;
			}
			const updateCouponObject = {
				rewardCouponCodeId,
				couponCode,
				availability: availability?.length ? availability : 0,
			};
			updateCoupon(updateCouponObject)
				.then(() => {
					swal("Coupon updated successfully", {
						icon: "success",
					});
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
		},
		[location.state.redward.rewardId]
	);
	const handleAddCoupon = useCallback((index, value, name) => {
		setRewardForm((currentState) => {
			const couponCodes = [...currentState.couponCodes];
			couponCodes[index][name] = value;
			return {
				...currentState,
				couponCodes,
			};
		});
	}, []);
	if (redirect) {
		return <Redirect to="/rewards" />;
	}
	return (
		<Fragment>
			<Row>
				<Colxx xxs="12">
					<h1>Edit Reward ({rewardForm.title})</h1>
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
								addCoupon={handleAddCoupon}
								addMoreCoupon={handleAddMoreCoupon}
								addOrUpdateCoupon={hanldeUpdateOrAddCoupon}
								removeCoupon={handleRemoveCoupon}
								isEdit
							/>
						</CardBody>
					</Card>
				</Colxx>
			</Row>
		</Fragment>
	);
});

export default EditAdvisor;
