'use client'

import { useEffect, useState } from 'react';

const COMPACT_BREAKPOINT = 700;

export function useIsCompact() {
    const [isCompact, setIsCompact] = useState(false);

    useEffect(() => {
        const update = () => setIsCompact(window.innerWidth < COMPACT_BREAKPOINT);
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    return isCompact;
}
