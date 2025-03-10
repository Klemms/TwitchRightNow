import React from "react";
import styles from "./style.module.sass";
import Tab from "../Tab";
import {AppContext} from "../../../Contexts";
import loading from '../../../assets/images/loading.svg';
import ChromeData from "../../../ChromeData";
import FollowedChannelsTile from "../../components/FollowedChannelsTile";
import Checkbox from "../../components/Checkbox";

export default class NotificationsTab extends React.Component {
	static contextType = AppContext;

	state ={
		notifyAllStreams: false,
		notifiedStreams: []
	}

	componentDidMount() {
		ChromeData.demandGetFollowedChannels();
		ChromeData.getToNotifyStreams().then(value => {
			this.setState(() => {
				return {
					notifyAllStreams: value.notifyAllStreams,
					notifiedStreams: value.notifiedStreams
				}
			});
		});
	}

	render() {
		return (
			<Tab style={{textAlign: 'center'}} className={styles.tab}>
				<div className={styles.notifyAllStreams}>
					<span>{chrome.i18n.getMessage('tab_notifications_enable_all')}</span>
					<Checkbox checked={this.state.notifyAllStreams} onInteract={(e) => {
						ChromeData.notifyAllStreams((!this.state.notifyAllStreams)).then(() => {
							this.setState(() => {
								return {
									notifyAllStreams: !this.state.notifyAllStreams
								}
							});
						})
					}} />
				</div>
				{
					this.context.fetchedChannels ? (
						<div>
							{
								this.context.followedChannels.map(value => {
									let isNotified = this.state.notifiedStreams.includes(value.login);
									let component = <FollowedChannelsTile key={value.login} isNotified={isNotified} channel={value} onCheckboxInteract={() => {
										ChromeData.notifyStream(value.login, !isNotified).then(() => {
											ChromeData.getToNotifyStreams().then(val => {
												this.setState(() => {
													return {
														notifiedStreams: val.notifiedStreams
													}
												});
											});
										})
									}} />;

									if (this.context.currentSearch !== '') {
										if (value.name.toLowerCase().includes(this.context.currentSearch.toLowerCase())) {
											return component;
										}
										return null;
									}

									return component;
								})
							}
						</div>
					) : (
						<React.Fragment>
							<img src={loading} alt={'Loading...'} />
						</React.Fragment>
					)
				}
				<div className={styles.informations}>Twitch Right Now</div>
			</Tab>
		);
	}
}
