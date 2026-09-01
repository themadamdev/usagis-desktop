'use client'

import { useEffect, useState } from 'react';
import NavTaskbar from '@/components/navTaskbar/NavTaskbar';
import DesktopIcons from '@/components/desktopIcons/DesktopIcons';
import PolaroidWidget from '@/components/polaroidWidget/PolaroidWidget';
import MusicPlayerWidget from '@/components/musicPlayerWidget/MusicPlayerWidget';
import CloudWidget from '@/components/cloudWidget/CloudWidget';
import { useIsCompact } from '@/hooks/useIsCompact';
import styles from '@/styles/home.module.scss';
import '@react95/core/GlobalStyle';
import '@/styles/r95-moonlightRetrowave.css';

const CLOUD_VISIBLE_KEY = 'usagi-cloud-widget-visible';
// cloud.exe is the last widget in the compact stack (top: 992, height ~217);
// this spacer reserves room below it so the fixed taskbar doesn't cover it.
const COMPACT_STACK_BOTTOM = 1280;

export default function HomePage() {
    const [cloudVisible, setCloudVisible] = useState(true);
    const isCompact = useIsCompact();

    useEffect(() => {
        const stored = localStorage.getItem(CLOUD_VISIBLE_KEY);
        if (stored !== null) setCloudVisible(stored === 'true');
    }, []);

    const toggleCloud = () => {
        setCloudVisible((visible) => {
            const next = !visible;
            localStorage.setItem(CLOUD_VISIBLE_KEY, String(next));
            return next;
        });
    };

    return (
        <>
            <div className={styles.gridOverlay}>
                <div className={styles.moon} />
            </div>
            <div className={styles.contentLayer}>
                <DesktopIcons cloudVisible={cloudVisible} onToggleCloud={toggleCloud} />
                <PolaroidWidget />
                <MusicPlayerWidget />
                <CloudWidget visible={cloudVisible} />
                {isCompact && <div style={{ position: 'absolute', top: COMPACT_STACK_BOTTOM, height: 1, width: 1 }} />}
                <NavTaskbar />
            </div>
        </>
    )
}
