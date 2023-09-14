import React from "react";
import styles from './Checkbox.module.sass';

export default class Checkbox extends React.Component {

	render() {
		return (
			<label className={styles.switch} style={this.props.style || {}}>
				<input checked={this.props.checked} type={'checkbox'} onChange={(event) => {
					if (this.props.onInteract) {
						this.props.onInteract(event);
					}
				}} />
				<span className={styles.slider}></span>
			</label>
		);
	}
}
