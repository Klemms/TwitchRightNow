import {ContextMenuContext, ContextMenuContextType} from '@/entrypoints/popup/contexts/ContextMenuContext.ts';
import {AnimatePresence} from 'motion/react';
import {ReactNode, useCallback, useMemo, useState} from 'react';

export function ContextMenuContextProvider({children}: {children: ReactNode}) {
    const [contextMenu, setContextMenu] = useState<ReactNode | undefined>();

    const openContextMenu = useCallback((menu: ReactNode) => {
        setContextMenu(menu);
    }, []);

    const toggleContextMenu = useCallback((menu: ReactNode) => {
        setContextMenu((cur) => (cur ? undefined : menu));
    }, []);

    const closeContextMenu = useCallback(() => {
        setContextMenu(undefined);
    }, []);

    const value = useMemo<ContextMenuContextType>(
        () => ({
            isContextMenuOpen: contextMenu !== undefined,
            openContextMenu,
            closeContextMenu,
            toggleContextMenu,
        }),
        [closeContextMenu, contextMenu, openContextMenu, toggleContextMenu]
    );

    return (
        <ContextMenuContext value={value}>
            <div style={{position: 'absolute', top: 0, left: 0, zIndex: 20000}}>
                <AnimatePresence>{contextMenu ? contextMenu : null}</AnimatePresence>
            </div>
            {children}
        </ContextMenuContext>
    );
}
