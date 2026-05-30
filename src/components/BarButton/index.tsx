import {Button, ButtonProps} from '@/components/Button';
import classNames from 'classnames';
import styles from './style.module.scss';

interface Props extends ButtonProps {
    icon: string;
    active?: boolean;
}

export function BarButton({onClick, icon, active = false, extraData}: Props) {
    return (
        <Button
            className={classNames(styles.button, active && styles.active)}
            onClick={onClick}
            extraData={extraData}
            overrideClass={true}
        >
            <img src={icon} />
        </Button>
    );
}
