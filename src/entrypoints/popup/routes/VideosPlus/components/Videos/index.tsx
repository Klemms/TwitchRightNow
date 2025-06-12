import {Video} from '@/components/Video';
import {queryGetTwitchVideos} from '@/entrypoints/popup/queries/queryGetTwitchVideos.ts';
import {QueryKeys} from '@/utils/QueryKeys.ts';
import {useSuspenseQuery} from '@tanstack/react-query';
import React, {useMemo} from 'react';
import styles from './style.module.scss';

interface Props {
    userId: string;
}

export function Videos({userId}: Props) {
    const {data: videos} = useSuspenseQuery<TwitchVideo[]>({
        queryKey: [QueryKeys.TWITCH_VIDEOS, userId],
        queryFn: () => queryGetTwitchVideos(userId),
        staleTime: 600_000,
    });

    const tiles = useMemo(
        () => videos.slice(1, 10).map((video) => <Video key={`video-${video.id}`} video={video} />),
        [videos]
    );

    return <div className={styles.videos}>{tiles}</div>;
}
