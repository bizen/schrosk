"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Task } from "@/types";

interface TaskItemProps {
    task: Task;
    onCollapse: (id: string) => void;
    /**
     * Called when the user drags the probability slider.
     * Probability is a number between 0 and 1.
     */
    onProbabilityChange: (id: string, probability: number) => void;
}

export function TaskItem({ task, onCollapse, onProbabilityChange }: TaskItemProps) {
    const [isCollapsing, setIsCollapsing] = useState(false);
    const [feedbackText, setFeedbackText] = useState<string | null>(null);

    const handleCollapse = () => {
        if (isCollapsing) return;
        setIsCollapsing(true);

        // Determine feedback text
        const rand = Math.random();
        let text = "collapse!";
        if (rand > 0.99) text = "cat is alive 🐱";
        else if (rand > 0.90) text = "observed.";

        setFeedbackText(text);

        // Trigger parent removal after animation
        setTimeout(() => {
            onCollapse(task.id);
        }, 3500); // Wait 3.5 seconds so feedback text can be read
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{
                opacity: isCollapsing ? 0 : 1,
                filter: isCollapsing ? "blur(1px)" : "blur(0.5px)",
                scale: isCollapsing ? 0.95 : 1
            }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            transition={{ duration: 0.4, delay: isCollapsing ? 0.5 : 0 }}
            className="task-card flex items-center gap-6 p-4 group hover:bg-white/5 transition-colors duration-300"
        >
            {/* The Phi Button */}
            <button
                onClick={handleCollapse}
                className="relative w-8 h-8 flex items-center justify-center shrink-0 outline-none cursor-pointer"
                disabled={isCollapsing}
            >
                {/* Ring */}
                <motion.div
                    className="absolute inset-0 rounded-full border-2 border-neon-cyan/50"
                    animate={{
                        boxShadow: ["0 0 2px rgba(0, 243, 255, 0.2)", "0 0 8px rgba(0, 243, 255, 0.4)", "0 0 2px rgba(0, 243, 255, 0.2)"],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* The Strike Line (Phi) */}
                <AnimatePresence>
                    {isCollapsing && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, rotate: 0 }}
                            animate={{ height: "140%", opacity: 1, rotate: 0 }}
                            className="w-[2px] bg-white shadow-[0_0_10px_#fff,0_0_20px_#00f3ff] absolute"
                            transition={{ duration: 0.1, ease: "easeOut" }}
                        />
                    )}
                </AnimatePresence>

                {/* Feedback Text */}
                <AnimatePresence>
                    {feedbackText && (
                        <motion.span
                            initial={{ opacity: 0, y: 0, scale: 0.8, x: "-50%" }}
                            animate={{ opacity: 1, y: -40, scale: 1.1, x: "-50%" }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{
                                duration: 0.2,
                                opacity: { duration: 0.5, delay: 0.5 }
                            }}
                            className="absolute left-1/2 whitespace-nowrap text-magenta font-bold text-sm z-50 pointer-events-none text-glow-magenta"
                            style={{ filter: "blur(0px)" }}
                        >
                            {feedbackText}
                        </motion.span>
                    )}
                </AnimatePresence>
            </button>

            {/* Task Text */}
            <span className={cn(
                "font-mono text-lg text-foreground/80 transition-all duration-500 flex-grow",
                "animate-pulse", // Breathing effect
                isCollapsing && "text-electric-purple line-through opacity-50"
            )}
                style={{ animationDuration: '4s' }}
            >
                {task.text}
            </span>

            {/* Probability Slider Container */}
            <div className="flex flex-col items-end gap-1 min-w-[120px]">
                <span className="text-[9px] text-white/20 font-mono tracking-widest uppercase">
                    Superposition Status
                </span>
                <div className="flex items-center gap-2 w-full">
                    <span className="text-[10px] text-white/30 font-mono">0</span>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={Math.round(task.probability * 100)}
                        onChange={(e) => {
                            const prob = Number(e.target.value) / 100;
                            onProbabilityChange(task.id, prob);
                        }}
                        className="probability-slider w-full"
                        disabled={isCollapsing}
                    />
                    <span className="text-[10px] text-white/30 font-mono">1</span>
                </div>
            </div>
        </motion.div>
    );
}
