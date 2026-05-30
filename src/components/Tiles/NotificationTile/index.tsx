import {Button} from '@/components/Button';
import {Choice} from '@/components/Tiles/NotificationTile/Choice.tsx';
import {useFavorite} from '@/entrypoints/popup/hooks/useFavorite.ts';
import {useNotification} from '@/entrypoints/popup/hooks/useNotification.ts';
import {TypeBroadcaster} from '@/types/SchemaBroadcaster.ts';
import {faStar} from '@fortawesome/free-solid-svg-icons';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons/faArrowRight';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {motion} from 'motion/react';
import React, {useCallback} from 'react';
import {useNavigate} from 'react-router';
import styles from './style.module.scss';

export type NotificationTileProps = {
    channel: TypeBroadcaster;
};

export function NotificationTile({channel}: NotificationTileProps) {
    const {isFavorite, setFavorite} = useFavorite(channel.broadcaster_login);
    const {isNotified, setToNotify} = useNotification(channel.broadcaster_login);

    const navigate = useNavigate();
    const openVideos = useCallback<React.MouseEventHandler<HTMLDivElement>>(
        (event) => {
            event.stopPropagation();
            navigate(`/videos/${channel.broadcaster_id}`);
        },
        [navigate, channel.broadcaster_id]
    );

    return (
        <motion.div
            layout={true}
            className={styles.channel}
            exit={{scale: 0.8, opacity: 0}}
            style={{
                ...(isFavorite && {backgroundColor: 'var(--main-lighter-color-accent)'}),
            }}
        >
            <div className={styles.title} title={channel.broadcaster_name || channel.broadcaster_login}>
                {isFavorite && <FontAwesomeIcon icon={faStar} className={styles.icon} />}
                <span>{channel.broadcaster_name || channel.broadcaster_login}</span>
            </div>
            <div className={styles.followedOn}>
                {browser.i18n.getMessage('tab_notifications_followed_on')} {channel.followed_at.toLocaleString()}
            </div>
            <div className={styles.choices}>
                <Choice
                    checked={isFavorite}
                    onToggle={(isOn) => {
                        setFavorite(isOn);
                    }}
                >
                    {browser.i18n.getMessage('tab_notifications_favorite_toggle')}
                </Choice>
                <Choice
                    checked={isNotified}
                    onToggle={(isOn) => {
                        setToNotify(isOn);
                    }}
                >
                    {browser.i18n.getMessage('tab_notifications_enable')}
                </Choice>
            </div>
            <div className={styles.buttons}>
                <Button onClick={openVideos} className={styles.button} overrideClass={true}>
                    {browser.i18n.getMessage('videos_videos')}
                    <FontAwesomeIcon icon={faArrowRight} className={styles.icon} />
                </Button>
            </div>
        </motion.div>
    );
}
