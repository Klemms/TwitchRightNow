import React, {ReactNode, useEffect, useMemo, useState} from 'react';

interface Props extends CustomizableComponent {
    children?: ReactNode;
    image: string;
    fallback: string;
    hasTransition?: boolean;
    ref: React.Ref<HTMLDivElement>;
}

export function ImageLoad({children, image, fallback, className, style, hasTransition = false, ref}: Props) {
    const [isLoaded, setLoaded] = useState(image === '');
    // There's a grace period of 50ms where we allow the browser to cache-hit the image
    const [gracePeriod, setGracePeriod] = useState(false);

    useEffect(() => {
        setTimeout(() => setGracePeriod(true), 50);
        setLoaded(false);

        const img = new Image();
        img.onload = () => setLoaded(true);
        img.src = image;
    }, [image]);

    const finalStyle = useMemo<React.CSSProperties>(
        () => ({
            ...style,
            ...(hasTransition && gracePeriod ? {transition: 'background-image 0.5s linear'} : {}),
            ...(gracePeriod
                ? {backgroundImage: `url("${isLoaded ? image : fallback}")`}
                : {backgroundImage: `url("${image}")`}),
        }),
        [gracePeriod, fallback, hasTransition, image, isLoaded, style]
    );

    return (
        <div className={className} style={finalStyle} ref={ref}>
            {children}
        </div>
    );
}
