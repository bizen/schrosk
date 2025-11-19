"use client";

import { useEffect, useRef } from "react";

export function WaveFunction() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let t = 0;

        const render = () => {
            t += 0.01;
            const dpr = window.devicePixelRatio || 1;

            // Use logical (CSS) dimensions since context is scaled
            const width = canvas.width / dpr;
            const height = canvas.height / dpr;

            ctx.clearRect(0, 0, width, height);

            const centerY = height / 2;

            // Gaussian Wave Packet parameters
            const k = 0.1; // Wave number
            const omega = 0.2; // Angular frequency
            const sigma = width * 0.15; // Width of the packet
            const mu = width / 2; // Center of the packet

            ctx.beginPath();
            ctx.moveTo(0, centerY);

            for (let x = 0; x < width; x++) {
                // Gaussian Envelope
                const envelope = Math.exp(-Math.pow(x - mu, 2) / (2 * sigma * sigma));

                // Carrier Wave (moving)
                const carrier = Math.cos(k * (x - mu) - t * 2);

                // Resulting Wave Function (Real part)
                const y = centerY - (height * 0.4) * envelope * carrier;

                ctx.lineTo(x, y);
            }

            // Gradient stroke
            const gradient = ctx.createLinearGradient(0, 0, width, 0);
            gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
            gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.8)");
            gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw Envelope (Ghostly)
            ctx.beginPath();
            for (let x = 0; x < width; x++) {
                const envelope = Math.exp(-Math.pow(x - mu, 2) / (2 * sigma * sigma));
                const y = centerY - (height * 0.4) * envelope;
                ctx.lineTo(x, y);
            }
            ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
            ctx.lineWidth = 1;
            ctx.stroke();

            animationFrameId = requestAnimationFrame(render);
        };

        // Handle resize
        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                const dpr = window.devicePixelRatio || 1;
                const rect = parent.getBoundingClientRect();

                // Set the "actual" size of the canvas
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;

                // Scale the context to ensure correct drawing operations
                ctx.scale(dpr, dpr);

                // Set the "display" size of the canvas
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
        <div className="w-full h-full relative flex flex-col justify-end">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            <div className="relative z-10 text-[9px] font-mono text-white/30 mt-auto">
                Ψ(x,t)
            </div>
        </div>
    );
}
