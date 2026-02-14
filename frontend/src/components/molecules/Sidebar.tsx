'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Home, PlaySquare, FolderOpen, Settings, Sparkles,
    Type, Music, Palette, Wand2, LayoutGrid, Clapperboard,
    Upload
} from 'lucide-react';

interface NavItem {
    icon: React.ElementType;
    label: string;
    href: string;
}

const dashboardNav: NavItem[] = [
    { icon: Home, label: 'Home', href: '/dashboard' },
    { icon: PlaySquare, label: 'Edit', href: '/editor' },
    { icon: FolderOpen, label: 'Assets', href: '/media' },
    { icon: Settings, label: 'Settings', href: '/settings' },
];

const editorNav: NavItem[] = [
    { icon: FolderOpen, label: 'Media', href: '/editor' },
    { icon: Type, label: 'Text', href: '/script' },
    { icon: Music, label: 'Audio', href: '/editor' },
    { icon: Palette, label: 'Effects', href: '/editor' },
    { icon: Wand2, label: 'AI', href: '/editor' },
];

interface SidebarProps {
    variant?: 'dashboard' | 'editor';
}

export default function Sidebar({ variant = 'dashboard' }: SidebarProps) {
    const pathname = usePathname();
    const items = variant === 'editor' ? editorNav : dashboardNav;

    return (
        <aside className="fixed left-0 top-0 h-screen w-[68px] bg-surface flex flex-col items-center py-4 z-50 border-r border-border-dim">
            {/* Logo */}
            <Link href="/dashboard" className="mb-6 flex flex-col items-center gap-1">
                <div className="w-9 h-9 bg-electric-blue rounded-lg flex items-center justify-center">
                    {variant === 'editor' ? (
                        <LayoutGrid className="w-5 h-5 text-white" />
                    ) : (
                        <Clapperboard className="w-5 h-5 text-white" />
                    )}
                </div>
                <span className="text-[8px] font-bold tracking-wider text-muted-light uppercase leading-tight text-center">
                    TAILORED<br />VIDEO
                </span>
            </Link>

            {/* Nav Items */}
            <nav className="flex flex-col items-center gap-1 flex-1">
                {items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.label} href={item.href}>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className={`
                  relative flex flex-col items-center justify-center w-14 h-14 rounded-xl
                  transition-colors cursor-pointer
                  ${isActive ? 'bg-electric-blue/15 text-electric-blue' : 'text-muted hover:text-white hover:bg-soft-gray/50'}
                `}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute left-0 top-2 bottom-2 w-[3px] bg-electric-blue rounded-r-full"
                                    />
                                )}
                                <item.icon className="w-5 h-5" />
                                <span className="text-[10px] mt-1">{item.label}</span>
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom icons */}
            <div className="flex flex-col items-center gap-2 mt-auto">
                {variant === 'dashboard' && (
                    <Link href="/render">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex flex-col items-center justify-center w-14 h-14 rounded-xl text-muted hover:text-white hover:bg-soft-gray/50 cursor-pointer"
                        >
                            <Upload className="w-5 h-5" />
                            <span className="text-[10px] mt-1">Export</span>
                        </motion.div>
                    </Link>
                )}
                <Link href="/settings">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className={`
              flex flex-col items-center justify-center w-14 h-14 rounded-xl cursor-pointer
              ${pathname === '/settings' ? 'text-electric-blue' : 'text-muted hover:text-white hover:bg-soft-gray/50'}
            `}
                    >
                        <Settings className="w-5 h-5" />
                    </motion.div>
                </Link>
            </div>
        </aside>
    );
}
