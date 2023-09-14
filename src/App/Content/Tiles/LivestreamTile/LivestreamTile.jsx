import React from "react";
import styles from './LivestreamTile.module.sass';
import Button from "../../../Button/Button";

export default class LivestreamTile extends React.Component {
	getStreamUptime(startTime) {
		let start = new Date(startTime);
		let now = new Date();
		let hours = (((now - start) / 1000) / 60) / 60;
		let minutes = (((now - start) / 1000) / 60) % 60;

		return parseInt(hours) + ":" + parseInt(minutes).toString().padStart(2, '0');
	}

	render() {
		let ls = this.props.livestream;

		return (
			<Button className={styles.stream} onClick={() => {
				chrome.tabs.create({
					url: `https://www.twitch.tv/${ls.user_login}`
				})
			}}>
				<img className={styles.streamPic} src={ls.thumbnail_url.replace('{width}', '128').replace('{height}', '72')}/>
				<div className={styles.streamerName} title={(ls.user_name === '' ? ls.user_login : ls.user_name)}>{(ls.user_name === '' ? ls.user_login : ls.user_name)}</div>
				<div className={styles.rightPart}>
					<div className={styles.streamTitle} title={ls.title}>{ls.title}</div>
					<div className={styles.streamGame} title={ls.game_name}>{ls.game_name}</div>
					<div className={styles.viewerCount}><span className={styles.liveCircle}></span>{new Intl.NumberFormat('fr-FR').format(ls.viewer_count)}</div>
					<div className={styles.streamTags}>
						<div className={styles.streamTime}>{this.getStreamUptime(ls.started_at)}</div>
						<div className={styles.streamLanguage}>{ls.language}</div>
						{
							ls.is_mature ? <div className={styles.streamMature}>18+</div> : null
						}
					</div>
				</div>
			</Button>
		);
	}
}
