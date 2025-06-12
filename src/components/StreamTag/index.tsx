import {useMouseOver} from '@/entrypoints/popup/hooks/useMouseOver.ts';
import classNames from 'classnames';
import {motion} from 'motion/react';
import {ReactNode, useRef} from 'react';
import styles from './styles.module.scss';

interface Props extends CustomizableComponent {
    icon?: string;
    children?: ReactNode;
    isolated?: boolean;
    expandText?: string | boolean;
}

export function StreamTag({icon, children, className, style, isolated = false, expandText}: Props) {
    const ref = useRef(null);
    const isHovered = useMouseOver(ref);

    return (
        <motion.div ref={ref} className={classNames(styles.tag, className, isolated && styles.isolated)} style={style}>
            {icon ? <img src={icon} /> : null}
            {children}
            {isHovered && expandText ? expandText : null}
        </motion.div>
    );
}
