import React, { Fragment, useState, useEffect } from "react";
import { NotificationManager } from "components/common/react-notifications";
import { Input, Button } from "reactstrap";
const valuesName = {
	providerWillAddSession: "Maximum upcoming Seshys allowed per Instructor",
	userWillBookSession: "Maximum upcoming bookings allowed per User",
	providerWillAddSessionInday: "Universal daily Seshy limit",
	sessionDaysLimit: "Maximum days in advance Instructor can list seshy",
	perSessionUserLimit: "Maximum Users allowed per seshy",
};
const AppSettings = React.memo(() => {
	const [settings, setSettings] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const updateValues = ({ id, value }) => {
		if (!value) {
			return false;
		}
	};
	const handleChange = ({ index, value }) => {
		if (value < 0) return false;
		const allSettings = [...settings];
		allSettings[index].value = value;
		setSettings(allSettings);
	};
	return isLoading ? (
		<div className="loading" />
	) : (
		<Fragment>
			<h1>App settings</h1>
			<hr />
			<table className="table table-striped animate__animated  animate__zoomIn animate__fadeInDown">
				<thead>
					<tr>
						<th>#</th>
						<th>Name</th>
						<th>Value</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{settings.map((setting, key) => (
						<React.Fragment key={setting.id}>
							<tr>
								<td>{key + 1}</td>
								<td>{valuesName[setting.keyName]}</td>
								<td>
									<Input
										onChange={({ target: { value } }) => {
											handleChange({ index: key, value });
										}}
										type="number"
										value={setting.value}
										step="0"
										min="1"
									/>
								</td>
								<td>
									<Button
										onClick={() =>
											updateValues({ id: setting.id, value: setting.value })
										}
									>
										Update
									</Button>
								</td>
							</tr>
						</React.Fragment>
					))}
					{setSettings.length === 0 && (
						<tr className="no-record-tr">
							<td colSpan="4">
								<h2 className="no-record">No record Found</h2>
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</Fragment>
	);
});

export default AppSettings;
