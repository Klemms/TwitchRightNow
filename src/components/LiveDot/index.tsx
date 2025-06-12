import {useGSAP} from '@gsap/react';
import classNames from 'classnames';
import gsap from 'gsap';
import {useMemo, useRef} from 'react';
import styles from './style.module.scss';

export function LiveDot({className, style}: CustomizableComponent) {
    const animDelay = useMemo(() => 2.5 + Math.random() * 15, []);

    const ref = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            delay: animDelay,
            repeat: -1,
            repeatDelay: animDelay,
        });

        tl.to(
            ref.current,
            {
                backgroundColor: 'rgb(53,0,0)',
                ease: 'none',
            },
            0
        );
        tl.to(
            ref.current,
            {
                backgroundColor: 'rgb(235, 4, 0)',
                ease: 'none',
            },
            0.5
        );
    });

    return <div ref={ref} className={classNames(styles.liveDot, className)} style={style}></div>;
}
