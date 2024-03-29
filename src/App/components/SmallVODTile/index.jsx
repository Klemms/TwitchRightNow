import React, {useEffect, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.sass';
import {getVideo} from '../../rest/apis/GetVideos';
import {useTwitchVideo} from '../../hooks/useTwitchVideo';
import classNames from 'classnames';
import {StreamThumbnail} from '../StreamThumbnail';

/**
 * Provide either vodData or vodID ! In case both are present, only vodData will be used.
 */
export const SmallVODTile = function SmallVODTile({className, vodData, vodID}) {
    const [vod, setVOD] = useState(vodData);
    const thumbnailURL = useMemo(() => {
        return vod.thumbnail.replaceAll('%{width}', '320').replaceAll('%{height}', '180');
    }, [vod]);

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
                    <div className={classNames(className, styles.vod)}>
                        <StreamThumbnail image={thumbnailURL} className={styles.thumbnail} />
                        <div className={styles.content}>
                            {vod.title}
                        </div>
                    </div>
                ) : null
            }
        </React.Fragment>
    );
};

SmallVODTile.propTypes = {
    vodData: PropTypes.object,
    vodID: PropTypes.string
}

