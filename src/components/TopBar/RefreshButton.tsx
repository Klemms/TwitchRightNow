import {Button} from '@/components/Button';
import styles from '@/components/TopBar/style.module.scss';
import {TwitchAPI} from '@/entrypoints/background/twitch_api.ts';
import {useEvent} from '@/entrypoints/popup/hooks/useEvent.ts';
import {useInterval} from '@/entrypoints/popup/hooks/useInterval.ts';
import {useMouseOver} from '@/entrypoints/popup/hooks/useMouseOver.ts';
import {ChromeData} from '@/utils/ChromeData.ts';
import {EventNames} from '@/utils/EventNames.ts';
import {QueryKeys} from '@/utils/QueryKeys.ts';
import {faRefresh} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {AnimatePresence, motion} from 'motion/react';
import React, {useCallback, useRef, useState} from 'react';
import ReactTimeAgo from 'react-time-ago';

export function RefreshButton() {
    const [isRefreshAllowed, setIsRefreshAllowed] = useState(false);

    const ref = useRef<HTMLDivElement>(null);
    const isHovered = useMouseOver(ref);

    const {data: lastRefresh, isSuccess} = useQuery({
        queryKey: [QueryKeys.LAST_REFRESH],
        queryFn: async () => {
            const res = await ChromeData.getLastRefresh();

            if (res === false) {
                return res;
            }

            return res.getTime();
        },
    });

    const onInterval = useCallback(() => {
        if (typeof lastRefresh === 'number') {
            const diff = Date.now() - lastRefresh;
            if (diff > 60000) {
                setIsRefreshAllowed(true);
            } else {
                setIsRefreshAllowed(false);
            }
            return;
        }
        setIsRefreshAllowed(true);
    }, [lastRefresh]);
    useInterval(1000, onInterval);

    const queryClient = useQueryClient();

    const onLivestreams = useCallback(() => {
        queryClient.invalidateQueries({queryKey: [QueryKeys.LAST_REFRESH]});
    }, [queryClient]);
    useEvent(EventNames.LIVESTREAMS_UPDATE, onLivestreams);

    return (
        <>
            <motion.div
                ref={ref}
                layout
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                whileTap={{
                    opacity: isRefreshAllowed ? 0.7 : 1,
                    scale: isRefreshAllowed ? 0.9 : 1,
                }}
                style={{height: '100%', position: 'relative'}}
            >
                <AnimatePresence>
                    {isHovered ? (
                        <motion.div
                            initial={{
                                opacity: 0,
                                translateX: '-75%',
                                translateY: '-50%',
                            }}
                            animate={{
                                opacity: 1,
                                translateX: '-105%',
                            }}
                            exit={{
                                opacity: 0,
                                translateX: '-125%',
                            }}
                            className={styles.refreshHoverTip}
                        >
                            {isSuccess && lastRefresh !== false ? (
                                <>
                                    {browser.i18n.getMessage('button_refresh_time_ago')}
                                    <ReactTimeAgo
                                        key={`update-last-refresh-${lastRefresh}`}
                                        className={styles.date}
                                        date={lastRefresh}
                                        timeStyle={'twitter'}
                                        locale={navigator.language}
                                    />
                                </>
                            ) : (
                                browser.i18n.getMessage('button_refresh_failed')
                            )}
                        </motion.div>
                    ) : null}
                </AnimatePresence>
                <Button
                    overrideClass={true}
                    className={styles.nav}
                    onClick={() => {
                        if (isRefreshAllowed) {
                            TwitchAPI.updateFollowedLiveStreams()
                                .then(() => {
                                    queryClient.invalidateQueries({queryKey: [QueryKeys.FOLLOWED_LIVESTREAMS]});
                                    queryClient.invalidateQueries({queryKey: [QueryKeys.LAST_REFRESH]});
                                })
                                .catch((err) => {
                                    ChromeData.setError(err);
                                    queryClient.resetQueries({queryKey: [QueryKeys.LAST_ERROR]});
                                });
                        }
                    }}
                >
                    <FontAwesomeIcon
                        style={{
                            opacity: isRefreshAllowed ? 1 : 0.2,
                        }}
                        icon={faRefresh}
                    />
                </Button>
            </motion.div>
        </>
    );
}
