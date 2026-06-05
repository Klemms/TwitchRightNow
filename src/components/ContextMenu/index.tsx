import classNames from 'classnames';
import {motion} from 'motion/react';
import {CSSProperties, ReactNode, useMemo} from 'react';
import styles from './style.module.scss';

export interface ContextMenuProps extends CustomizableComponent {
    children: ReactNode;
    origin: DOMRect;
}

export function ContextMenu({className, style, children, origin}: ContextMenuProps) {
    const finalStyle = useMemo<CSSProperties>(
        () => ({
            ...style,
            position: 'absolute',
            top: origin.bottom * 1.1,
            left: origin.left * 1.1,
        }),
        [origin.bottom, origin.left, style]
    );

    return (
        <motion.div
            initial={{
                height: 0,
                padding: 0,
            }}
            animate={{
                height: 'calc-size(auto, size)',
                padding: '8rem 0',
            }}
            exit={{
                height: 0,
                padding: 0,
            }}
            className={classNames(styles.contextMenu, className)}
            style={finalStyle}
        >
            {children}
        </motion.div>
    );
}
