import {ViewContext, type ViewContextType} from '@/entrypoints/popup/contexts/ViewContext.ts';
import type {TypeOrdering} from '@/types/SchemaOrdering.ts';
import {ChromeData} from '@/utils/ChromeData.ts';
import {QueryKeys} from '@/utils/QueryKeys.ts';
import {useSuspenseQuery} from '@tanstack/react-query';
import React, {type ReactNode, useCallback, useMemo, useState} from 'react';

export function ViewContextProvider({
    children,
    outlet,
}: {
    children: ReactNode;
    outlet: React.RefObject<HTMLDivElement | null>;
}) {
    const {data: ordering, refetch: refetchOrdering} = useSuspenseQuery({
        queryKey: [QueryKeys.ORDERING],
        queryFn: () => ChromeData.getOrdering(),
    });

    const [namePosition, setNamePosition] = useState<'left' | 'right'>('left');
    const [backButton, setBackButton] = useState(false);

    const changeOrdering = useCallback(
        (order: TypeOrdering) => {
            ChromeData.setOrdering(order).then(() => refetchOrdering());
        },
        [refetchOrdering]
    );

    const value = useMemo<ViewContextType>(
        () => ({
            ordering: ordering,
            setOrdering: changeOrdering,
            namePosition: namePosition,
            setNamePosition: setNamePosition,
            backButton: backButton,
            setBackButton: setBackButton,
            mainOutlet: outlet,
        }),
        [backButton, namePosition, ordering, outlet, changeOrdering]
    );

    return <ViewContext value={value}>{children}</ViewContext>;
}
