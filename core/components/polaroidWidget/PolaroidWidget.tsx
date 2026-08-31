'use client'

import { useEffect, useRef, useState } from 'react';
import styles from './polaroidWidget.module.scss';

const PHOTO_KEY = '@/imgs/usagi-polaroid-photo.png';
const CAPTION_KEY = 'usagi-polaroid-caption';
const POSITION_KEY = 'usagi-polaroid-position';
const DEFAULT_CAPTION = 'sailor moon 💫';
const DEFAULT_POSITION = { x: 140, y: 90 };

function PolaroidWidget() {
    const [photo, setPhoto] = useState<string | null>(null);
    const [caption, setCaption] = useState(DEFAULT_CAPTION);
    const [position, setPosition] = useState(DEFAULT_POSITION);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dragState = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);

    useEffect(() => {
        const storedPhoto = localStorage.getItem(PHOTO_KEY);
        const storedCaption = localStorage.getItem(CAPTION_KEY);
        const storedPosition = localStorage.getItem(POSITION_KEY);
        if (storedPhoto) setPhoto(storedPhoto);
        if (storedCaption) setCaption(storedCaption);
        if (storedPosition) setPosition(JSON.parse(storedPosition));
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result as string;
            setPhoto(dataUrl);
            localStorage.setItem(PHOTO_KEY, dataUrl);
        };
        reader.readAsDataURL(file);
    };

    const handleCaptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCaption(event.target.value);
        localStorage.setItem(CAPTION_KEY, event.target.value);
    };

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
        const next = {
            x: originX + (event.clientX - startX),
            y: originY + (event.clientY - startY),
        };
        setPosition(next);
    };

    const handlePointerUp = () => {
        if (!dragState.current) return;
        dragState.current = null;
        localStorage.setItem(POSITION_KEY, JSON.stringify(position));
    };

    return (
        <div
            className={styles.widget}
            style={{ left: position.x, top: position.y }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            <div className={styles.card}>
                <span className={styles.tape} />
                <button
                    type="button"
                    className={styles.photo}
                    onClick={() => fileInputRef.current?.click()}
                    onPointerDown={(event) => event.stopPropagation()}
                    style={photo ? { backgroundImage: `url(${photo})` } : undefined}
                >
                    {!photo && (
                        <span className={styles.placeholder}>
                            <svg viewBox="0 0 32 32" width="28" height="28">
                                <rect x="4" y="9" width="24" height="17" rx="2" fill="none" stroke="#c98fb0" strokeWidth="1.5" />
                                <circle cx="16" cy="18" r="5" fill="none" stroke="#c98fb0" strokeWidth="1.5" />
                                <rect x="11" y="6" width="10" height="4" rx="1" fill="#c98fb0" />
                            </svg>
                            <span>add a photo</span>
                        </span>
                    )}
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={handleFileChange}
                />
                <input
                    className={styles.caption}
                    value={caption}
                    onChange={handleCaptionChange}
                    onPointerDown={(event) => event.stopPropagation()}
                    maxLength={40}
                />
            </div>
        </div>
    );
}

export default PolaroidWidget;
