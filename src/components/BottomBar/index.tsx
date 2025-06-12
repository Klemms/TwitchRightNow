import orderASC from '@/assets/images/order-ascendant.svg';
import orderDESC from '@/assets/images/order-descendant.svg';
import {BarButton} from '@/components/BarButton';
import {SearchContext} from '@/entrypoints/popup/contexts/SearchContext.ts';
import {ViewContext} from '@/entrypoints/popup/contexts/ViewContext.ts';
import {ChangeEventHandler, useCallback, useContext} from 'react';
import styles from './style.module.scss';

export const BottomBar = function BottomBar() {
    const {ordering, setOrdering} = useContext(ViewContext);
    const {placeholder, value, setValue} = useContext(SearchContext);

    const onInput = useCallback<ChangeEventHandler<HTMLInputElement>>(
        (event) => {
            setValue(event.target.value);
        },
        [setValue]
    );

    const onOrdering = useCallback<OnClick>(
        (_event, order: Ordering) => {
            setOrdering(order);
        },
        [setOrdering]
    );

    return (
        <div className={styles.bottomBar}>
            <input
                className={styles.searchBox}
                type={'text'}
                placeholder={placeholder}
                autoFocus
                value={value}
                onChange={onInput}
            />
            <div className={styles.rightPart}>
                <BarButton
                    icon={orderASC}
                    onClick={onOrdering}
                    extraData={'ASCENDANT'}
                    active={ordering === 'ASCENDANT'}
                />
                <BarButton
                    icon={orderDESC}
                    onClick={onOrdering}
                    extraData={'DESCENDANT'}
                    active={ordering === 'DESCENDANT'}
                />
            </div>
        </div>
    );
};
