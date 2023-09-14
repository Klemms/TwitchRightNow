import React from "react";
import styles from "./LivestreamTab.module.sass";
import Tab from "../Tab";
import LivestreamTile from "../../Tiles/LivestreamTile/LivestreamTile";
import {AppContext} from "../../../../Contexts";

export default class LivestreamTab extends React.Component {
	static contextType = AppContext;

	render() {
		return (
			<Tab style={{paddingTop: '10px'}}>
				{
					this.context.livestreams.map(value => {
						if (this.context.currentSearch !== '') {
							if (value.user_name.toLowerCase().includes(this.context.currentSearch.toLowerCase()) ||
								value.game_name.toLowerCase().includes(this.context.currentSearch.toLowerCase())) {
								return <LivestreamTile livestream={value} />;
							}
							return null;
						}

						return <LivestreamTile livestream={value} />;
					})
				}
				<div className={styles.informations}>{`Last Update ${new Date(this.context.lastUpdate).toLocaleTimeString('fr-FR')} - Updates every 5mins`}</div>
			</Tab>
		);
	}
}
