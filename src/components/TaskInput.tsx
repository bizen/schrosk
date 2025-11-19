"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TaskInputProps {
    onAddTask: (text: string) => void;
}

export function TaskInput({ onAddTask }: TaskInputProps) {
    const [text, setText] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onAddTask(text.trim());
            setText("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mb-12 relative group">
            {/* Animated Gradient Glow/Border */}
            <motion.div
                className="absolute -inset-[1px] rounded-sm opacity-50 blur-[2px] transition-opacity duration-500"
                style={{
                    background: "linear-gradient(90deg, #a855f7, #00f3ff, #a855f7, #00f3ff)",
                    backgroundSize: "300% 100%",
                    opacity: isFocused ? 1 : 0.4,
                    filter: isFocused ? "blur(6px)" : "blur(3px)",
                }}
                animate={{
                    backgroundPosition: ["0% 0%", "100% 0%"]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            {/* Input Container */}
            <div className="relative bg-black/95 backdrop-blur-xl rounded-sm">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Enter quantum state task..."
                    className={cn(
                        "w-full bg-transparent border-none rounded-sm px-6 py-4",
                        "text-foreground placeholder:text-white/20 font-mono text-lg",
                        "focus:outline-none focus:ring-0",
                        "transition-all duration-300"
                    )}
                />
            </div>
        </form>
    );
}
