'use client'

import { useDraggableWidget } from '@/hooks/useDraggableWidget';
import styles from './cloudWidget.module.scss';

const DEFAULT_POSITION = { x: 600, y: 130 };

const CELL = 5;

type PixelRect = { x: number; y: number; fill: string };
type PixelSprite = { rects: PixelRect[]; width: number; height: number };

function buildPixelSprite(
    cols: number,
    rows: number,
    cell: number,
    isFilled: (col: number, row: number) => boolean,
    shade: (col: number, row: number) => string,
    outlineColor: string
): PixelSprite {
    const rects: PixelRect[] = [];
    for (let row = -1; row <= rows; row++) {
        for (let col = -1; col <= cols; col++) {
            const filled = isFilled(col, row);
            const neighborFilled =
                !filled &&
                (isFilled(col - 1, row) || isFilled(col + 1, row) || isFilled(col, row - 1) || isFilled(col, row + 1));
            if (!filled && !neighborFilled) continue;
            rects.push({
                x: (col + 1) * cell,
                y: (row + 1) * cell,
                fill: filled ? shade(col, row) : outlineColor,
            });
        }
    }
    return { rects, width: (cols + 2) * cell, height: (rows + 2) * cell };
}

function PixelSpriteSvg({ sprite, cell, x, y }: { sprite: PixelSprite; cell: number; x?: number; y?: number }) {
    return (
        <svg x={x} y={y} width={sprite.width} height={sprite.height} viewBox={`0 0 ${sprite.width} ${sprite.height}`} shapeRendering="crispEdges">
            {sprite.rects.map((r, i) => (
                <rect key={i} x={r.x} y={r.y} width={cell} height={cell} fill={r.fill} />
            ))}
        </svg>
    );
}

// 2x2 ordered (Bayer) dither matrix, used to blend between adjacent ramp
// colors at band boundaries so shading reads as a gradient, not hard bands.
const BAYER_2X2 = [
    [0, 2],
    [3, 1],
];

function ditherShade(ramp: string[], t: number, col: number, row: number): string {
    const scaled = Math.max(0, Math.min(1, t)) * (ramp.length - 1);
    const index = Math.floor(scaled);
    const frac = scaled - index;
    const colorA = ramp[Math.min(index, ramp.length - 1)];
    const colorB = ramp[Math.min(index + 1, ramp.length - 1)];
    if (colorA === colorB) return colorA;
    const threshold = (BAYER_2X2[row & 1][col & 1] + 0.5) / 4;
    return frac > threshold ? colorB : colorA;
}

const CLOUD_COLS = 40;
const CLOUD_ROWS = 18;
const CLOUD_PUFFS = [
    { cx: 11, cy: 14, r: 6.8 },
    { cx: 21, cy: 10, r: 9.6 },
    { cx: 31, cy: 14, r: 6.4 },
];
const CLOUD_BASE = { x1: 5, x2: 35, y1: 12, y2: 18.6 };

function isCloudCell(col: number, row: number): boolean {
    const x = col + 0.5;
    const y = row + 0.5;
    if (x >= CLOUD_BASE.x1 && x <= CLOUD_BASE.x2 && y >= CLOUD_BASE.y1 && y <= CLOUD_BASE.y2) return true;
    return CLOUD_PUFFS.some((p) => (x - p.cx) ** 2 + (y - p.cy) ** 2 <= p.r * p.r);
}

// Highlight -> pink -> hue-shifted into purple for the deepest shadow, a
// classic hand-pixel-art trick (shadows lean toward a cooler hue, not just
// a darker version of the base color).
const CLOUD_RAMP = ['#ffffff', '#ffe3f5', '#ffb0e0', '#e888c9', '#b565c9', '#7a4aa8'];

function shadeCloud(col: number, row: number): string {
    return ditherShade(CLOUD_RAMP, row / CLOUD_ROWS, col, row);
}

const CLOUD_SPRITE = buildPixelSprite(CLOUD_COLS, CLOUD_ROWS, CELL, isCloudCell, shadeCloud, '#1c1235');

const MOON_COLS = 10;
const MOON_ROWS = 10;
const MOON_MAIN = { cx: 5, cy: 5, r: 4.6 };
const MOON_BITE = { cx: 7.2, cy: 3.4, r: 3.9 };

function isMoonCell(col: number, row: number): boolean {
    const x = col + 0.5;
    const y = row + 0.5;
    const inMain = (x - MOON_MAIN.cx) ** 2 + (y - MOON_MAIN.cy) ** 2 <= MOON_MAIN.r ** 2;
    const inBite = (x - MOON_BITE.cx) ** 2 + (y - MOON_BITE.cy) ** 2 <= MOON_BITE.r ** 2;
    return inMain && !inBite;
}

const MOON_RAMP = ['#fff6c4', '#ffd23f', '#e0932e'];

function shadeMoon(col: number, row: number): string {
    return ditherShade(MOON_RAMP, row / MOON_ROWS, col, row);
}

const MOON_SPRITE = buildPixelSprite(MOON_COLS, MOON_ROWS, CELL, isMoonCell, shadeMoon, '#1c1235');

const SPARKLE_COLS = 5;
const SPARKLE_ROWS = 5;
const SPARKLE_FILLED = new Set(['2,0', '1,1', '2,1', '3,1', '0,2', '1,2', '2,2', '3,2', '4,2', '1,3', '2,3', '3,3', '2,4']);

function isSparkleCell(col: number, row: number): boolean {
    return SPARKLE_FILLED.has(`${col},${row}`);
}

function buildSparkleSprite(ramp: string[]): PixelSprite {
    const shade = (col: number, row: number) => ditherShade(ramp, row / SPARKLE_ROWS, col, row);
    return buildPixelSprite(SPARKLE_COLS, SPARKLE_ROWS, CELL, isSparkleCell, shade, ramp[ramp.length - 1]);
}

const SPARKLE_CYAN = buildSparkleSprite(['#d6faff', '#0bc6d9', '#0a7f94']);
const SPARKLE_PINK = buildSparkleSprite(['#ffe0f6', '#ff6ec7', '#a83f9e']);

function CloudWidget({ visible }: { visible: boolean }) {
    const { position, handlePointerDown, handlePointerMove, handlePointerUp } = useDraggableWidget(
        'usagi-cloud-widget-position',
        DEFAULT_POSITION
    );

    if (!visible) return null;

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
                    <span className={styles.titleIcon}>☁</span>
                    <span className={styles.titleText}>cloud.exe</span>
                </div>
                <div className={styles.content}>
                    <div className={styles.viewport}>
                        <div className={styles.cloudPeek}>
                            <svg
                                viewBox={`0 0 ${CLOUD_SPRITE.width} ${CLOUD_SPRITE.height}`}
                                width={CLOUD_SPRITE.width}
                                height={CLOUD_SPRITE.height}
                                shapeRendering="crispEdges"
                            >
                                {CLOUD_SPRITE.rects.map((r, i) => (
                                    <rect key={i} x={r.x} y={r.y} width={CELL} height={CELL} fill={r.fill} />
                                ))}
                                <PixelSpriteSvg sprite={MOON_SPRITE} cell={CELL} x={CLOUD_SPRITE.width - MOON_SPRITE.width - 6} y={2} />
                                <PixelSpriteSvg sprite={SPARKLE_CYAN} cell={CELL} x={4} y={4} />
                                <PixelSpriteSvg sprite={SPARKLE_PINK} cell={CELL} x={CLOUD_SPRITE.width - SPARKLE_PINK.width - 8} y={CLOUD_SPRITE.height - SPARKLE_PINK.height - 14} />
                            </svg>
                        </div>
                    </div>
                    <p className={styles.caption}>status: drifting through the Moon Kingdom ✨</p>
                </div>
            </div>
        </div>
    );
}

export default CloudWidget;
