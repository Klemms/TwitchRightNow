import {Component} from "react";
import styles from "./Content.module.sass";
import {AppContext} from "../../Contexts";
import DisconnectedTab from "./Tabs/DisconnectedTab/DisconnectedTab";
import LivestreamTab from "./Tabs/LivestreamTab/LivestreamTab";
import NotificationsTab from "./Tabs/NotificationsTab/NotificationsTab";

export default class Content extends Component {
	static contextType = AppContext;

	render() {
		let currentTab = null;

		if (this.context.isLoggedIn) {
			switch (this.context.currentTab) {
				case 'livestream':
					currentTab = <LivestreamTab />;
					break;
				case 'notifications':
					currentTab = <NotificationsTab />;
					break;
			}
		} else {
			currentTab = <DisconnectedTab />;
		}

		return (
			<div className={styles.tabs}>
				{currentTab}
			</div>
		);
	}
}
