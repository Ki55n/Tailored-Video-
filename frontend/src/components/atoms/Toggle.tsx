'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ToggleProps {
    enabled: boolean;
    onChange: (value: boolean) => void;
    label?: string;
    description?: string;
}

export default function Toggle({ enabled, onChange, label, description }: ToggleProps) {
    return (
        <div className="flex items-center justify-between py-3">
            <div className="flex flex-col">
                {label && <span className="text-sm font-medium text-white">{label}</span>}
                {description && <span className="text-xs text-muted mt-0.5">{description}</span>}
            </div>
            <button
                onClick={() => onChange(!enabled)}
                className={`
          relative w-12 h-7 rounded-full transition-colors duration-300 cursor-pointer
          ${enabled ? 'bg-electric-blue' : 'bg-soft-gray'}
        `}
            >
                <motion.div
                    className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md"
                    animate={{ left: enabled ? '24px' : '4px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
            </button>
        </div>
    );
}
