import {SearchContext} from '@/entrypoints/popup/contexts/SearchContext.ts';
import {ReactNode, useMemo, useState} from 'react';

type SearchContextProviderType = {
    children?: ReactNode;
};

export const SearchContextProvider = function SearchContextProvider({children}: SearchContextProviderType) {
    const [placeholder, setPlaceholder] = useState('');
    const [val, setValue] = useState('');

    const value = useMemo(
        () => ({
            placeholder: placeholder,
            setPlaceholder: setPlaceholder,
            value: val,
            setValue: setValue,
        }),
        [placeholder, val]
    );

    return <SearchContext value={value}>{children}</SearchContext>;
};
