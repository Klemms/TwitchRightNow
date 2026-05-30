import classNames from 'classnames';
import React, {useCallback} from 'react';
import styles from './style.module.scss';

export interface ButtonProps extends CustomizableComponent {
    children?: React.ReactNode;
    onClick?: OnClick;
    extraData?: any;
    overrideClass?: boolean;
}

export const Button = function Button({children, className, style, onClick, extraData, overrideClass}: ButtonProps) {
    const click = useCallback<React.MouseEventHandler<HTMLDivElement>>(
        (event) => {
            if (onClick) {
                onClick(event, extraData);
            }
        },
        [extraData, onClick]
    );

    return (
        <div className={classNames(!overrideClass && styles.button, className)} style={style} onClick={click}>
            {children}
        </div>
    );
};
