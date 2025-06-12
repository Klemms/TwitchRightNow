import {Button} from '@/components/Button';
import {StreamTag} from '@/components/StreamTag';
import {LivestreamThumbnail} from '@/entrypoints/popup/routes/Livestreams/components/LivestreamThumbnail';
import {faArrowUpRightFromSquare} from '@fortawesome/free-solid-svg-icons/faArrowUpRightFromSquare';
import {faVolumeXmark} from '@fortawesome/free-solid-svg-icons/faVolumeXmark';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React, {useCallback} from 'react';
import ReactTimeAgo from 'react-time-ago';
import styles from './style.module.scss';

export function Video({video}: {video: TwitchVideo}) {
    const openVideo = useCallback<OnClick>(
        (event) => {
            event.stopPropagation();
            browser.tabs.create({
                url: video.url,
            });
        },
        [video]
    );

    return (
        <div className={styles.video}>
            <div className={styles.title} title={video.title}>
                {video.title}
            </div>
            <div className={styles.bottom}>
                <LivestreamThumbnail
                    className={styles.thumbnail}
                    thumbnailUrl={video.thumbnail}
                    login={video.login}
                    name={
                        <ReactTimeAgo
                            className={styles.date}
                            date={video.creationDate}
                            timeStyle={'twitter'}
                            locale={navigator.language}
                        />
                    }
                />
                <div className={styles.rightPart}>
                    <div style={{display: 'contents', fontSize: '15rem'}}>
                        <div>{browser.i18n.getMessage('videos_duration').replaceAll('%duration%', video.duration)}</div>
                        <div>
                            {browser.i18n
                                .getMessage('videos_streamed_on')
                                .replaceAll(
                                    '%date%',
                                    video.creationDate.toLocaleDateString(navigator.language, {
                                        dateStyle: 'medium',
                                    })
                                )
                                .replaceAll(
                                    '%time%',
                                    video.creationDate.toLocaleTimeString(navigator.language, {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: undefined,
                                    })
                                )}
                        </div>
                    </div>
                    <div className={styles.buttons}>
                        {video.mutedSegments && video.mutedSegments.length > 0 ? (
                            <StreamTag
                                isolated={true}
                                style={{height: '20rem'}}
                                expandText={browser.i18n.getMessage('videos_muted')}
                            >
                                <FontAwesomeIcon icon={faVolumeXmark} />
                            </StreamTag>
                        ) : null}
                        <Button overrideClass={true} className={styles.button} onClick={openVideo}>
                            {browser.i18n.getMessage('videos_watch')}
                            <FontAwesomeIcon fontSize={'13rem'} icon={faArrowUpRightFromSquare} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
