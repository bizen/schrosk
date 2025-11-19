import React from 'react';
import { Task } from '@/types';
import { WaveFunction } from './WaveFunction';
import { BlochSphere } from './BlochSphere';

/**
 * QuantumDashboard
 *
 * Displays a histogram of task probabilities and a wave function visualization.
 */
interface QuantumDashboardProps {
    /** List of tasks to analyse */
    tasks: Task[];
    /** Total number of collapsed tasks */
    collapseCount: number;
    /** Function to reset collapse count */
    onResetCollapseCount: () => void;
}

export const QuantumDashboard: React.FC<QuantumDashboardProps> = ({ tasks, collapseCount, onResetCollapseCount }) => {
    // Create 10 buckets for probabilities 0‑1
    const bucketCount = 10;
    const buckets = Array.from({ length: bucketCount }, () => 0);

    tasks.forEach((t) => {
        // Clamp probability between 0 and 1 just in case
        const p = Math.min(Math.max(t.probability ?? 0, 0), 1);
        const index = Math.min(bucketCount - 1, Math.floor(p * bucketCount));
        buckets[index] += 1;
    });

    const maxCount = Math.max(...buckets, 1);

    return (
        <div
            className="fixed bottom-0 left-0 w-full bg-black/90 backdrop-blur-md py-4 z-50 bg-grid-pattern shadow-[0_-40px_60px_rgba(0,0,0,0.9)]"
            style={{
                '--grid-opacity': '0.10'
            } as React.CSSProperties}
        >
            <div className="w-full max-w-[1400px] mx-auto px-8 grid grid-cols-1 md:grid-cols-3 items-center">
                {/* Left Side: Wave & Bloch */}
                <div className="hidden md:flex items-center gap-6 opacity-60 justify-end pr-8">
                    <div className="w-48 h-24">
                        <WaveFunction />
                    </div>
                    <div className="w-32 h-24">
                        <BlochSphere />
                    </div>
                </div>

                {/* Center: Probability Histogram */}
                <div className="w-full flex flex-col items-center justify-center">
                    <h2 className="text-xs font-bold font-mono text-center mb-3 text-white/30 tracking-[0.2em]">
                        QUANTUM PROBABILITY DASHBOARD
                    </h2>
                    <svg viewBox="0 0 100 35" className="w-full h-20 max-w-md">
                        {buckets.map((count, i) => {
                            const barHeight = (count / maxCount) * 20; // Max bar height reduced
                            const x = i * 9 + 1;
                            const y = 28 - barHeight; // Bottom alignment adjusted
                            const opacity = 0.3 + (count / maxCount) * 0.4; // More subtle opacity
                            return (
                                <g key={i}>
                                    <rect
                                        x={x}
                                        y={y}
                                        width="7"
                                        height={barHeight}
                                        fill="url(#gradient)"
                                        fillOpacity={opacity}
                                        rx="1"
                                    />
                                    <text
                                        x={x + 3.5}
                                        y={33}
                                        textAnchor="middle"
                                        fontSize="3.5"
                                        fill="rgba(255, 255, 255, 0.3)"
                                        style={{ fontFamily: 'var(--font-mono)' }}
                                    >
                                        {(i / bucketCount).toFixed(1)}
                                    </text>
                                </g>
                            );
                        })}
                        {/* Gradient definition */}
                        <defs>
                            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#00f3ff" />
                                <stop offset="100%" stopColor="#0055ff" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="text-center text-xs font-mono text-white/20 mt-1">
                        {tasks.length} task{tasks.length !== 1 ? 's' : ''} observed
                        <span className="mx-3 opacity-30">|</span>
                        {collapseCount} task{collapseCount !== 1 ? 's' : ''} collapsed
                    </div>
                </div>

                {/* Right Side: Collapse Counter */}
                <div className="hidden md:flex items-center justify-start pl-12">
                    <button
                        onClick={onResetCollapseCount}
                        className="text-3xl font-bold font-mono tracking-widest group transition-transform active:scale-90 focus:outline-none"
                        title="Reset Collapse Count"
                    >
                        <span className="text-white/30 group-hover:text-white/50 transition-colors">Ψ </span>
                        <span className={collapseCount === 0 ? "text-white/30" : "text-white/60 group-hover:text-white/80 transition-colors"}>
                            {collapseCount}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};
