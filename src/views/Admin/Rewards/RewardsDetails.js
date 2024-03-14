import React, { Fragment, useEffect, useState } from "react";
import classNames from "classnames";
import {
	Card,
	CardBody,
	CardHeader,
	FormGroup,
	Label,
	Nav,
	NavItem,
} from "reactstrap";
import Avatar from "react-avatar";
import { showErrorMessage } from "utils/helper";
import ReactLoading from "components/Loading";
import StatusUpdate from "components/UpdateStatus";
import { convertDate } from "constants/defaultValues";
import { getCoupons } from "Apis/admin";
import { s3URL } from "./constants";
import ImagePreView from "components/PerviewImage/ModalView";

const RewardView = ({ location }) => {
	const rewardDetails = { ...location.state.redward };
	const [currentTab, setCurrentTab] = useState(1);
	const [loading, setLoading] = useState(false);
	const [couponCode, setCouponCode] = useState([]);
	const [totalAvailability, setTotalAvailability] = useState(0);
	const [imagePath, setImagePath] = useState("");
	useEffect(() => {
		setLoading(true);
		getCoupons(rewardDetails.rewardId)
			.then(({ data }) => {
				setCouponCode(data);
				setTotalAvailability(
					data?.reduce(
						(accumulator, { availability }) => accumulator + availability,
						0
					)
				);
			})
			.catch((err) => {
				if (err.response || err.message) {
					const { data = {} } = err.response || {};
					showErrorMessage(data.message || err.message);
				}
			})
			.finally(() => {
				setLoading(false);
			});
	}, [rewardDetails.rewardId]);
	return (
		<Fragment>
			<h1 style={{ paddingTop: "31px" }}>
				{" "}
				Rewards Details ({rewardDetails.title}){" "}
			</h1>
			<hr className="mb-4 mt-1" />
			<Card className="color-white pb-5">
				<CardHeader>
					<Nav tabs className="card-header-tabs ">
						<NavItem>
							<div
								to="#"
								location={{}}
								className={classNames({
									active: currentTab === 1,
									"nav-link": true,
									pointer: true,
								})}
								onClick={() => {
									setCurrentTab(1);
								}}
							>
								Reward Details
							</div>
						</NavItem>
						<NavItem>
							<div
								to="#"
								location={{}}
								className={classNames({
									active: currentTab === 2,
									"nav-link": true,
									pointer: true,
								})}
								onClick={() => {
									setCurrentTab(2);
								}}
							>
								Coupon Codes
							</div>
						</NavItem>
					</Nav>
				</CardHeader>
				<ReactLoading loading={loading} />
				<CardBody className="color-white details-data mb-2">
					{currentTab === 1 && (
						<div>
							<div className="name mb-4">
								<b> Banner : </b>{" "}
								<Avatar
									round="10px"
									name={rewardDetails.partnerName}
									size="50"
									textSizeRatio={1}
									color="#485256"
								/>
							</div>
							<hr />
							<div className="name">
								<b> Partner Name: </b> {rewardDetails.partnerName}
							</div>
							<hr />
							<div className="name">
								<b> Title: </b> {rewardDetails.title}
							</div>
							<hr />

							<div className="name">
								<b> Status:- </b> &nbsp;
								<StatusUpdate
									data={rewardDetails}
									table="users"
									statusMessage={{
										available: "Available",
										1: "Active",
									}}
									isUpdate={false}
									updateKey="status"
								/>
							</div>

							<table className="table mt-4">
								<thead>
									<tr>
										<th>Expiration Date</th>
										<th>Redemption Date</th>
										<th>Path Points</th>
										<th>Availability</th>
										<th>Icon</th>
										<th>Banner</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>{convertDate(rewardDetails.expirationDate)}</td>
										<td>{convertDate(rewardDetails.redemptionDate)}</td>
										<td>{rewardDetails.pathPoints}</td>
										<td>{totalAvailability}</td>
										<td>
											{
												<img
													src={`${s3URL}/${rewardDetails.iconUrl}`}
													alt="icon"
													height="100px"
													width="100px"
													className="pointer"
													onClick={() => {
														setImagePath(`${s3URL}/${rewardDetails.iconUrl}`);
													}}
													onError={({ currentTarget }) => {
														currentTarget.onerror = null;
														currentTarget.src = "/assets/img/logo.png";
													}}
												/>
											}
										</td>
										<td>
											{
												<img
													src={`${s3URL}/${rewardDetails.bannerUrl}`}
													alt="icon"
													height="100px"
													width="100px"
													className="pointer"
													onClick={() => {
														setImagePath(`${s3URL}/${rewardDetails.bannerUrl}`);
													}}
													onError={({ currentTarget }) => {
														currentTarget.onerror = null;
														currentTarget.src = "/assets/img/logo.png";
													}}
												/>
											}
										</td>
									</tr>
								</tbody>
							</table>
							<hr />
							<div className="name">
								<b> Link To Claim Offer: </b>{" "}
								<a
									href={rewardDetails.linkToClaimOffer}
									rel="noreferrer"
									target="_blank"
								>
									{rewardDetails.linkToClaimOffer}
								</a>
							</div>
							<hr />
							{rewardDetails.terms && (
								<>
									<div className="name">
										<FormGroup>
											<Label>
												<b>Term</b>
											</Label>
											<div
												dangerouslySetInnerHTML={{
													__html: rewardDetails.terms,
												}}
											/>
										</FormGroup>
									</div>
									<hr />
								</>
							)}
							<div className="name">
								<FormGroup>
									<Label>
										<b>Description</b>
									</Label>
									<div
										dangerouslySetInnerHTML={{
											__html: rewardDetails.description,
										}}
									/>
								</FormGroup>
							</div>
						</div>
					)}
					{currentTab === 2 && (
						<table className="table mt-4">
							<thead>
								<tr>
									<th>#</th>
									<th>Reward CouponCode Id</th>
									<th>couponCode</th>
									<th>Availability Count</th>
								</tr>
							</thead>
							<tbody>
								{couponCode.map(
									({ couponCode, rewardCouponCodeId, availability }, index) => (
										<tr>
											<td>{index + 1}</td>
											<td>{rewardCouponCodeId}</td>
											<td>{couponCode}</td>
											<td>{availability}</td>
										</tr>
									)
								)}
							</tbody>
						</table>
					)}
					<ImagePreView
						imagePath={imagePath}
						showModel={imagePath ? true : false}
						onClose={(value) => setImagePath("")}
					/>
				</CardBody>
			</Card>
		</Fragment>
	);
};

export default RewardView;
