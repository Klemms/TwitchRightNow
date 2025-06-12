import {faStar as emptyStar} from '@fortawesome/free-regular-svg-icons';
import {faStar as solidStar} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import {motion} from 'motion/react';
import React from 'react';
import styles from './style.module.scss';

interface Props extends CustomizableComponent {
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    isFull?: boolean;
    title?: string;
}

export function AnimatedStar({onClick, isFull, title, style, className}: Props) {
    return (
        <div onClick={onClick} title={title} className={classNames(styles.icon, className)} style={style}>
            <motion.div
                whileHover={{scale: 1.4, opacity: 0, transition: {duration: 0.4}}}
                className={styles.animationIcon}
            >
                <FontAwesomeIcon icon={isFull ? solidStar : emptyStar} />
            </motion.div>
            <FontAwesomeIcon icon={isFull ? solidStar : emptyStar} />
        </div>
    );
}
