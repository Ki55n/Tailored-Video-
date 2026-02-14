'use client';

import React from 'react';

interface StatusCardProps {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}

export default function StatusCard({ icon, title, children }: StatusCardProps) {
    return (
        <div className="bg-deep-slate border border-border-dim rounded-[var(--radius)] p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
                {icon}
                <h4 className="text-sm font-semibold text-white">{title}</h4>
            </div>
            {children}
        </div>
    );
}
