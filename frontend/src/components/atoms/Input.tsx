'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export default function Input({ label, className = '', ...props }: InputProps) {
    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label className="text-xs font-semibold tracking-widest text-muted uppercase">
                    {label}
                </label>
            )}
            <input
                className={`
          w-full bg-deep-slate border border-border-dim rounded-[var(--radius)]
          px-4 py-3 text-sm text-white placeholder-muted
          focus:outline-none focus:border-electric-blue transition-colors
          ${className}
        `}
                {...props}
            />
        </div>
    );
}
