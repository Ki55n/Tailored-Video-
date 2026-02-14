'use client';

import React from 'react';

interface SliderProps {
    value: number;
    min?: number;
    max?: number;
    label?: string;
    displayValue?: string;
    onChange: (value: number) => void;
}

export default function Slider({
    value,
    min = 0,
    max = 100,
    label,
    displayValue,
    onChange,
}: SliderProps) {
    const percent = ((value - min) / (max - min)) * 100;

    return (
        <div className="flex flex-col gap-2">
            {(label || displayValue) && (
                <div className="flex justify-between items-center">
                    {label && <span className="text-xs text-muted uppercase tracking-wider">{label}</span>}
                    {displayValue && <span className="text-xs text-electric-blue font-medium">{displayValue}</span>}
                </div>
            )}
            <div className="relative w-full h-1.5 bg-soft-gray rounded-full">
                <div
                    className="absolute h-full bg-electric-blue rounded-full"
                    style={{ width: `${percent}%` }}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-electric-blue rounded-full border-2 border-white shadow-md pointer-events-none"
                    style={{ left: `calc(${percent}% - 7px)` }}
                />
            </div>
        </div>
    );
}
