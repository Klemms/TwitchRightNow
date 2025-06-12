import loading from '@/assets/images/loading.svg';
import {motion} from 'motion/react';

export function Loading({style, className}: CustomizableComponent) {
    return (
        <div
            style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '55rem', ...style}}
            className={className}
        >
            <motion.img
                src={loading}
                initial={{rotateZ: 0}}
                animate={{rotateZ: '360deg', transition: {duration: 1.5, ease: 'linear', repeat: Infinity}}}
                alt={'Loading...'}
                style={{height: '100%'}}
            />
        </div>
    );
}
