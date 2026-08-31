'use client'

import { useState } from 'react';
import { Modal, TitleBar } from '@react95/core';
import styles from './desktopIcons.module.scss';

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

function DesktopIcons() {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [openId, setOpenId] = useState<string | null>(null);

    const openScout = scouts.find((scout) => scout.id === openId);

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

            {openScout && (
                <Modal
                    icon={<ScoutGlyph glyph={openScout.glyph} accent={openScout.accent} />}
                    title={openScout.name}
                    titleBarOptions={[<TitleBar.Close key="close" onClick={() => setOpenId(null)} />]}
                    dragOptions={{ defaultPosition: { x: 160, y: 140 } }}
                    width="260px"
                >
                    <div className={styles.modalContent}>
                        <ScoutGlyph glyph={openScout.glyph} accent={openScout.accent} />
                        <p>{openScout.catchphrase}</p>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default DesktopIcons;
