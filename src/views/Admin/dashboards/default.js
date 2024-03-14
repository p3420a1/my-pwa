import React, { useState } from "react";
import { injectIntl } from "react-intl";
import { Row } from "reactstrap";
import { Link } from "react-router-dom";
import { Colxx, Separator } from "components/common/CustomBootstrap";
import GradientWithRadialProgressCard from "components/cards/GradientWithRadialProgressCard";
import { getDashwardCounts } from "utils/helper";
const DefaultDashboard = React.memo(() => {
	const [dashBoardData] = useState(getDashwardCounts());

	return (
		<div className="h-100">
			<Row>
				<Colxx xxs="12">
					<h1>Dashboard</h1>
					<Separator className="mb-5" />
				</Colxx>
			</Row>
			<Row>
				<Colxx lg="12" md="12">
					<Row>
						<Colxx lg="4" xl="4" className="mb-4">
							<Link to="/rewards">
								<GradientWithRadialProgressCard
									icon="iconsminds-gift-box"
									title={`${dashBoardData.totalRewards} Total Reward`}
									detail=""
								/>
							</Link>
						</Colxx>
						<Colxx lg="4" xl="4" className="mb-4">
							<div to="/advisors">
								<GradientWithRadialProgressCard
									icon="simple-icon-trophy"
									title={`${dashBoardData.availableRewards} Available Reward`}
									detail=""
								/>
							</div>
						</Colxx>
						<Colxx lg="4" xl="4" className="mb-4">
							<div>
								<GradientWithRadialProgressCard
									icon="iconsminds-big-data"
									title={`${dashBoardData.redeemedRewards} Redeemed Rewards`}
									detail=""
								/>
							</div>
						</Colxx>
					</Row>
				</Colxx>
			</Row>
		</div>
	);
});
export default injectIntl(DefaultDashboard);
