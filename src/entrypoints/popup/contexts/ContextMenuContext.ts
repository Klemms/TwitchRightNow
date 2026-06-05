import {createContext, ReactElement} from 'react';

export type ContextMenuContextType = {
    isContextMenuOpen: boolean;
    openContextMenu: (menu: ReactElement) => void;
    closeContextMenu: () => void;
    toggleContextMenu: (menu: ReactElement) => void;
};

export const ContextMenuContext = createContext<ContextMenuContextType>({
    isContextMenuOpen: false,
    openContextMenu: () => {},
    closeContextMenu: () => {},
    toggleContextMenu: () => {},
});
