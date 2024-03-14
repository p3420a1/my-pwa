import React, { memo, Suspense } from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
const Admin = React.lazy(() =>
	import(/* webpackChunkName: "admin" */ "./Admin")
);
const Routes = () => {
	return (
		<Suspense fallback={<div className="loading" />}>
			<Router>
				<Switch>
					<Route path="/" component={Admin} />
				</Switch>
			</Router>
		</Suspense>
	);
};

export default memo(Routes);
