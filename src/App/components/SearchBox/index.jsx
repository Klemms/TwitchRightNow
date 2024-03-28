import styles from './style.module.sass';
import {Component} from "react";
import {AppContext} from "../../../Contexts";

export default class SearchBox extends Component {
	static contextType = AppContext;

	render() {
		return (
			<input
				className={styles.searchBox}
				type="text"
				placeholder={this.context.currentTab === 'livestream' ? chrome.i18n.getMessage('search_livestreams') : chrome.i18n.getMessage('search_followed')}
				autoFocus
				value={this.context.currentSearch}
				onChange={(event) => {
					this.context.setCurrentSearch(event.target.value);
				}}
			/>
		);
	}
}
