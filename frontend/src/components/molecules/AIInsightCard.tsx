'use client';

import React from 'react';

interface AIInsightCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    color?: string;
}

export default function AIInsightCard({ icon, title, description, color = 'text-electric-blue' }: AIInsightCardProps) {
    return (
        <div className="flex gap-3 py-3 border-b border-border-dim last:border-b-0">
            <div className={`mt-0.5 ${color}`}>
                {icon}
            </div>
            <div className="flex flex-col gap-0.5">
                <h4 className="text-sm font-medium text-white">{title}</h4>
                <p className="text-xs text-muted leading-relaxed">{description}</p>
            </div>
        </div>
    );
}
