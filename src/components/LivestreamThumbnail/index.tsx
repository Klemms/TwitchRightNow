import defaultAvatar from '@/assets/images/default-stream-pic.png';
import {AnimatedStar} from '@/components/AnimatedStar';
import {ImageLoad} from '@/components/ImageLoad';
import {useFavorite} from '@/entrypoints/popup/hooks/useFavorite.ts';
import {useMouseOver} from '@/entrypoints/popup/hooks/useMouseOver.ts';
import classNames from 'classnames';
import React, {ReactNode, useRef} from 'react';
import styles from './style.module.scss';

interface Props extends CustomizableComponent {
    thumbnailUrl: string;
    name?: string | ReactNode;
    allowHover?: boolean;
    login: string;
}

export function LivestreamThumbnail({thumbnailUrl, name, allowHover = false, login, className, style}: Props) {
    const ref = useRef<HTMLDivElement>(null);

    const isHovered = useMouseOver(ref);
    const {isFavorite, setFavorite} = useFavorite(login);

    return (
        <ImageLoad
            ref={ref}
            className={classNames(styles.thumbnail, className)}
            style={style}
            image={thumbnailUrl.replace('{width}', '208').replace('{height}', '117')}
            fallback={defaultAvatar}
        >
            {allowHover && isHovered ? (
                <div className={styles.favoriteStreamer}>
                    <AnimatedStar
                        onClick={(event) => {
                            event.stopPropagation();
                            setFavorite(!isFavorite);
                        }}
                        isFull={isFavorite}
                        style={{
                            color: isFavorite ? 'gold' : 'white',
                        }}
                    />
                </div>
            ) : name ? (
                <div className={styles.streamerName} title={typeof name === 'string' ? name : ''}>
                    {name}
                </div>
            ) : null}
        </ImageLoad>
    );
}
