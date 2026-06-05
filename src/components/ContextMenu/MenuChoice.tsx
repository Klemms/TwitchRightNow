import classNames from 'classnames';
import {ReactNode, useCallback} from 'react';
import styles from './style.module.scss';

export interface MenuChoiceProps extends CustomizableComponent {
    children: ReactNode;
    onClick?: () => void;
}

export function MenuChoice({className, style, children, onClick}: MenuChoiceProps) {
    const click = useCallback(() => {
        if (onClick) {
            onClick();
        }
    }, [onClick]);

    return (
        <div className={classNames(styles.menuChoice, className)} style={style} onClick={click}>
            {children}
        </div>
    );
}
