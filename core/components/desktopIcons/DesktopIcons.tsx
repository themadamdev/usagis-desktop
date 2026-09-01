'use client'

import { useEffect, useRef, useState } from 'react';
import { Modal, TitleBar } from '@react95/core';
import styles from './desktopIcons.module.scss';

const ALBUM_STORAGE_KEY = 'usagi-photo-album';
const DEFAULT_ALBUM: string[] = ['/imgs/usagi-polaroid-photo.jpeg'];

type ScoutIcon = {
    id: string;
    name: string;
    catchphrase: string;
    accent: string;
    glyph: 'moon' | 'heart';
};

const scouts: ScoutIcon[] = [
    {
        id: 'sailor-moon',
        name: 'Sailor Moon',
        catchphrase: 'Moon Prism Power, Make Up!',
        accent: '#ffd23f',
        glyph: 'moon',
    },
    {
        id: 'sailor-venus',
        name: 'Sailor Venus',
        catchphrase: 'Venus Power, Make Up!',
        accent: '#ff6ec7',
        glyph: 'heart',
    },
];

function ScoutGlyph({ glyph, accent }: { glyph: ScoutIcon['glyph']; accent: string }) {
    if (glyph === 'moon') {
        return (
            <svg viewBox="0 0 32 32" width="36" height="36">
                <circle cx="16" cy="16" r="15" fill="#2a1a4a" stroke="#fff6fb" strokeWidth="1" />
                <defs>
                    <mask id="crescent-mask">
                        <rect width="32" height="32" fill="white" />
                        <circle cx="20" cy="13" r="9" fill="black" />
                    </mask>
                </defs>
                <circle cx="15" cy="16" r="9" fill={accent} mask="url(#crescent-mask)" />
                <circle cx="23" cy="23" r="1.4" fill="#fff6fb" />
            </svg>
        );
    }
    return (
        <svg viewBox="0 0 32 32" width="36" height="36">
            <circle cx="16" cy="16" r="15" fill="#2a1a4a" stroke="#fff6fb" strokeWidth="1" />
            <path
                d="M16 24.5s-8-5.1-8-10.7C8 10.4 10.4 8 13.4 8c1.6 0 3 .8 2.6 1.6C16.6 8.8 18 8 19.6 8 22.6 8 25 10.4 25 13.8c0 5.6-9 10.7-9 10.7z"
                fill={accent}
                stroke="#fff6fb"
                strokeWidth="0.75"
            />
        </svg>
    );
}

function FolderGlyph() {
    return (
        <svg viewBox="0 0 32 32" width="36" height="36">
            <path d="M4 10a2 2 0 0 1 2-2h6l2.5 2.5H26a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" fill="#ffb0e0" stroke="#fff6fb" strokeWidth="1" />
            <path d="M4 12h24v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" fill="#ff8fd4" stroke="#fff6fb" strokeWidth="1" />
            <path d="M16 17.5l1.1 2.3 2.5.3-1.8 1.7.5 2.5-2.3-1.2-2.3 1.2.5-2.5-1.8-1.7 2.5-.3z" fill="#ffd23f" />
        </svg>
    );
}

function CloudGlyph() {
    return (
        <svg viewBox="0 0 36 36" width="36" height="36">
            <g fill="#ffe3f5">
                <circle cx="12" cy="21" r="7" />
                <circle cx="21" cy="14" r="9" />
                <circle cx="29" cy="20" r="6.5" />
                <rect x="10" y="18" width="22" height="10" rx="5" />
            </g>
            <path d="M6 8l1.3 3.7L11 13l-3.7 1.3L6 18l-1.3-3.7L1 13l3.7-1.3z" fill="#ffd23f" />
        </svg>
    );
}

type DesktopIconsProps = {
    cloudVisible: boolean;
    onToggleCloud: () => void;
};

function DesktopIcons({ cloudVisible, onToggleCloud }: DesktopIconsProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [openId, setOpenId] = useState<string | null>(null);
    const [albumOpen, setAlbumOpen] = useState(false);
    const [album, setAlbum] = useState<string[]>(DEFAULT_ALBUM);
    const albumFileInputRef = useRef<HTMLInputElement>(null);

    const openScout = scouts.find((scout) => scout.id === openId);

    useEffect(() => {
        const stored = localStorage.getItem(ALBUM_STORAGE_KEY);
        if (stored) setAlbum(JSON.parse(stored));
    }, []);

    const persistAlbum = (photos: string[]) => {
        setAlbum(photos);
        localStorage.setItem(ALBUM_STORAGE_KEY, JSON.stringify(photos));
    };

    const handleAddAlbumPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => persistAlbum([...album, reader.result as string]);
        reader.readAsDataURL(file);
        event.target.value = '';
    };

    const handleRemoveAlbumPhoto = (index: number) => {
        persistAlbum(album.filter((_, i) => i !== index));
    };

    return (
        <div className={styles.iconLayer}>
            {scouts.map((scout) => (
                <button
                    key={scout.id}
                    type="button"
                    className={`${styles.icon} ${selectedId === scout.id ? styles.selected : ''}`}
                    onClick={() => setSelectedId(scout.id)}
                    onDoubleClick={() => setOpenId(scout.id)}
                >
                    <ScoutGlyph glyph={scout.glyph} accent={scout.accent} />
                    <span className={styles.label}>{scout.name}</span>
                </button>
            ))}

            <button
                type="button"
                className={`${styles.icon} ${selectedId === 'photo-album' ? styles.selected : ''}`}
                onClick={() => setSelectedId('photo-album')}
                onDoubleClick={() => setAlbumOpen(true)}
            >
                <FolderGlyph />
                <span className={styles.label}>Photo Album</span>
            </button>

            <button
                type="button"
                className={`${styles.icon} ${selectedId === 'cloud-exe' ? styles.selected : ''} ${cloudVisible ? styles.running : ''}`}
                onClick={() => setSelectedId('cloud-exe')}
                onDoubleClick={onToggleCloud}
            >
                <CloudGlyph />
                <span className={styles.label}>cloud.exe</span>
            </button>

            {openScout && (
                <Modal
                    icon={<ScoutGlyph glyph={openScout.glyph} accent={openScout.accent} />}
                    title={openScout.name}
                    titleBarOptions={[<TitleBar.Close key="close" onClick={() => setOpenId(null)} />]}
                    dragOptions={{ defaultPosition: { x: 160, y: 340 } }}
                    width="260px"
                >
                    <div className={styles.modalContent}>
                        <ScoutGlyph glyph={openScout.glyph} accent={openScout.accent} />
                        <p>{openScout.catchphrase}</p>
                    </div>
                </Modal>
            )}

            {albumOpen && (
                <Modal
                    icon={<FolderGlyph />}
                    title="Photo Album"
                    titleBarOptions={[<TitleBar.Close key="close" onClick={() => setAlbumOpen(false)} />]}
                    dragOptions={{ defaultPosition: { x: 380, y: 240 } }}
                    width="280px"
                >
                    <div className={styles.albumGrid}>
                        {album.map((photo, index) => (
                            <div key={photo.slice(0, 32) + index} className={styles.albumThumb}>
                                <img src={photo} alt="" />
                                <button
                                    type="button"
                                    className={styles.albumRemove}
                                    onClick={() => handleRemoveAlbumPhoto(index)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            className={styles.albumAdd}
                            onClick={() => albumFileInputRef.current?.click()}
                        >
                            +
                        </button>
                    </div>
                    <input
                        ref={albumFileInputRef}
                        type="file"
                        accept="image/*"
                        className={styles.fileInput}
                        onChange={handleAddAlbumPhoto}
                    />
                </Modal>
            )}
        </div>
    );
}

export default DesktopIcons;
