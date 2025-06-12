import {ViewContext} from '@/entrypoints/popup/contexts/ViewContext.ts';
import {useContext, useLayoutEffect} from 'react';
import {useLocation} from 'react-router';

export function useResetScroll() {
    const location = useLocation();
    const {mainOutlet} = useContext(ViewContext);
    useLayoutEffect(() => {
        mainOutlet?.current?.scrollTo({top: 0, left: 0, behavior: 'instant'});
    }, [location.pathname, mainOutlet]);
}
