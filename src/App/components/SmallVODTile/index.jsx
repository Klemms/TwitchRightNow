import React, {useEffect, useMemo, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.sass';
import {getVideo} from '../../rest/apis/GetVideos';
import {useTwitchVideo} from '../../hooks/useTwitchVideo';
import classNames from 'classnames';
import {StreamThumbnail} from '../StreamThumbnail';
import ReactTimeAgo from 'react-time-ago';
import gsap from 'gsap';
import {useMouseOver} from '../../hooks/useMouseOver';
import {useGSAP} from '@gsap/react';

/**
 * Provide either vodData or vodID ! In case both are present, only vodData will be used.
 */
export const SmallVODTile = function SmallVODTile({className, vodData, vodID}) {
    const [vod, setVOD] = useState(vodData);
    const ref = useRef();
    const openAnimationRef = useRef(null);
    const isReversing = useRef(false);
    const isHovered = useMouseOver(ref);

    useGSAP(() => {
        if (isHovered) {
            if (isReversing.current)
                return;

            openAnimationRef.current = gsap.to(ref.current, {
                translateX: -ref.current.offsetLeft,
                duration: 0.25,
                width: '100%',
                ease: 'power1.inOut',
                onReverseComplete: () => {
                    ref.current.classList.remove(styles.hovered);
                    gsap.set(ref.current, {clearProps: true});
                    openAnimationRef.current = null;
                    isReversing.current = false;
                }
            });
        } else {
            if (openAnimationRef.current) {
                ref.current.classList.add(styles.hovered);
                isReversing.current = true;
                openAnimationRef.current.reverse();
            }
        }
    }, [isHovered]);

    const thumbnailURL = useMemo(() => {
        return vod.thumbnail.replaceAll('%{width}', '320').replaceAll('%{height}', '180');
    }, [vod]);
    const date = useMemo(() => {
        return new Date(vod.date);
    }, [vod])

    useEffect(() => {
        if (typeof vodData === 'object') {

        } else if (typeof vodID === 'string') {
            useTwitchVideo()
            getVideo(vodID).then(result => {
                setVOD(result);
            });
        }
    }, [vodData, vodID]);

    return (
        <React.Fragment>
            {
                vod ? (
                    <React.Fragment>
                        <div className={classNames(className, styles.container)}>
                            <div ref={ref}
                                 className={classNames(className, styles.vod, isHovered ? styles.hovered : false)}>
                                <StreamThumbnail image={thumbnailURL}
                                                 className={classNames(styles.thumbnail, className)}/>
                                <div className={styles.content}>
                                    <ReactTimeAgo className={styles.date} date={date} timeStyle={'twitter'}
                                                  locale={navigator.language}/>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                ) : null
            }
        </React.Fragment>
    );
};

SmallVODTile.propTypes = {
    vodData: PropTypes.object,
    vodID: PropTypes.string
}

