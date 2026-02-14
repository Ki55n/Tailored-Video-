'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps {
    label?: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
}

export default function Select({ label, value, options, onChange }: SelectProps) {
    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label className="text-xs font-semibold tracking-widest text-muted uppercase">{label}</label>
            )}
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="
            w-full appearance-none bg-deep-slate border border-border-dim rounded-[var(--radius)]
            px-4 py-3 text-sm text-white cursor-pointer
            focus:outline-none focus:border-electric-blue transition-colors
          "
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-deep-slate">
                            {opt.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            </div>
        </div>
    );
}
