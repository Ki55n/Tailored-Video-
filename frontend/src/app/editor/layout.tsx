'use client';

import React from 'react';
import Sidebar from '@/components/molecules/Sidebar';

export default function EditorLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-void-black">
            <Sidebar variant="editor" />
            <main className="ml-[68px] flex-1 flex flex-col">
                {children}
            </main>
        </div>
    );
}
