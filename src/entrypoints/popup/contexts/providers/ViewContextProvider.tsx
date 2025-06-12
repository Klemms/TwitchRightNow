import {ViewContext, ViewContextType} from '@/entrypoints/popup/contexts/ViewContext.ts';
import React, {ReactNode, useMemo, useState} from 'react';

export function ViewContextProvider({
    children,
    outlet,
}: {
    children: ReactNode;
    outlet: React.RefObject<HTMLDivElement | null>;
}) {
    const [ordering, setOrdering] = useState<Ordering>('DESCENDANT');
    const [namePosition, setNamePosition] = useState<'left' | 'right'>('left');
    const [backButton, setBackButton] = useState(false);

    const value = useMemo<ViewContextType>(
        () => ({
            ordering: ordering,
            setOrdering: setOrdering,
            namePosition: namePosition,
            setNamePosition: setNamePosition,
            backButton: backButton,
            setBackButton: setBackButton,
            mainOutlet: outlet,
        }),
        [backButton, namePosition, ordering, outlet]
    );

    return <ViewContext value={value}>{children}</ViewContext>;
}
