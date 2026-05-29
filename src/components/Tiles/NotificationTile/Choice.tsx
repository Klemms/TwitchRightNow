import {Checkbox} from '@/components/Checkbox';
import {ChangeEventHandler, CSSProperties, ReactNode, useCallback} from 'react';
import styles from './style.module.scss';

interface ChoiceProps {
    children: ReactNode;
    checked: boolean;
    onToggle: (isOn: boolean) => void;
    style?: CSSProperties;
}

export function Choice({children, checked, onToggle, style}: ChoiceProps) {
    const onCheck = useCallback<ChangeEventHandler<HTMLInputElement>>(
        (e) => {
            e.stopPropagation();
            onToggle(e.target.checked);
        },
        [onToggle]
    );

    return (
        <div className={styles.choice} style={style}>
            <div className={styles.name}>{children}</div>
            <Checkbox checked={checked} onToggle={onCheck} />
        </div>
    );
}
