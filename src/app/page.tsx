"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { TaskInput } from "@/components/TaskInput";
import { TaskItem } from "@/components/TaskItem";
import { Task } from "@/types";
import { QuantumDashboard } from "@/components/QuantumDashboard";
import { HelpModal } from "@/components/HelpModal";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [collapseCount, setCollapseCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem("schrosk-tasks");
    const savedCount = localStorage.getItem("schrosk-collapse-count");

    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error("Failed to load tasks", e);
      }
    }

    if (savedCount) {
      try {
        setCollapseCount(parseInt(savedCount, 10));
      } catch (e) {
        console.error("Failed to load collapse count", e);
      }
    }

    setMounted(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("schrosk-tasks", JSON.stringify(tasks));
      localStorage.setItem("schrosk-collapse-count", collapseCount.toString());
    }
  }, [tasks, collapseCount, mounted]);

  const addTask = (text: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      status: "unobserved",
      createdAt: Date.now(),
      probability: 0.5,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  // Update probability when slider changes
  const updateProbability = (id: string, prob: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, probability: prob } : t))
    );
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setCollapseCount((prev) => prev + 1);
  };

  const resetCollapseCount = () => {
    setCollapseCount(0);
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen flex flex-col items-center pt-24 pb-48 px-4 bg-background selection:bg-neon-cyan/20">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-2 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
          SCHRÖSK
        </h1>
        <p className="text-center text-white/30 mb-12 font-mono text-sm tracking-widest uppercase">
          Observation Creates Reality
        </p>

        <TaskInput onAddTask={addTask} />

        <div className="w-full flex flex-col gap-2">
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} onCollapse={removeTask} onProbabilityChange={updateProbability} />
            ))}
          </AnimatePresence>
          <QuantumDashboard
            tasks={tasks}
            collapseCount={collapseCount}
            onResetCollapseCount={resetCollapseCount}
          />

          {tasks.length === 0 && (
            <div className="text-center text-white/10 mt-12 font-mono text-sm">
              [System: No quantum states detected]
            </div>
          )}
        </div>
      </div>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* Help Button */}
      <button
        onClick={() => setIsHelpOpen(true)}
        className="fixed bottom-6 right-6 z-[60] text-white/20 hover:text-neon-cyan transition-colors duration-300 hover:scale-110 active:scale-95"
        title="Quantum Manual"
      >
        <HelpCircle size={24} />
      </button>
    </main>
  );
}
