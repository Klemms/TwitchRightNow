import React from "react";
import styles from "./style.module.sass";
import Tab from "../Tab";
import LivestreamTile from "../../components/LivestreamTile";
import {AppContext} from "../../../Contexts";

export default class LivestreamTab extends React.Component {
    static contextType = AppContext;

    render() {
        let hasFavorites = false;
        const isSearching = this.context.currentSearch !== '';
        const sortedStreams = this.context.livestreams.sort((a, b) => {
            if (a.isFavorite || b.isFavorite) {
                hasFavorites = true;
            }

            return this.context.sorting === 'descendant' ? b.viewer_count - a.viewer_count : a.viewer_count - b.viewer_count;
        });

        hasFavorites = hasFavorites && this.context.showFavorites;

        return (
            <Tab style={{paddingTop: '10px'}} className={styles.tab}>
                {
                    // Favorite streams rendering
                    hasFavorites && !isSearching ? (
                        <React.Fragment>
                            {
                                sortedStreams.map(value => {
                                    if (value.isFavorite) {
                                        return <LivestreamTile key={value.user_login} livestream={value}/>;
                                    }
                                })
                            }
                            <div className={styles.separator}>
                                <div></div>
                            </div>
                        </React.Fragment>
                    ) : null
                }
                {
                    // Other streams + current search
                    sortedStreams.map(value => {
                        if (isSearching) {
                            if (value.user_name.toLowerCase().includes(this.context.currentSearch.toLowerCase()) ||
                                value.game_name.toLowerCase().includes(this.context.currentSearch.toLowerCase())) {
                                return <LivestreamTile key={value.user_login} livestream={value}/>;
                            }
                            return null;
                        } else if (!value.isFavorite || !this.context.showFavorites) {
                            return <LivestreamTile key={value.user_login} livestream={value}/>;
                        }
                    })
                }
                <div
                    className={styles.informations}>{chrome.i18n.getMessage('tab_streams_last_update').replaceAll('%time%', new Date(this.context.lastUpdate).toLocaleTimeString(navigator.language))}</div>
            </Tab>
        );
    }
}
