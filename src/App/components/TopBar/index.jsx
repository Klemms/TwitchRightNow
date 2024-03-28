import React, {Component} from "react";
import styles from "./style.module.sass";
import SearchBox from "../SearchBox";
import Button from "../Button";
import ChromeData from "../../../ChromeData";
import {AppContext} from "../../../Contexts";

export default class TopBar extends Component {
	static contextType = AppContext;

	render() {
		return (
			<React.Fragment>
				<div className={styles.topBar}>

					{this.context.isLoggedIn ? (
							<React.Fragment>
								<SearchBox/>

								<Button
									className={styles.userInfos}
									title={chrome.i18n.getMessage('login_disconnect_hint')}
									onClick={(event) => {
										ChromeData.disconnect();
									}}>
									<img className={styles.userPic} src={this.context.userPicture} alt={this.context.username}/>
									<span className={styles.username}>{this.context.username}</span>
								</Button>
							</React.Fragment>
						) :
						<React.Fragment>
							<div className={styles.disconnectedTip}>TTV Right Now</div>

							<Button
								className={styles.loginTwitch}
								onClick={(event) => {
									chrome.tabs.create({url: "https://id.twitch.tv/oauth2/authorize?client_id=9ds9194jefzxja6up90v9jrdgxnlac&redirect_uri=https://klemms.github.io/TwitchRightNow/&response_type=token&scope=user:read:follows"});
								}}
							>{chrome.i18n.getMessage('login_button')}</Button>
						</React.Fragment>
					}
				</div>
			</React.Fragment>
		);
	}
}
