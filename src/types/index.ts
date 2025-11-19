export interface Task {
    id: string;
    text: string;
    status: 'unobserved' | 'collapsing';
    createdAt: number;
    /**
     * Probability (0 to 1) that this task will be executed/observed.
     * Represents the "quantum superposition" weight.
     */
    probability: number;
}
