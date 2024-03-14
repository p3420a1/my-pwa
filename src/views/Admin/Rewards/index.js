import React, { Fragment, useState, useEffect } from "react";
import Avatar from "react-avatar";
import ListPageHeading from "containers/pages/ListPageHeading";
import Pagination from "containers/pages/Pagination";
import ImagePreView from "components/PerviewImage/ModalView";
import { getAllReWards } from "Apis/admin";
import { Link } from "react-router-dom";
import ReactLoading from "components/Loading";
import { convertDate } from "constants/defaultValues";
import StatusUpdate from "components/UpdateStatus";
import { showErrorMessage } from "utils/helper";
import { additional, s3URL } from "./constants";

const Rewards = React.memo((props) => {
	const [pageInfo, setPageInfo] = useState(additional);
	const [totalRewards, setTotalRewards] = useState([]);
	const [selectedPageSize, setSelectedPageSize] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchText, setSearchtext] = useState(undefined);
	const [viewImage, setViewImage] = useState(false);
	const [imagePath, setImagePath] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		getAllReWards(currentPage, selectedPageSize, searchText)
			.then(({ data, meta }) => {
				setTotalRewards(data);
				setPageInfo((currentState) => ({
					...currentState,
					totalPage: meta.totalPages,
					totalItemCount: meta.totalCount,
				}));
			})
			.catch((err) => {
				if (err.response || err.message) {
					const { data = {} } = err.response || {};
					showErrorMessage(data.error_message || err.message);
				}
			})
			.finally(() => {
				setLoading(false);
			});
	}, [selectedPageSize, currentPage, searchText]);
	const onSearchKey = (event) => {
		setSearchtext(event.target.value);
	};
	const changePageSize = (value) => {
		setSelectedPageSize(value);
	};
	const onChangePage = (value) => {
		setCurrentPage(value);
	};

	const startIndex = (currentPage - 1) * selectedPageSize;
	const endIndex = currentPage * selectedPageSize;

	return (
		<Fragment>
			<div className="container-fluid">
				<ListPageHeading
					onClick={() => props.history.push("/add-rewards")}
					addShow
					Addname="+ Add New rewards"
					match={props.match}
					heading="Rewards"
					changePageSize={changePageSize}
					selectedPageSize={selectedPageSize}
					totalItemCount={pageInfo.totalItemCount}
					startIndex={startIndex}
					endIndex={endIndex}
					onSearchKey={onSearchKey}
					orderOptions={pageInfo.orderOptions}
					pageSizes={pageInfo.pageSizes}
				/>
				<ReactLoading loading={loading} />
				<div className="card">
					<table className="table card-body table-striped animate__animated  animate__zoomIn animate__fadeInDown">
						<thead>
							<tr className="text-white">
								<th>#</th>
								<th>Icon</th>
								<th>Title</th>
								<th>Partner Name</th>
								<th>Path Points</th>
								<th>Status</th>
								<th>Expiration Date</th>
								<th>Redemption Date</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{totalRewards.map((redward, key) => (
								<tr key={key}>
									<td>{`${
										currentPage === 1
											? key + 1
											: (currentPage - 1) * selectedPageSize + key + 1
									}`}</td>
									<td>
										{redward.iconUrl ? (
											<img
												src={`${s3URL}/${redward.iconUrl}`}
												alt="icon"
												height="50px"
												width="50px"
												className="pointer"
												onClick={() => {
													setViewImage(true);
													setImagePath(`${s3URL}/${redward.iconUrl}`);
												}}
												onError={({ currentTarget }) => {
													currentTarget.onerror = null;
													currentTarget.src = "/assets/img/logo.png";
												}}
											/>
										) : (
											<Avatar
												round="10px"
												name={redward.partnerName}
												size="50"
												textSizeRatio={1}
												color="#485256"
											/>
										)}
									</td>
									<td>{redward.title}</td>
									<td>{redward.partnerName}</td>
									<td>{redward.pathPoints}</td>
									<td>
										<StatusUpdate
											data={redward}
											table="users"
											statusMessage={{
												available: "Available",
												1: "Active",
											}}
											isUpdate={false}
											updateKey="status"
										/>
									</td>
									<td>{convertDate(redward.expirationDate)}</td>
									<td>{convertDate(redward.redemptionDate)}</td>
									<td>
										<Link
											to={{
												pathname: "/edit-reward",
												state: { redward },
											}}
											className="btn btn-danger btn-sm mr-2"
										>
											Edit
										</Link>{" "}
										<Link
											to={{
												pathname: "/reward-details",
												state: { redward },
											}}
											className="btn btn-primary btn-sm"
										>
											View
										</Link>{" "}
									</td>
								</tr>
							))}
							{totalRewards.length === 0 && (
								<tr className="no-record-tr">
									<td colSpan="11">
										<h2 className="no-record">No record Found</h2>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
				<ImagePreView
					imagePath={imagePath}
					showModel={viewImage}
					onClose={(value) => setViewImage(value)}
				/>
				<Pagination
					currentPage={currentPage}
					totalPage={pageInfo.totalPage}
					onChangePage={(i) => onChangePage(i)}
				/>
			</div>
		</Fragment>
	);
});

export default Rewards;
