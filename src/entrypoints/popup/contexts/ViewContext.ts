import {TypeOrdering} from '@/types/SchemaOrdering.ts';
import React, {createContext} from 'react';

export type ViewContextType = {
    ordering: TypeOrdering;
    setOrdering: (ordering: TypeOrdering) => void;
    namePosition: 'left' | 'right';
    setNamePosition: (position: 'left' | 'right') => void;
    backButton: boolean;
    setBackButton: (enable: boolean) => void;
    mainOutlet: React.RefObject<HTMLDivElement | null> | null;
};

export const ViewContext = createContext<ViewContextType>({
    ordering: 'DESCENDANT',
    setOrdering: () => {},
    namePosition: 'left',
    setNamePosition: () => {},
    backButton: false,
    setBackButton: () => {},
    mainOutlet: null,
});
