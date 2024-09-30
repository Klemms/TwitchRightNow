import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {memo, useEffect, useRef, useState} from 'react';
import defaultStreamPic from '../../../assets/images/default-stream-pic.png';
import styles from './style.module.sass';

const StreamThumbnail = memo(function StreamThumbnail({className, image}) {
    const [isLoaded, setLoaded] = useState(false);
    const hasTransition = useRef(false);

    useEffect(() => {
        // If the image takes more than 100ms to load, it's probably not in the cache, then we enable the transition for
        // when the image has finished loading
        setTimeout(() => {
            hasTransition.current = true;
        }, 100);

        const img = new Image();
        img.onload = () => {
            setLoaded(true);
        };
        img.src = image;
    }, [image]);

    return (
        <div className={classNames(styles.image, className)} style={{
            backgroundImage: `url(${isLoaded ? image : defaultStreamPic})`,
            transition: hasTransition.current ? 'background-image 400ms ease-in-out' : 'none'
        }}></div>
    );
});

StreamThumbnail.propTypes = {
    className: PropTypes.string,
    image: PropTypes.any.isRequired
};

export default StreamThumbnail;
