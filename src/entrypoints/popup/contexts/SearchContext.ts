import {createContext} from 'react';

type SearchContextType = {
    placeholder: string;
    setPlaceholder: (text: string) => void;
    value: string;
    setValue: (text: string) => void;
};

export const SearchContext = createContext<SearchContextType>({
    placeholder: '',
    setPlaceholder: () => {},
    value: '',
    setValue: () => {},
});
