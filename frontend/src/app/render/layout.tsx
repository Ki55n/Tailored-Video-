'use client';

import React from 'react';
import Sidebar from '@/components/molecules/Sidebar';

export default function RenderLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-void-black">
            <Sidebar variant="editor" />
            <main className="ml-[68px] flex-1">
                {children}
            </main>
        </div>
    );
}
