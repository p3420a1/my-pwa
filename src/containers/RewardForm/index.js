import React, { useCallback, useState } from "react";
import propTypes from "prop-types";
import moment from "moment";
import ReactQuill from "react-quill";
import axios from "axios";
import swal from "sweetalert";
import DatePicker from "react-datepicker";
import { Button, Form, FormGroup, Label, Row } from "reactstrap";
import { Input } from "components/common";
import { Colxx } from "components/common/CustomBootstrap";
import { createSignURL } from "Apis/admin";
import { s3URL } from "views/Admin/Rewards/constants";
import "react-datepicker/dist/react-datepicker.css";
import "react-quill/dist/quill.snow.css";

const quillModules = {
	toolbar: [
		["bold", "italic", "underline", "strike", "blockquote"],
		[
			{ list: "ordered" },
			{ list: "bullet" },
			{ indent: "-1" },
			{ indent: "+1" },
		],
		["link", "image"],
		["clean"],
	],
};
const todayDate = moment(new Date(), "DD-MM-YYYY").add(1, "days");
const imageExtension = ["jpg", "jpeg", "png", "gif"];
const RewardForm = ({
	onSubmit,
	handleInput,
	isEdit = false,
	loading,
	rewardForm,
	formError = {},
	onFocus = () => {},
	onBlur = () => {},
	addCoupon = () => {},
	addMoreCoupon = () => {},
	onCouponFocus = () => {},
	onCouponBlur = () => {},
	removeCoupon = () => {},
	addOrUpdateCoupon = () => {},
}) => {
	const [imageUploadLoading, setImageUploadLoading] = useState({
		bannerUrl: {
			loading: false,
			imageUrl: "",
			progressCount: 0,
		},
		iconUrl: {
			loading: false,
			imageUrl: "",
			progressCount: 0,
		},
	});
	const onlyNumberKey = ({ which, keyCode }) => {
		var ASCIICode = which ? which : keyCode;
		if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) {
			return false;
		}
		return true;
	};
	const handleUploadImage = useCallback(
		async ({ target: { name, files } }) => {
			const fileInfo = files[0];
			const splitFileName = fileInfo.name?.split(".");
			const extension = splitFileName[splitFileName?.length - 1];
			const contentType = fileInfo.type;
			const type = name === "bannerUrl" ? "banner" : "icon";
			if (imageExtension.indexOf(extension) === -1) {
				swal("Please select correct formate of image", {
					icon: "error",
				});
				return;
			}
			setImageUploadLoading((currentState) => ({
				...currentState,
				[name]: {
					...currentState[name],
					loading: true,
				},
			}));
			try {
				const { data } = await createSignURL({ extension, type, contentType });
				await axios.put(data.signedUrl, fileInfo, {
					onUploadProgress: function (progressEvent) {
						const progressCount = Math.round(
							(progressEvent.loaded * 100) / progressEvent.total
						);
						setImageUploadLoading((currentState) => ({
							...currentState,
							[name]: {
								...currentState[name],
								progressCount,
							},
						}));
					},
				});
				setImageUploadLoading((currentState) => ({
					...currentState,
					[name]: {
						imageUrl: URL.createObjectURL(fileInfo),
						loading: false,
						progressCount: 0,
					},
				}));
				handleInput({ target: { name, value: data.key } });
			} catch (err) {
				setImageUploadLoading((currentState) => ({
					...currentState,
					[name]: {
						loading: false,
						progressCount: 0,
						imageUrl: "",
					},
				}));
			}
		},
		[handleInput]
	);
	return (
		<>
			<Form onSubmit={onSubmit} className="mt-4 form-advisor">
				<div className="row">
					<div className="col-md-6">
						<Input
							type="text"
							value={rewardForm.partnerName}
							onChange={handleInput}
							onFocus={onFocus}
							onBlur={onBlur}
							error={formError.partnerName}
							isShowIcon={false}
							name="partnerName"
							placeholder="Partner Name"
							label="Partner Name"
							errorClassName="form-error"
						/>
					</div>
					<div className="col-md-6">
						<Input
							type="text"
							value={rewardForm.title}
							onChange={handleInput}
							onFocus={onFocus}
							onBlur={onBlur}
							error={formError.title}
							isShowIcon={false}
							name="title"
							placeholder="Title"
							label="Title"
							errorClassName="form-error"
						/>
					</div>
					<div className="col-md-6">
						<Input
							type="number"
							value={rewardForm.pathPoints}
							onChange={handleInput}
							onFocus={onFocus}
							onBlur={onBlur}
							error={formError.pathPoints}
							isShowIcon={false}
							name="pathPoints"
							placeholder="Path Points"
							label="Path Points"
							min={1}
							errorClassName="form-error"
							step="0"
							pattern="^[-/d]/d*$"
						/>
					</div>
					<div className="col-md-6 mb-1">
						<FormGroup>
							<Label for="exampleEmailGrid">Expiration Date</Label>
							<DatePicker
								selected={rewardForm.expirationDate ?? null}
								minDate={todayDate}
								dateFormat="DD/MM/YYYY"
								onChange={(value) =>
									handleInput({ target: { name: "expirationDate", value } })
								}
								onBlur={(value) =>
									onBlur({
										target: {
											name: "expirationDate",
											value: rewardForm.expirationDate,
										},
									})
								}
								onFocus={(value) =>
									onFocus({ target: { name: "expirationDate", value } })
								}
								name="expirationDate"
								placeholderText="Expiration Date"
								className={formError.expirationDate ? "form-error" : ""}
							/>
							{formError.expirationDate && (
								<div className="invalid-feedback d-block mt-1">
									{formError.expirationDate}
								</div>
							)}
						</FormGroup>
					</div>
					<div className="col-md-6 mb-1">
						<FormGroup>
							<Label for="exampleEmailGrid">Redemption Date</Label>
							<DatePicker
								type="date"
								dateFormat="DD/MM/YYYY"
								selected={rewardForm.redemptionDate ?? null}
								minDate={rewardForm.expirationDate || todayDate}
								onChange={(value) =>
									handleInput({ target: { name: "redemptionDate", value } })
								}
								onBlur={(value) =>
									onBlur({
										target: {
											name: "redemptionDate",
											value: rewardForm.redemptionDate,
										},
									})
								}
								onFocus={(value) =>
									onFocus({ target: { name: "redemptionDate", value } })
								}
								name="redemptionDate"
								placeholderText="Redemption Date"
								className={formError.redemptionDate ? "form-error" : ""}
							/>
							{formError.redemptionDate && (
								<div className="invalid-feedback d-block mt-1">
									{formError.redemptionDate}
								</div>
							)}
						</FormGroup>
					</div>
					<div className="col-md-6">
						<FormGroup>
							<Label for="exampleEmailGrid">Link To Claim Offer</Label>
							<Input
								type="url"
								value={rewardForm.linkToClaimOffer}
								onChange={handleInput}
								onFocus={onFocus}
								onBlur={onBlur}
								error={formError.linkToClaimOffer}
								isShowIcon={false}
								name="linkToClaimOffer"
								placeholder="Link To Claim Offer"
								errorClassName="form-error"
							/>
						</FormGroup>
					</div>
					<div className="col-md-6">
						<FormGroup>
							<Label for="exampleEmailGrid">Banner</Label>
							<Input
								type="file"
								accept="image/*"
								onChange={handleUploadImage}
								onFocus={onFocus}
								error={formError.bannerUrl}
								isShowIcon={false}
								name="bannerUrl"
								placeholder="Link To Claim Offer"
								errorClassName="form-error"
							/>
						</FormGroup>
					</div>
					<div className="col-md-6">
						<FormGroup>
							<Label for="exampleEmailGrid">Icon</Label>
							<Input
								type="file"
								accept="image/*"
								error={formError.iconUrl}
								onChange={handleUploadImage}
								onFocus={onFocus}
								isShowIcon={false}
								name="iconUrl"
								errorClassName="form-error"
							/>
						</FormGroup>
					</div>
					<div className="col-md-6 mb-4">
						{imageUploadLoading.bannerUrl.loading && (
							<div>
								<Label>Uploading.....</Label>
								<div className="progress">
									<div
										className="progress-bar"
										role="progressbar"
										style={{
											width: `${imageUploadLoading.bannerUrl.progressCount}%`,
										}}
										aria-valuenow="100"
										aria-valuemin="0"
										aria-valuemax="100"
									/>
								</div>
								{imageUploadLoading.bannerUrl.progressCount}%
							</div>
						)}
						{rewardForm.bannerUrl && (
							<img
								src={`${s3URL}/${rewardForm.bannerUrl}`}
								height="350px"
								width="100%"
								alt="banner"
								className="image-icon"
								onError={({ currentTarget }) => {
									currentTarget.onerror = null;
									currentTarget.src = "/assets/img/logo.png";
								}}
							/>
						)}
					</div>
					<div className="col-md-6 mb-4">
						{imageUploadLoading.iconUrl.loading && (
							<div>
								<Label>Uploading.....</Label>
								<div className="progress">
									<div
										className="progress-bar"
										role="progressbar"
										style={{
											width: `${imageUploadLoading.iconUrl.progressCount}%`,
										}}
										aria-valuenow="100"
										aria-valuemin="0"
										aria-valuemax="100"
									/>
								</div>
								{imageUploadLoading.iconUrl.progressCount}%
							</div>
						)}
						{rewardForm.iconUrl && (
							<img
								src={`${s3URL}/${rewardForm.iconUrl}`}
								height="350px"
								width="100%"
								alt="icon"
								className="image-icon"
								onError={({ currentTarget }) => {
									currentTarget.onerror = null;
									currentTarget.src = "/assets/img/logo.png";
								}}
							/>
						)}
					</div>
					<Colxx sm={12}>
						<FormGroup>
							<Label for="exampleEmailGrid">Terms</Label>
							<ReactQuill
								toolbar={quillModules}
								value={rewardForm.terms}
								onChange={(value) =>
									handleInput({ target: { name: "terms", value } })
								}
								className={`${formError.terms ? "error border-error" : ""}`}
							/>
						</FormGroup>
					</Colxx>
					<Colxx sm={12}>
						<div className="position-relative">
							<FormGroup>
								<Label for="exampleEmailGrid">Description</Label>
								<ReactQuill
									toolbar={quillModules}
									value={rewardForm.description}
									onChange={(value) =>
										handleInput({ target: { name: "description", value } })
									}
									className={`${
										formError.description ? "error border-error" : ""
									}`}
								/>
							</FormGroup>
						</div>
					</Colxx>
				</div>
				{!isEdit && (
					<div className="speciality">
						<h1>Add Coupons</h1>

						<Row>
							{rewardForm.couponCodes.map(
								({ couponCode, availability }, index) => (
									<Colxx sm={6}>
										<Row>
											<Colxx sm={6}>
												<Input
													type="text"
													value={couponCode}
													onChange={({ target: { value } }) =>
														addCoupon(index, value, "couponCode")
													}
													onFocus={({ target: { value } }) =>
														onCouponFocus(index, value, "couponCode")
													}
													onBlur={({ target: { value } }) =>
														onCouponBlur(index, value, "couponCode")
													}
													error={formError.couponCodes[index]["couponCode"]}
													isShowIcon={false}
													placeholder={`Coupon Code ${index + 1}`}
													label={`Coupon Code ${index + 1}`}
													errorClassName="form-error"
												/>
											</Colxx>
											<Colxx sm={4}>
												<Input
													type="number"
													value={availability}
													min={1}
													onChange={({ target: { value } }) =>
														addCoupon(index, value, "availability")
													}
													onFocus={({ target: { value } }) =>
														onCouponFocus(index, value, "availability")
													}
													onBlur={({ target: { value } }) =>
														onCouponBlur(index, value, "availability")
													}
													error={formError.couponCodes[index]["availability"]}
													isShowIcon={false}
													placeholder={`Availability ${index + 1}`}
													label={`Availability ${index + 1}`}
													errorClassName="form-error"
													onKeyPress={onlyNumberKey}
												/>
											</Colxx>
											<Colxx sm={2}>
												<div
													title={index === 0 ? "Add more" : "Remove"}
													className="d-flex pointer h-100 glyph align-items-center"
													onClick={() => addMoreCoupon(index)}
												>
													<i
														className={`${
															index === 0
																? "simple-icon-plus"
																: "simple-icon-minus"
														} font-25  text-white align-text-bottom `}
													/>
												</div>
											</Colxx>
										</Row>
									</Colxx>
								)
							)}
						</Row>
					</div>
				)}
				{isEdit && (
					<div className="speciality">
						<h1>Update Coupons</h1>
						<Button
							type="button"
							onClick={addMoreCoupon}
							color="info"
							className="btn btn-info ml-4"
						>
							+ Add More Coupon
						</Button>
						<Row>
							{rewardForm.couponCodes.map(
								({ rewardCouponCodeId, couponCode, availability }, index) => (
									<Colxx sm={6} key={rewardCouponCodeId}>
										<Row>
											<Colxx sm={4}>
												<Input
													type="text"
													value={couponCode}
													onChange={({ target: { value } }) =>
														addCoupon(index, value, "couponCode")
													}
													isShowIcon={false}
													placeholder={`Coupon Code ${index + 1}`}
													label={`Coupon Code ${index + 1}`}
													errorClassName="form-error"
												/>
											</Colxx>
											<Colxx sm={4}>
												<Input
													type="number"
													value={availability}
													onChange={({ target: { value } }) =>
														addCoupon(index, value, "availability")
													}
													isShowIcon={false}
													placeholder={`Availability ${index + 1}`}
													label={`Availability ${index + 1}`}
													errorClassName="form-error"
													onKeyPress={onlyNumberKey}
												/>
											</Colxx>
											<Colxx sm={4}>
												<div
													title={index === 0 ? "Add more" : "Remove"}
													className="d-flex  h-100 glyph align-items-center"
												>
													<Button
														onClick={() =>
															addOrUpdateCoupon({
																couponCode,
																rewardCouponCodeId,
																index,
																availability,
															})
														}
														className="btn btn-primary btn-sm mr-2"
														color="primary"
													>
														{rewardCouponCodeId ? "Update" : "Save"}{" "}
													</Button>
													{rewardCouponCodeId && (
														<Button
															onClick={() =>
																removeCoupon(index, rewardCouponCodeId)
															}
															className="btn btn-danger btn-sm"
														>
															Remove{" "}
														</Button>
													)}
												</div>
											</Colxx>
										</Row>
									</Colxx>
								)
							)}
						</Row>
					</div>
				)}

				<Button
					disabled={loading}
					type="submit"
					className={`btn-shadow btn-multiple-state mt-4 bg-button ${
						loading ? "show-spinner" : ""
					}`}
					color="primary"
				>
					{isEdit ? "Update" : "Save"}
				</Button>
			</Form>
		</>
	);
};
RewardForm.prototype = {
	onSubmit: propTypes.func.isRequired,
	rewardForm: propTypes.object.isRequired,
	handleInput: propTypes.func.isRequired,
	loading: propTypes.bool.isRequired,
	formError: propTypes.object.isRequired,
	onFocus: propTypes.func.isRequired,
	onBlur: propTypes.func.isRequired,
	addCoupon: propTypes.func.isRequired,
	addMoreCoupon: propTypes.func.isRequired,
	onCouponFocus: propTypes.func,
	onCouponBlur: propTypes.func,
	removeCoupon: propTypes.func,
	addOrUpdateCoupon: propTypes.func,
	isEdit: propTypes.bool,
};
export default RewardForm;
