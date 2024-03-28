import React from "react";
import styles from './style.module.sass';

export default function Checkbox({style, checked, onInteract}) {
    return (
        <label className={styles.switch} style={style || {}}>
            <input checked={checked} type={'checkbox'} onChange={(event) => {
                if (onInteract) {
                    onInteract(event);
                }
            }}/>
            <span className={styles.slider}></span>
        </label>
    );
}
