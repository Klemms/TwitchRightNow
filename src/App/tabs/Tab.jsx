import {Component} from "react";
import styles from "./Tab.module.sass";

export default class Tab extends Component {
	render() {
		return (
			<div className={this.props.overrideClassName || styles.tab} style={this.props.style || {}}>
				{this.props.children}
			</div>
		);
	}
}
