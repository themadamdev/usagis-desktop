'use client'

import { useEffect, useRef, useState } from 'react';
import { useDraggableWidget } from '@/hooks/useDraggableWidget';
import { useIsCompact } from '@/hooks/useIsCompact';
import styles from './polaroidWidget.module.scss';

const PHOTO_STORAGE_KEY = 'usagi-polaroid-photo';
const CAPTION_STORAGE_KEY = 'usagi-polaroid-caption';
const DEFAULT_PHOTO_SRC = '/imgs/usagi-polaroid-photo.jpeg';
const DEFAULT_CAPTION = 'sailor moon 💫';
const DESKTOP_POSITION = { x: 140, y: 90 };
const COMPACT_POSITION = { x: 16, y: 560 };
const WIDGET_SIZE = { width: 170, height: 220 };

function PolaroidWidget() {
    const [photo, setPhoto] = useState<string>(DEFAULT_PHOTO_SRC);
    const [caption, setCaption] = useState(DEFAULT_CAPTION);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isCompact = useIsCompact();
    const { position, handlePointerDown, handlePointerMove, handlePointerUp } = useDraggableWidget(
        'usagi-polaroid-position',
        isCompact ? COMPACT_POSITION : DESKTOP_POSITION,
        WIDGET_SIZE
    );

    useEffect(() => {
        const storedPhoto = localStorage.getItem(PHOTO_STORAGE_KEY);
        const storedCaption = localStorage.getItem(CAPTION_STORAGE_KEY);
        if (storedPhoto) setPhoto(storedPhoto);
        if (storedCaption) setCaption(storedCaption);
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result as string;
            setPhoto(dataUrl);
            localStorage.setItem(PHOTO_STORAGE_KEY, dataUrl);
        };
        reader.readAsDataURL(file);
    };

    const handleCaptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCaption(event.target.value);
        localStorage.setItem(CAPTION_STORAGE_KEY, event.target.value);
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
                    style={{ backgroundImage: `url(${photo})` }}
                />
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
