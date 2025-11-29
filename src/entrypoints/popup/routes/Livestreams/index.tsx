import {Loading} from '@/components/Loading';
import {ChannelTile} from '@/components/Tiles/ChannelTile';
import {LivestreamTile} from '@/components/Tiles/LivestreamTile';
import {SearchContext} from '@/entrypoints/popup/contexts/SearchContext.ts';
import {ViewContext} from '@/entrypoints/popup/contexts/ViewContext.ts';
import {useEvent} from '@/entrypoints/popup/hooks/useEvent.ts';
import {useResetScroll} from '@/entrypoints/popup/hooks/useResetScroll.ts';
import {queryGetFollowedLivestreams} from '@/entrypoints/popup/queries/queryGetFollowedLivestreams.ts';
import {querySearchChannels} from '@/entrypoints/popup/queries/querySearchChannels.ts';
import {ChromeData} from '@/utils/ChromeData.ts';
import {EventNames} from '@/utils/EventNames.ts';
import {QueryKeys} from '@/utils/QueryKeys.ts';
import {useDebouncedValue} from '@tanstack/react-pacer';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {AnimatePresence, motion} from 'motion/react';
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

    const [debouncedSearch] = useDebouncedValue(value, {
        wait: 650,
    });
    const {
        data: searchResults,
        isSuccess: searchSuccess,
        isPending: searchPending,
        isError: searchError,
    } = useQuery({
        queryKey: [QueryKeys.SEARCH_CHANNELS, debouncedSearch],
        queryFn: () => querySearchChannels(debouncedSearch),
        enabled: debouncedSearch.length >= 3,
        staleTime: Time.MINUTE_10,
    });

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
            isSuccess
                ? livestreams
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
                      .map((stream) => (
                          <LivestreamTile key={`livestream-${stream.login}`} motionL={true} stream={stream} />
                      ))
                : [],
        [favorites, isSuccess, livestreams, ordering, value]
    );

    const searchTiles = useMemo(
        () =>
            debouncedSearch.length >= 3 && value === debouncedSearch && searchSuccess
                ? searchResults.map((stream) => (
                      <ChannelTile
                          key={`search-channel-${stream.broadcaster_login}`}
                          motionLayout={true}
                          channel={stream}
                      />
                  ))
                : [],
        [debouncedSearch, searchResults, searchSuccess, value]
    );

    const isSearching = value.length >= 3 && searchSuccess;
    const isActivelySearching = value.length >= 3 && (searchPending || value !== debouncedSearch);

    return (
        <div className={styles.livestreams}>
            <AnimatePresence>
                {tiles}
                {tiles.length > 0 && value.length >= 3 && !searchError ? (
                    <motion.div
                        key={'separator-search-livestream'}
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className={styles.separator}
                        layout={true}
                    ></motion.div>
                ) : null}
                {searchTiles}
                {isSearching && searchTiles.length <= 0 && !isActivelySearching ? (
                    <motion.div
                        key={'search-no-result'}
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className={styles.searching}
                        layout={true}
                    >
                        <span className={styles.text}>{browser.i18n.getMessage('search_no_result')}</span>
                    </motion.div>
                ) : null}
                {isActivelySearching ? (
                    <motion.div
                        key={'search-searching-for'}
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className={styles.searching}
                        layout={true}
                    >
                        <Loading style={{height: '30rem'}} />
                        <span className={styles.text}>
                            {browser.i18n.getMessage('search_searching_for')}
                            <span className={styles.searchText}>{value}</span>
                        </span>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
}
