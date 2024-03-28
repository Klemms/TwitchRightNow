import React from "react";
import styles from './style.module.sass';
import Button from "../Button";
import {AppContext} from "../../../Contexts";
import Checkbox from "../Checkbox";

export default class FollowedChannelsTile extends React.Component {
    static contextType = AppContext;

    getFollowedTime(time) {
        let date = new Date(time);
        return date.toLocaleString(navigator.language, {
            month: "long",
            day: "numeric",
            year: "numeric"
        }) + " · " + date.toLocaleTimeString(navigator.language).substring(0, 5);
    }

    render() {
        let ch = this.props.channel;

        return (
            <div className={styles.notification}>
                <Button className={styles.streamerName} onClick={() => {
                    chrome.tabs.create({
                        url: `https://www.twitch.tv/${ch.login}`
                    })
                }}>{
                    this.context.livestreams.filter(val => {
                        return ch.login === val.user_login;
                    }).length > 0 ? (
                        <span className={styles.currentlyLive} title={'Currently live !'}></span>
                    ) : null
                } {ch.name} &#8599;</Button>
                <div
                    className={styles.followedDate}>{chrome.i18n.getMessage('tab_notifications_followed_on')}<br/>{this.getFollowedTime(ch.date)}
                </div>
                <div className={styles.notifText}>{chrome.i18n.getMessage('tab_notifications_enable')}<Checkbox
                    checked={this.props.isNotified} style={{float: 'right'}} onInteract={() => {
                    if (this.props.onCheckboxInteract) {
                        this.props.onCheckboxInteract();
                    }
                }}/></div>
            </div>
        );
    }
}
