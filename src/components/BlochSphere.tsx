"use client";

import { useEffect, useRef } from "react";

export function BlochSphere() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let theta = 0; // Rotation angle

        const render = () => {
            theta += 0.002;
            const dpr = window.devicePixelRatio || 1;

            // Use logical (CSS) dimensions
            const width = canvas.width / dpr;
            const height = canvas.height / dpr;

            ctx.clearRect(0, 0, width, height);

            const cx = width / 2;
            const cy = height / 2;
            const r = Math.min(width, height) * 0.45; // Radius

            // 3D Projection Helper
            const project = (x: number, y: number, z: number) => {
                // Rotate around Y axis
                const x1 = x * Math.cos(theta) - z * Math.sin(theta);
                const z1 = x * Math.sin(theta) + z * Math.cos(theta);

                // Simple perspective (optional, but orthographic is cleaner for icons)
                return { x: cx + x1, y: cy + y };
            };

            ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
            ctx.lineWidth = 1;

            // Draw Sphere (Latitudes)
            for (let lat = -80; lat <= 80; lat += 20) {
                ctx.beginPath();
                const latRad = (lat * Math.PI) / 180;
                const rLat = r * Math.cos(latRad);
                const yLat = r * Math.sin(latRad);

                for (let lon = 0; lon <= 360; lon += 10) {
                    const lonRad = (lon * Math.PI) / 180;
                    const x = rLat * Math.cos(lonRad);
                    const z = rLat * Math.sin(lonRad);
                    const p = project(x, yLat, z);
                    if (lon === 0) ctx.moveTo(p.x, p.y);
                    else ctx.lineTo(p.x, p.y);
                }
                ctx.stroke();
            }

            // Draw Sphere (Longitudes)
            for (let lon = 0; lon < 360; lon += 45) {
                ctx.beginPath();
                const lonRad = (lon * Math.PI) / 180;

                for (let lat = -90; lat <= 90; lat += 5) {
                    const latRad = (lat * Math.PI) / 180;
                    const rLat = r * Math.cos(latRad);
                    const y = r * Math.sin(latRad);
                    const x = rLat * Math.cos(lonRad);
                    const z = rLat * Math.sin(lonRad);
                    const p = project(x, y, z);
                    if (lat === -90) ctx.moveTo(p.x, p.y);
                    else ctx.lineTo(p.x, p.y);
                }
                ctx.stroke();
            }

            // Draw State Vector (Arrow)
            // Pointing to a random state, e.g., |+> state (x-axis)
            // Let's make it precess around Z axis
            const psiTheta = Math.PI / 4; // 45 degrees down from Z
            const psiPhi = theta * 2; // Rotating faster

            const vx = r * Math.sin(psiTheta) * Math.cos(psiPhi);
            const vy = -r * Math.cos(psiTheta); // Invert Y for canvas coords
            const vz = r * Math.sin(psiTheta) * Math.sin(psiPhi);

            const pOrigin = project(0, 0, 0);
            const pTip = project(vx, vy, vz);

            ctx.beginPath();
            ctx.moveTo(pOrigin.x, pOrigin.y);
            ctx.lineTo(pTip.x, pTip.y);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw Tip Dot
            ctx.beginPath();
            ctx.arc(pTip.x, pTip.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = "#fff";
            ctx.fill();

            animationFrameId = requestAnimationFrame(render);
        };

        // Handle resize
        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                const dpr = window.devicePixelRatio || 1;
                const rect = parent.getBoundingClientRect();

                // Set actual canvas size
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;

                // Scale context
                ctx.scale(dpr, dpr);

                // Set display size
                canvas.style.width = `${rect.width}px`;
                canvas.style.height = `${rect.height}px`;
            }
        };

        window.addEventListener('resize', resize);
        resize();
        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <div className="w-full h-full relative flex flex-col justify-end items-center">
            <canvas ref={canvasRef} className="absolute inset-0" />
            <div className="relative z-10 text-[9px] font-mono text-white/30 mt-auto">
                |ψ⟩
            </div>
        </div>
    );
}
