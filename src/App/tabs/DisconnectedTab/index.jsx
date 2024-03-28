import React from 'react';
import styles from "./style.module.sass";
import Tab from "../Tab";

export default React.memo(function DisconnectedTab() {
    return (
        <Tab>
            <div className={styles.disconnectedStreamTip}>
                <h3>{chrome.i18n.getMessage('login_line1')}</h3><br/>
                {chrome.i18n.getMessage('login_line2')}<br/>
                {chrome.i18n.getMessage('login_line3')}<br/><br/>
                {chrome.i18n.getMessage('login_line4')}<br/>
                {chrome.i18n.getMessage('login_line5')}
            </div>
        </Tab>
    );
});
