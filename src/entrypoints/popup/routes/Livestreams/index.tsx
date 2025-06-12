import {SearchContext} from '@/entrypoints/popup/contexts/SearchContext.ts';
import {ViewContext} from '@/entrypoints/popup/contexts/ViewContext.ts';
import {useEvent} from '@/entrypoints/popup/hooks/useEvent.ts';
import {useResetScroll} from '@/entrypoints/popup/hooks/useResetScroll.ts';
import {queryGetFollowedLivestreams} from '@/entrypoints/popup/queries/queryGetFollowedLivestreams.ts';
import {LivestreamTile} from '@/entrypoints/popup/routes/Livestreams/components/LivestreamTile';
import {ChromeData} from '@/utils/ChromeData.ts';
import {EventNames} from '@/utils/EventNames.ts';
import {QueryKeys} from '@/utils/QueryKeys.ts';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {AnimatePresence} from 'motion/react';
import {useCallback, useContext, useEffect, useMemo} from 'react';
import styles from './style.module.scss';

export function Livestreams() {
    const {data: livestreams, isSuccess} = useQuery<Array<Livestream>>({
        queryKey: [QueryKeys.FOLLOWED_LIVESTREAMS],
        queryFn: () => queryGetFollowedLivestreams(),
    });

    const {data: favorites} = useQuery({
        queryKey: [QueryKeys.FAVORITE_STREAMER],
        queryFn: () => ChromeData.getFavorites(),
    });

    useResetScroll();

    const {ordering, setNamePosition, setBackButton} = useContext(ViewContext);
    const {value, setPlaceholder} = useContext(SearchContext);
    const queryClient = useQueryClient();

    const onLivestreams = useCallback(() => {
        queryClient.invalidateQueries({queryKey: [QueryKeys.FOLLOWED_LIVESTREAMS]});
    }, [queryClient]);
    useEvent(EventNames.LIVESTREAMS_UPDATE, onLivestreams);

    useEffect(() => {
        setPlaceholder(browser.i18n.getMessage('search_livestreams'));
        setNamePosition('left');
        setBackButton(false);
    }, [setNamePosition, setPlaceholder, setBackButton]);

    const tiles = useMemo(
        () =>
            isSuccess &&
            livestreams
                .toSorted((a, b) => (ordering === 'ASCENDANT' ? a.viewers - b.viewers : b.viewers - a.viewers))
                .toSorted((a, b) => {
                    if (!favorites) {
                        return 0;
                    }

                    if (favorites.includes(a.login) && !favorites.includes(b.login)) {
                        return -1;
                    } else if (!favorites.includes(a.login) && favorites.includes(b.login)) {
                        return 1;
                    }
                    return 0;
                })
                .filter((stream) =>
                    value.length > 0
                        ? stream.title.toLowerCase().includes(value.toLowerCase()) ||
                          stream.game.toLowerCase().includes(value.toLowerCase()) ||
                          stream.name.toLowerCase().includes(value.toLowerCase())
                        : true
                )
                .map((stream) => <LivestreamTile key={`livestream-${stream.login}`} motionL={true} stream={stream} />),
        [favorites, isSuccess, livestreams, ordering, value]
    );

    return (
        <div className={styles.livestreams}>
            <AnimatePresence>{tiles}</AnimatePresence>
        </div>
    );
}
