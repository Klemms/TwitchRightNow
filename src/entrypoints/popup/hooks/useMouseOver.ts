import React, {useEffect, useState} from 'react';

export function useMouseOver(ref: React.RefObject<HTMLDivElement | null>) {
    const [isHovered, setHovered] = useState(false);

    useEffect(() => {
        const onMouseEnter = () => setHovered(true);
        const onMouseLeave = () => setHovered(false);

        const current = ref.current;

        if (current) {
            current.addEventListener('mouseenter', onMouseEnter);
            current.addEventListener('mouseleave', onMouseLeave);
        }

        return () => {
            if (current) {
                current.removeEventListener('mouseenter', onMouseEnter);
                current.removeEventListener('mouseleave', onMouseLeave);
            }
        };
    }, [ref]);

    return isHovered;
}
