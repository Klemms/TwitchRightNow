import {ChangeEventHandler} from 'react';

interface CheckboxProps {
    checked: boolean;
    name?: string;
    onToggle: ChangeEventHandler<HTMLInputElement>;
}

export function Checkbox({checked, name, onToggle}: CheckboxProps) {
    return <input type={'checkbox'} onChange={onToggle} name={name} checked={checked} />;
}
