import {Loading} from '@/components/Loading';
import {NotificationTile} from '@/components/Tiles/NotificationTile';
import {Choice} from '@/components/Tiles/NotificationTile/Choice.tsx';
import {SearchContext} from '@/entrypoints/popup/contexts/SearchContext.ts';
import {ViewContext} from '@/entrypoints/popup/contexts/ViewContext.ts';
import {useResetScroll} from '@/entrypoints/popup/hooks/useResetScroll.ts';
import {queryGetFollowedChannels} from '@/entrypoints/popup/queries/queryGetFollowedChannels.ts';
import {ChromeData} from '@/utils/ChromeData.ts';
import {QueryKeys} from '@/utils/QueryKeys.ts';
import {useQuery, useSuspenseQuery} from '@tanstack/react-query';
import {AnimatePresence} from 'motion/react';
import React, {Suspense, useContext, useEffect, useMemo} from 'react';
import styles from './style.module.scss';

function Content({search}: {search: string}) {
    const {data: channels, isSuccess} = useSuspenseQuery({
        queryKey: [QueryKeys.FOLLOWED_CHANNELS],
        queryFn: () => queryGetFollowedChannels(),
        staleTime: Time.MINUTE_10,
    });

    const {data: favorites} = useSuspenseQuery({
        queryKey: [QueryKeys.FAVORITE_STREAMER],
        queryFn: () => ChromeData.getFavorites(),
    });

    const followed = useMemo(
        () =>
            channels.map((val) => ({
                ...val,
                isFavorite: favorites.includes(val.broadcaster_login),
            })),
        [channels, favorites]
    );

    const tiles = useMemo(
        () =>
            isSuccess
                ? followed
                      .filter(
                          (channel) =>
                              !search ||
                              search.length <= 0 ||
                              channel.broadcaster_login.includes(search) ||
                              channel.broadcaster_name.includes(search)
                      )
                      .toSorted((a, b) => a.broadcaster_name.localeCompare(b.broadcaster_name))
                      .map((channel) => (
                          <NotificationTile key={`channel_${channel.broadcaster_id}`} channel={channel} />
                      ))
                : [],
        [followed, isSuccess, search]
    );

    return <AnimatePresence>{tiles}</AnimatePresence>;
}

export function Followed() {
    useResetScroll();

    const {
        data: allSteamsNotify,
        isSuccess,
        refetch: refetchNotifyAllStreams,
    } = useQuery({
        queryKey: [QueryKeys.ALL_STREAMS_NOTIFY],
        queryFn: () => ChromeData.getNotifyAllStreams(),
    });

    const {setNamePosition, setBackButton} = useContext(ViewContext);
    const {value: searchValue, setPlaceholder} = useContext(SearchContext);

    useEffect(() => {
        setPlaceholder(browser.i18n.getMessage('search_followed_channels'));
        setNamePosition('right');
        setBackButton(true);
    }, [setNamePosition, setPlaceholder, setBackButton]);

    return (
        <div className={styles.page}>
            <Choice
                checked={isSuccess ? allSteamsNotify : false}
                onToggle={(isOn) => {
                    ChromeData.setNotifyAllStreams(isOn).then(() => refetchNotifyAllStreams());
                }}
                style={{
                    background: 'var(--main-lighter-color)',
                    margin: 0,
                    padding: '10rem 10rem',
                }}
            >
                {browser.i18n.getMessage('tab_notifications_enable_all')}
            </Choice>
            <div className={styles.channels}>
                <Suspense
                    fallback={
                        <Loading
                            style={{position: 'absolute', left: '50%', top: '115px', transform: 'translateX(-50%)'}}
                        />
                    }
                >
                    <Content search={searchValue} />
                </Suspense>
            </div>
        </div>
    );
}
