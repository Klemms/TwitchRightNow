import gift from '@/assets/images/gift.svg';
import {Button} from '@/components/Button';
import {LiveDot} from '@/components/LiveDot';
import {LivestreamThumbnail} from '@/components/LivestreamThumbnail';
import {StreamTag} from '@/components/StreamTag';
import {useFavorite} from '@/entrypoints/popup/hooks/useFavorite.ts';
import type {TypeChannel} from '@/types/SchemaChannel.ts';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons/faArrowRight';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {motion} from 'motion/react';
import React, {useCallback} from 'react';
import {useNavigate} from 'react-router';
import styles from './style.module.scss';

export type ChannelTileProps = {
    channel: TypeChannel;
    motionLayout?: boolean;
};

export const ChannelTile = function ChannelTile({channel, motionLayout = false}: ChannelTileProps) {
    const dropsOn = channel.tags.some(
        (tag) =>
            tag.toLowerCase().includes('drops') ||
            tag.toLowerCase().includes('reward') ||
            tag.toLowerCase().includes('récompense')
    );

    const {isFavorite} = useFavorite(channel.broadcaster_login);

    const onClick = useCallback(() => {
        browser.tabs.create({
            url: `https://twitch.tv/${channel.broadcaster_login}`,
        });
    }, [channel.broadcaster_login]);

    const navigate = useNavigate();
    const openVideos = useCallback<React.MouseEventHandler<HTMLDivElement>>(
        (event) => {
            event.stopPropagation();
            navigate(`/videos/${channel.id}`);
        },
        [navigate, channel.id]
    );

    return (
        <motion.div
            layout={motionLayout}
            className={styles.livestream}
            exit={{scale: 0.8, opacity: 0}}
            onClick={onClick}
            style={{
                ...(isFavorite && {backgroundColor: 'var(--main-lighter-color-accent)'}),
            }}
        >
            <LivestreamThumbnail
                thumbnailUrl={channel.thumbnail_url}
                name={channel.display_name}
                allowHover={true}
                login={channel.broadcaster_login}
                className={styles.thumbnail}
            />
            <div className={styles.rightPart}>
                <div className={styles.title} title={channel.title || channel.display_name}>
                    {channel.title || channel.display_name}
                </div>
                <div className={styles.game} title={channel.game_name}>
                    {channel.game_name}
                </div>
                <div className={styles.bottom}>
                    <div className={styles.tags}>
                        {channel.is_live && (
                            <div className={styles.viewerCount}>
                                <LiveDot />
                                {browser.i18n.getMessage('video_live_now')}
                            </div>
                        )}
                        {dropsOn ? (
                            <StreamTag isolated icon={gift}>
                                {browser.i18n.getMessage('tags_drops_on')}
                            </StreamTag>
                        ) : null}
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
