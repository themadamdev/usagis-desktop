'use client'

import { useEffect, useRef, useState } from 'react';

type Position = { x: number; y: number };
type Size = { width: number; height: number };

// Only X is bounded to the viewport — the page is allowed to grow taller
// than one screen (and scroll) on compact layouts, so Y should never be
// clamped to window height or it fights the stacked compact positions.
function clampToViewport(pos: Position, size: Size): Position {
    if (typeof window === 'undefined') return pos;
    const margin = 12;
    const maxX = Math.max(margin, window.innerWidth - size.width - margin);
    return {
        x: Math.min(Math.max(pos.x, margin), maxX),
        y: Math.max(pos.y, margin),
    };
}

export function useDraggableWidget(
    storageKey: string,
    defaultPosition: Position,
    size: Size = { width: 200, height: 160 }
) {
    const [position, setPosition] = useState(defaultPosition);
    const dragState = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem(storageKey);
        const base = stored ? JSON.parse(stored) : defaultPosition;
        setPosition(clampToViewport(base, size));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storageKey, defaultPosition.x, defaultPosition.y]);

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        dragState.current = {
            startX: event.clientX,
            startY: event.clientY,
            originX: position.x,
            originY: position.y,
        };
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!dragState.current) return;
        const { startX, startY, originX, originY } = dragState.current;
        setPosition({
            x: originX + (event.clientX - startX),
            y: originY + (event.clientY - startY),
        });
    };

    const handlePointerUp = () => {
        if (!dragState.current) return;
        dragState.current = null;
        setPosition((current) => {
            localStorage.setItem(storageKey, JSON.stringify(current));
            return current;
        });
    };

    return { position, handlePointerDown, handlePointerMove, handlePointerUp };
}
