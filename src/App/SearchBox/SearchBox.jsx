import styles from './SearchBox.module.sass';
import {Component} from "react";
import {AppContext} from "../../Contexts";

export default class SearchBox extends Component {
	static contextType = AppContext;

	render() {
		return (
			<input
				className={styles.searchBox}
				type="text"
				placeholder={`Search ${this.context.currentTab === 'livestream' ? 'live streams or games' : 'followed streams'}`}
				autoFocus
				value={this.context.currentSearch}
				onChange={(event) => {
					this.context.setCurrentSearch(event.target.value);
				}}
			/>
		);
	}
}
