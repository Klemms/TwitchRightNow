import {StreamTag} from '@/components/StreamTag';
import {useChannelInformations} from '@/entrypoints/popup/hooks/useChannelInformations.ts';
import {faArrowUpRightFromSquare} from '@fortawesome/free-solid-svg-icons/faArrowUpRightFromSquare';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {motion} from 'motion/react';
import React, {useCallback} from 'react';
import styles from './style.module.scss';

interface Props {
    userId: string;
}

export function ChannelDescription({userId}: Props) {
    const channel = useChannelInformations(userId);

    const openChannel = useCallback(() => {
        browser.tabs.create({
            url: `https://twitch.tv/${channel.login}`,
        });
    }, [channel.login]);

    return (
        <div className={styles.channelDescription}>
            <div className={styles.avatar} style={{backgroundImage: `url("${channel.avatar}")`}}></div>
            <div className={styles.rightPart}>
                <div className={styles.name}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '10rem'}}>
                        <span style={{textShadow: `0 0 15rem ${channel.chatColor}`}}>{channel.name}</span>
                        <StreamTag isolated={true}>{channel.language}</StreamTag>
                    </div>
                    <motion.div
                        whileHover={{scale: 1.1}}
                        title={browser.i18n.getMessage('channel_goto').replaceAll('%user%', channel.name)}
                    >
                        <FontAwesomeIcon
                            className={styles.externalLink}
                            onClick={openChannel}
                            icon={faArrowUpRightFromSquare}
                        />
                    </motion.div>
                </div>
                <div className={styles.creationDate}>
                    {browser.i18n
                        .getMessage('channel_created_since')
                        .replaceAll(
                            '%date%',
                            channel.creationDate.toLocaleDateString(navigator.language, {
                                dateStyle: 'long',
                            })
                        )
                        .replaceAll(
                            '%time%',
                            channel.creationDate.toLocaleTimeString(navigator.language, {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: undefined,
                            })
                        )}
                </div>
                <div className={styles.description}>{channel.description}</div>
            </div>
        </div>
    );
}
