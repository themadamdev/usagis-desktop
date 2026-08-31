'use client'

import { useEffect, useRef, useState } from 'react';

type Position = { x: number; y: number };

export function useDraggableWidget(storageKey: string, defaultPosition: Position) {
    const [position, setPosition] = useState(defaultPosition);
    const dragState = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem(storageKey);
        if (stored) setPosition(JSON.parse(stored));
    }, [storageKey]);

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
