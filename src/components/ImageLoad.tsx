import React, {ReactNode, RefObject, useLayoutEffect, useRef} from 'react';

interface Props extends CustomizableComponent {
    children?: ReactNode;
    image: string;
    fallback: string;
    fadeIn?: boolean;
    ref: RefObject<HTMLDivElement | null>;
}

export function ImageLoad({children, image, fallback, className, style, fadeIn = false, ref}: Props) {
    const divRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!divRef.current) {
            return;
        }

        let cancelLoad = false;
        const img = new Image();
        img.onload = () => {
            if (!cancelLoad && divRef.current) {
                divRef.current.style.backgroundImage = `url("${image}")`;
            }
        };
        img.src = image;

        if (img.complete) {
            cancelLoad = true;
            divRef.current.style.backgroundImage = `url("${image}")`;
        } else {
            divRef.current.style.backgroundImage = `url("${fallback}")`;
        }

        return () => {
            cancelLoad = true;
            if (divRef.current) {
                divRef.current.style.backgroundImage = '';
            }
        };
    }, [fadeIn, image, fallback]);

    return (
        <div
            className={className}
            style={style}
            ref={(el) => {
                divRef.current = el;
                if (ref) {
                    ref.current = el;
                }
            }}
        >
            {children}
        </div>
    );
}
