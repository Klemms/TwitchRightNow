import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.sass';
import {getStreamerVideos} from '../../rest/apis/GetVideos';
import {SmallVODTile} from '../SmallVODTile';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';

export const VodLine = function VodLine({streamerName, streamerID, includeFirst = true}) {
    const [vods, setVods] = useState([]);
    const ref = useRef();
    useGSAP(() => {
        if (vods.length > 0) {
            gsap.from(ref.current, {
                height: 0,
                opacity: 0,
                duration: 0.5,
                paddingTop: 0,
                paddingBottom: 0,
                ease: 'power2.inOut'
            });
        }
    }, {
        dependencies: [vods],
        revertOnUpdate: true
    });

    useEffect(() => {
        getStreamerVideos(streamerID, includeFirst ? 3 : 4).then(result => {
            if (Array.isArray(result)) {
                const res = [...result];
                if (!includeFirst)
                    res.shift();
                setVods(includeFirst ? res : res);
            }
        });
    }, [streamerID]);

    return (
        <React.Fragment>
            {
                (vods.length) > 0 ? (
                    <div ref={ref} className={styles.vodLine}>
                        <div className={styles.title}>{chrome.i18n.getMessage("videos_pastbroadcasts")}</div>
                        <div className={styles.line}>
                            {
                                vods.map(vod => {
                                    return <SmallVODTile key={vod.id} className={styles.vod} vodData={vod}/>;
                                })
                            }
                        </div>
                    </div>
                ) : null
            }
        </React.Fragment>
    );
};

VodLine.propTypes = {
    streamerName: PropTypes.string.isRequired,
    streamerID: PropTypes.string.isRequired,
    includeFirst: PropTypes.bool
}

