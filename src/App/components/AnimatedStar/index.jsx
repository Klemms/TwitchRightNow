import React, {useCallback, useRef} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import {useMouseOver} from '../../hooks/useMouseOver';
import classNames from 'classnames';
import {useOnHover} from '../../hooks/useOnHover';
import styles from './style.module.sass';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
import {faStar as emptyStar} from "@fortawesome/free-regular-svg-icons";
import {faStar as solidStar} from "@fortawesome/free-solid-svg-icons";

const AnimatedStar = function AnimatedStar({className, hoverClassName, onClick, title, isFull}) {
    const ref = useRef();
    const animatedRef = useRef();
    const isHovered = useMouseOver(ref);
    const {contextSafe} = useGSAP();

    const hoverAnimation = contextSafe(() => {
        gsap.fromTo(animatedRef.current, {
            scale: 1,
            opacity: 1
        }, {
            scale: 1.4,
            opacity: 0,
            duration: 0.4
        });
    });

    const onHover = useCallback(() => {
        hoverAnimation();
    }, [ref]);
    useOnHover(ref, onHover);

    return (
        <React.Fragment>
            <div
                ref={ref}
                className={classNames(className, isHovered ? hoverClassName : false)}
                title={title}
                onClick={onClick}
            >
                <FontAwesomeIcon ref={animatedRef} className={styles.animationIcon}
                                 icon={isFull ? solidStar : emptyStar}/>
                <FontAwesomeIcon className={styles.icon} icon={isFull ? solidStar : emptyStar}/>
            </div>
        </React.Fragment>
    );
};

AnimatedStar.propTypes = {
    className: PropTypes.string,
    hoverClassName: PropTypes.string,
    isFull: PropTypes.bool.isRequired,
    title: PropTypes.string,
    onClick: PropTypes.func
}

export default AnimatedStar;
