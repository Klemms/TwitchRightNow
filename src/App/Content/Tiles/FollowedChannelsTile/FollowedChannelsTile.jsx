import React from "react";
import styles from './FollowedChannelsTile.module.sass';
import Button from "../../../Button/Button";
import {AppContext} from "../../../../Contexts";
import Checkbox from "../../../Checkbox/Checkbox";
import ChromeData from "../../../../ChromeData";

export default class FollowedChannelsTile extends React.Component {
	static contextType = AppContext;

	getFollowedTime(time) {
		let date = new Date(time);
		return date.toLocaleString("en-US", {month: "long", day: "numeric", year: "numeric"}) + " · " + date.toLocaleTimeString("fr-FR", {hour12: false}).substring(0, 5);
	}

	render() {
		let ch = this.props.channel;

		return (
			<div className={styles.notification}>
				<Button className={styles.streamerName} onClick={() => {
					chrome.tabs.create({
						url: `https://www.twitch.tv/${ch.login}`
					})
				}} >{
					this.context.livestreams.filter(val => {
						return ch.login === val.user_login;
					}).length > 0 ? (
						<span className={styles.currentlyLive} title={'Currently live !'} ></span>
					) : null
				} {ch.name} &#8599;</Button>
				<div className={styles.followedDate}>Followed on :<br />{this.getFollowedTime(ch.date)}</div>
				<div className={styles.notifText}>Enable Notifications<Checkbox checked={this.props.isNotified} style={{float: 'right'}} onInteract={() => {
					if (this.props.onCheckboxInteract) {
						this.props.onCheckboxInteract();
					}
				}} /></div>
			</div>
		);
	}
}
