import {Component} from "react";
import styles from "./DisconnectedTab.module.sass";
import Tab from "../Tab";

export default class DisconnectedTab extends Component {
	render() {
		return (
			<Tab>
				<div className={styles.disconnectedStreamTip}>
					<h3>Log in with your Twitch account</h3><br />
					Live streams from people you follow<br />
					will be show here once you're logged in.<br /><br />
					Use the button located in the<br />upper right corner.
				</div>
			</Tab>
		);
	}
}
