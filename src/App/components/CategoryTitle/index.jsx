import styles from './style.module.sass';
import React from 'react';
import PropTypes from 'prop-types';

const CategoryTitle = React.memo(function ({text = 'Default Text'}) {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.background}></div>
                <div className={styles.text}>{text}</div>
            </div>
        </div>
    );
});

CategoryTitle.propTypes = {
    text: PropTypes.string.isRequired
}

export default CategoryTitle;
