import classNames from "classnames";
import React, {memo, useCallback, useContext, useRef} from "react";
import ChromeData from '../../../ChromeData';
import {AppContext} from '../../../Contexts';
import {useMouseOver} from "../../hooks/useMouseOver";
import {getStreamUptime} from "../../Util";
import AnimatedStar from '../AnimatedStar';
import Button from "../Button";
import StreamThumbnail from '../StreamThumbnail/index.jsx';
import {VodLine} from '../VodLine';
import styles from './style.module.sass';

const LivestreamTile = memo(function LivestreamTile({livestream}) {
    const {update, pastBroadcastsFeature} = useContext(AppContext);
    const ref = useRef();
    const isHovered = useMouseOver(ref);

    //console.log(livestream);

    const onFavoriteClick = useCallback(event => {
        event.stopPropagation();

        if (livestream.isFavorite) {
            ChromeData.removeFavorite(livestream.user_login).then(() => {
                update();
            });
        } else {
            ChromeData.addFavorite(livestream.user_login).then(() => {
                update();
            });
        }
    }, [livestream, update]);

    return (
        <div className={styles.container}>
            <Button ref={ref} className={styles.stream} onClick={() => {
                chrome.tabs.create({
                    url: `https://www.twitch.tv/${livestream.user_login}`
                });
            }}>
                <div className={styles.streamPicContainer} style={{display: 'inline-block'}}>
                    <StreamThumbnail className={classNames(styles.streamPic, isHovered ? styles.hovered : false)}
                                     image={livestream.thumbnail_url.replace('{width}', '128').replace('{height}', '72')}/>
                    {
                        isHovered ? (
                            <AnimatedStar
                                isFull={livestream.isFavorite}
                                className={classNames(styles.favoriteIcon, livestream.isFavorite ? styles.favorited : false)}
                                hoverClassName={classNames(styles.hovered)}
                                onClick={onFavoriteClick}
                                title={!livestream.isFavorite ? chrome.i18n.getMessage('favorite_add') : chrome.i18n.getMessage('favorite_remove')}
                            />
                        ) : null
                    }
                </div>
                {
                    !isHovered ? (
                        <div className={styles.streamerName}
                             title={(livestream.user_name === '' ? livestream.user_login : livestream.user_name)}>{(livestream.user_name === '' ? livestream.user_login : livestream.user_name)}</div>
                    ) : null
                }
                <div className={styles.rightPart}>
                    <div className={styles.streamTitle} title={livestream.title}>{livestream.title}</div>
                    <div className={styles.streamGame} title={livestream.game_name}>{livestream.game_name}</div>
                    <div className={styles.viewerCount}><span
                        className={styles.liveCircle}></span>{new Intl.NumberFormat('fr-FR').format(livestream.viewer_count)}
                    </div>
                    <div className={styles.streamTags}>
                        <div className={styles.streamTime}>{getStreamUptime(livestream.started_at)}</div>
                        <div className={styles.streamLanguage}>{livestream.language}</div>
                        {
                            livestream.is_mature ? <div className={styles.streamMature}>18+</div> : null
                        }
                    </div>
                </div>
            </Button>
            {
                pastBroadcastsFeature && livestream.isFavorite ? (
                    <VodLine streamerName={livestream.user_name} streamerLogin={livestream.user_login}
                             streamerID={livestream.user_id} includeFirst={false}/>
                ) : null
            }
        </div>
    );
});

export default LivestreamTile;
