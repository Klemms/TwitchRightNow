import {Button} from '@/components/Button';
import {LiveDot} from '@/components/LiveDot';
import {useChannelInformations} from '@/entrypoints/popup/hooks/useChannelInformations.ts';
import {queryGetFollowedLivestreams} from '@/entrypoints/popup/queries/queryGetFollowedLivestreams.ts';
import {queryGetTwitchVideos} from '@/entrypoints/popup/queries/queryGetTwitchVideos.ts';
import {LivestreamThumbnail} from '@/entrypoints/popup/routes/Livestreams/components/LivestreamThumbnail';
import {QueryKeys} from '@/utils/QueryKeys.ts';
import {faArrowUpRightFromSquare} from '@fortawesome/free-solid-svg-icons/faArrowUpRightFromSquare';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useQuery, useSuspenseQuery} from '@tanstack/react-query';
import React, {useCallback, useMemo} from 'react';
import styles from './style.module.scss';

interface Props {
    userId: string;
}

export function FeaturedVideo({userId}: Props) {
    const {data: livestreams} = useQuery<Array<Livestream>>({
        queryKey: [QueryKeys.FOLLOWED_LIVESTREAMS],
        queryFn: () => queryGetFollowedLivestreams(),
    });

    const {data: videos} = useSuspenseQuery<TwitchVideo[]>({
        queryKey: [QueryKeys.TWITCH_VIDEOS, userId],
        queryFn: () => queryGetTwitchVideos(userId),
        staleTime: 600_000,
    });

    const channel = useChannelInformations(userId);

    const video = useMemo(() => {
        if (videos.length > 0) {
            return videos[0];
        } else {
            return null;
        }
    }, [videos]);

    const linkedStream = useMemo(
        () => livestreams?.find((stream) => stream.id === video?.streamId),
        [livestreams, video?.streamId]
    );

    const openVideo = useCallback<OnClick>(
        (event) => {
            event.stopPropagation();
            browser.tabs.create({
                url: video?.url,
            });
        },
        [video]
    );

    if (video === null) {
        return null;
    }

    return (
        <div className={styles.featuredVideo}>
            <div className={styles.top}>
                <LivestreamThumbnail
                    className={styles.thumbnail}
                    name={
                        linkedStream ? (
                            <div style={{display: 'flex', alignItems: 'center', gap: '5rem'}}>
                                <LiveDot />
                                {browser.i18n.getMessage('video_live_now')}
                            </div>
                        ) : undefined
                    }
                    login={channel.login}
                    thumbnailUrl={linkedStream ? linkedStream.thumbnail : video.thumbnail}
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
                        <Button overrideClass={true} className={styles.button} onClick={openVideo}>
                            {browser.i18n.getMessage('videos_watch_vod')}
                            <FontAwesomeIcon fontSize={'15rem'} icon={faArrowUpRightFromSquare} />
                        </Button>
                    </div>
                </div>
            </div>
            <div className={styles.bottom}>
                <div className={styles.title} title={video.title}>
                    {video.title}
                </div>
            </div>
        </div>
    );
}
