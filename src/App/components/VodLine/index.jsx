import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.sass';
import {getStreamerVideos} from '../../rest/apis/GetVideos';
import {SmallVODTile} from '../SmallVODTile';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import Button from '../Button';

export const VodLine = function VodLine({streamerName, streamerLogin, streamerID, includeFirst = true}) {
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
                ease: 'power2.inOut',
                onComplete: () => {
                    gsap.set(ref.current, {
                        clearProps: 'all'
                    });
                }
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
                        <div className={styles.title}>
                            {chrome.i18n.getMessage("videos_pastbroadcasts")}
                            <Button className={styles.rightTitle} onClick={() => {
                                chrome.tabs.create({
                                    url: `https://www.twitch.tv/${streamerLogin}/videos?filter=archives&sort=time`
                                })
                            }}>{chrome.i18n.getMessage("videos_see_all")}&#8599;</Button>
                        </div>
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
    streamerLogin: PropTypes.string.isRequired,
    streamerID: PropTypes.string.isRequired,
    includeFirst: PropTypes.bool
}

