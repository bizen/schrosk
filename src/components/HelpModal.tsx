import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-black/95 border border-white/10 p-8 rounded-sm shadow-[0_0_50px_rgba(0,243,255,0.1)] z-[101]"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-2xl font-bold font-mono mb-8 text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-electric-purple tracking-tighter">
                            QUANTUM MANUAL
                        </h2>

                        <div className="space-y-8 font-mono text-sm text-white/70">
                            <div className="relative pl-6 border-l border-neon-cyan/30">
                                <h3 className="text-neon-cyan mb-2 font-bold tracking-widest text-xs">01. SUPERPOSITION</h3>
                                <p className="leading-relaxed">
                                    Tasks exist in a state of flux. Enter a task to create a new quantum state. It is not fully real until observed.
                                </p>
                            </div>

                            <div className="relative pl-6 border-l border-electric-purple/30">
                                <h3 className="text-electric-purple mb-2 font-bold tracking-widest text-xs">02. PROBABILITY</h3>
                                <p className="leading-relaxed">
                                    Adjust the slider <span className="text-white/50">[0-1]</span> to set the likelihood of task completion. Higher probability increases the wave function density.
                                </p>
                            </div>

                            <div className="relative pl-6 border-l border-magenta/30">
                                <h3 className="text-magenta mb-2 font-bold tracking-widest text-xs">03. COLLAPSE</h3>
                                <p className="leading-relaxed">
                                    Click the <span className="text-white border border-white/20 px-1.5 py-0.5 rounded text-xs mx-1">Φ</span> button to collapse the wave function. The task will be observed and removed from your reality.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5 text-center">
                            <p className="text-xs text-white/20 uppercase tracking-[0.2em]">
                                Schrösk v1.0.0
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
