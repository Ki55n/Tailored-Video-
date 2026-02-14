'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
    progress: number;
    stageText?: string;
}

export default function ProgressBar({ progress, stageText }: ProgressBarProps) {
    return (
        <div className="flex flex-col items-center gap-4 w-full max-w-sm">
            <div className="w-full h-[2px] bg-soft-gray rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-electric-blue rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                />
            </div>
            {stageText && (
                <motion.p
                    key={stageText}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs tracking-[0.25em] text-muted font-light"
                >
                    {stageText}
                </motion.p>
            )}
        </div>
    );
}
