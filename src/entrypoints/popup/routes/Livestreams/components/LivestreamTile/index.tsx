import gift from '@/assets/images/gift.svg';
import {Button} from '@/components/Button';
import {LiveDot} from '@/components/LiveDot';
import {StreamTag} from '@/components/StreamTag';
import {useFavorite} from '@/entrypoints/popup/hooks/useFavorite.ts';
import {LivestreamThumbnail} from '@/entrypoints/popup/routes/Livestreams/components/LivestreamThumbnail';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons/faArrowRight';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {motion} from 'motion/react';
import React, {useCallback} from 'react';
import {useNavigate} from 'react-router';
import styles from './style.module.scss';

export const LivestreamTile = function LivestreamTile({
    stream,
    motionL = false,
}: {
    stream: Livestream;
    motionL?: boolean;
}) {
    const dropsOn = stream.tags.some(
        (tag) =>
            tag.toLowerCase().includes('drops') ||
            tag.toLowerCase().includes('reward') ||
            tag.toLowerCase().includes('récompense')
    );

    const {isFavorite} = useFavorite(stream.login);

    const onClick = useCallback(() => {
        browser.tabs.create({
            url: `https://twitch.tv/${stream.login}`,
        });
    }, [stream.login]);

    const navigate = useNavigate();
    const openVideos = useCallback<React.MouseEventHandler<HTMLDivElement>>(
        (event) => {
            event.stopPropagation();
            navigate(`/videos/${stream.userId}`);
        },
        [navigate, stream.userId]
    );

    return (
        <motion.div
            layout={motionL}
            className={styles.livestream}
            exit={{scale: 0.8, opacity: 0}}
            onClick={onClick}
            style={{
                ...(isFavorite && {backgroundColor: 'var(--main-lighter-color-accent)'}),
            }}
        >
            <LivestreamThumbnail
                thumbnailUrl={stream.thumbnail}
                name={stream.name}
                allowHover={true}
                login={stream.login}
                className={styles.thumbnail}
            />
            <div className={styles.rightPart}>
                <div className={styles.title} title={stream.title}>
                    {stream.title}
                </div>
                <div className={styles.game} title={stream.game}>
                    {stream.game}
                </div>
                <div className={styles.bottom}>
                    <div className={styles.tags}>
                        <div className={styles.viewerCount}>
                            <LiveDot />
                            {new Intl.NumberFormat('fr-FR').format(stream.viewers)}
                        </div>
                        {dropsOn ? (
                            <StreamTag isolated icon={gift}>
                                {browser.i18n.getMessage('tags_drops_on')}
                            </StreamTag>
                        ) : null}
                        {stream.isMature ? <StreamTag isolated>18+</StreamTag> : null}
                    </div>
                    <div className={styles.buttons}>
                        <Button onClick={openVideos} className={styles.button} overrideClass={true}>
                            {browser.i18n.getMessage('videos_videos')}
                            <FontAwesomeIcon icon={faArrowRight} className={styles.icon} />
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
