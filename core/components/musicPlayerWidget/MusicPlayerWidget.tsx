'use client'

import { useEffect, useRef, useState } from 'react';
import { useDraggableWidget } from '@/hooks/useDraggableWidget';
import styles from './musicPlayerWidget.module.scss';

const DEFAULT_POSITION = { x: 340, y: 90 };
const DEFAULT_TITLE = 'Moonlight Densetsu';
const DEFAULT_SUBTITLE = 'tap 🎵 to add your own song';

function MusicPlayerWidget() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [trackName, setTrackName] = useState<string | null>(null);
    const [trackUrl, setTrackUrl] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { position, handlePointerDown, handlePointerMove, handlePointerUp } = useDraggableWidget(
        'usagi-music-player-position',
        DEFAULT_POSITION
    );

    useEffect(() => {
        return () => {
            if (trackUrl) URL.revokeObjectURL(trackUrl);
        };
    }, [trackUrl]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (trackUrl) URL.revokeObjectURL(trackUrl);
        setTrackUrl(URL.createObjectURL(file));
        setTrackName(file.name.replace(/\.[^/.]+$/, ''));
        setIsPlaying(false);
    };

    const togglePlay = () => {
        if (!trackUrl || !audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying((playing) => !playing);
    };

    return (
        <div
            className={styles.widget}
            style={{ left: position.x, top: position.y }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            <div className={styles.panel}>
                <div className={styles.titleBar}>
                    <svg viewBox="0 0 32 32" width="14" height="14">
                        <circle cx="16" cy="16" r="15" fill="#2a1a4a" stroke="#fff6fb" strokeWidth="1" />
                        <defs>
                            <mask id="player-title-crescent-mask">
                                <rect width="32" height="32" fill="white" />
                                <circle cx="20" cy="13" r="9" fill="black" />
                            </mask>
                        </defs>
                        <circle cx="15" cy="16" r="9" fill="#ffd23f" mask="url(#player-title-crescent-mask)" />
                    </svg>
                    <span className={styles.titleText}>Now Playing</span>
                </div>
                <div className={styles.content}>
                    <div className={styles.body}>
                        <div className={`${styles.disc} ${isPlaying ? styles.spinning : ''}`}>
                            <svg viewBox="0 0 32 32" width="44" height="44">
                                <circle cx="16" cy="16" r="15" fill="#2a1a4a" stroke="#fff6fb" strokeWidth="1" />
                                <defs>
                                    <mask id="player-crescent-mask">
                                        <rect width="32" height="32" fill="white" />
                                        <circle cx="20" cy="13" r="9" fill="black" />
                                    </mask>
                                </defs>
                                <circle cx="15" cy="16" r="9" fill="#ffd23f" mask="url(#player-crescent-mask)" />
                                <circle cx="16" cy="16" r="2.4" fill="#2a1a4a" />
                            </svg>
                        </div>
                        <div className={styles.info}>
                            <p className={styles.track}>{trackName ?? DEFAULT_TITLE}</p>
                            <p className={styles.subtitle}>{trackName ? 'your playlist' : DEFAULT_SUBTITLE}</p>
                            <div className={`${styles.equalizer} ${isPlaying ? styles.active : ''}`}>
                                <span />
                                <span />
                                <span />
                                <span />
                            </div>
                        </div>
                    </div>
                    <div className={styles.controls} onPointerDown={(event) => event.stopPropagation()}>
                        <button type="button" className={styles.winButton} onClick={togglePlay} disabled={!trackUrl}>
                            {isPlaying ? (
                                <svg viewBox="0 0 16 16" width="12" height="12">
                                    <rect x="3" y="2" width="3.5" height="12" fill="currentColor" />
                                    <rect x="9.5" y="2" width="3.5" height="12" fill="currentColor" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 16 16" width="12" height="12">
                                    <path d="M4 2.5v11l10-5.5z" fill="currentColor" />
                                </svg>
                            )}
                        </button>
                        <button
                            type="button"
                            className={`${styles.winButton} ${styles.addButton}`}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            add song 🎵
                        </button>
                    </div>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    className={styles.fileInput}
                    onChange={handleFileChange}
                />
                {trackUrl && <audio ref={audioRef} src={trackUrl} onEnded={() => setIsPlaying(false)} />}
            </div>
        </div>
    );
}

export default MusicPlayerWidget;
