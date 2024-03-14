import React, { Component, Suspense } from "react";
import { Route, withRouter, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import AppLayout from "layout/AppLayout";

const Default = React.lazy(() =>
	import(/* webpackChunkName: "dashboards" */ "./dashboards/default")
);
const Rewards = React.lazy(() =>
	import(/* webpackChunkName: "Rewards" */ "./Rewards")
);
const AddRewards = React.lazy(() =>
	import(/* webpackChunkName: "Add-Rewards" */ "./Rewards/AddRewards")
);
const EditRewards = React.lazy(() =>
	import(/* webpackChunkName: "edit-Rewards" */ "./Rewards/EditRewards")
);
const RewardDetails = React.lazy(() =>
	import(/* webpackChunkName: "Rewards-details" */ "./Rewards/RewardsDetails")
);
const Push = React.lazy(() =>
	import(/* webpackChunkName: "add class" */ "./push")
);

const AppSetting = React.lazy(() =>
	import(/* webpackChunkName: "AppSetting" */ "./AppSettings")
);

class App extends Component {
	render() {
		return (
			<AppLayout>
				<div className="dashboard-wrapper animate__animated  animate__zoomIn">
					<Suspense fallback={<div className="loading" />}>
						<Switch>
							<Redirect exact from={`/`} to={`/dashboards`} />
							<Route
								exact
								path="/dashboards"
								render={(props) => <Default {...props} />}
							/>
							<Route path="/push" render={(props) => <Push {...props} />} />
							<Route path="/rewards" component={Rewards} />
							<Route path="/edit-reward" component={EditRewards} />
							<Route path="/add-rewards" component={AddRewards} />
							<Route path="/app-settings" component={AppSetting} />
							<Route path="/reward-details" component={RewardDetails} />
							<Redirect to="/error" />
						</Switch>
					</Suspense>
				</div>
			</AppLayout>
		);
	}
}
const mapStateToProps = ({ menu }) => {
	const { containerClassnames } = menu;
	return { containerClassnames };
};

export default withRouter(connect(mapStateToProps, {})(App));
