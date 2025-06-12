import React, {createContext} from 'react';

export type ViewContextType = {
    ordering: Ordering;
    setOrdering: (ordering: Ordering) => void;
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
