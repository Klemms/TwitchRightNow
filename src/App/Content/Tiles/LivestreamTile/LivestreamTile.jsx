import React from "react";
import styles from './LivestreamTile.module.sass';
import Button from "../../../Button/Button";
import {getStreamUptime} from "../../../Util";

export default React.memo(function LivestreamTile({livestream}) {
	return (
		<Button className={styles.stream} onClick={() => {
			chrome.tabs.create({
				url: `https://www.twitch.tv/${livestream.user_login}`
			})
		}}>
			<img className={styles.streamPic} src={livestream.thumbnail_url.replace('{width}', '128').replace('{height}', '72')}/>
			<div className={styles.streamerName} title={(livestream.user_name === '' ? livestream.user_login : livestream.user_name)}>{(livestream.user_name === '' ? livestream.user_login : livestream.user_name)}</div>
			<div className={styles.rightPart}>
				<div className={styles.streamTitle} title={livestream.title}>{livestream.title}</div>
				<div className={styles.streamGame} title={livestream.game_name}>{livestream.game_name}</div>
				<div className={styles.viewerCount}><span className={styles.liveCircle}></span>{new Intl.NumberFormat('fr-FR').format(livestream.viewer_count)}</div>
				<div className={styles.streamTags}>
					<div className={styles.streamTime}>{getStreamUptime(livestream.started_at)}</div>
					<div className={styles.streamLanguage}>{livestream.language}</div>
					{
						livestream.is_mature ? <div className={styles.streamMature}>18+</div> : null
					}
				</div>
			</div>
		</Button>
	);
});
