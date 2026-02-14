'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Trash2 } from 'lucide-react';
import Button from '@/components/atoms/Button';
import AssetRow from '@/components/molecules/AssetRow';
import { useAssetStore } from '@/stores/useAssetStore';

const filterTabs: { value: 'all' | 'video' | 'audio' | 'image'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'video', label: 'Video' },
    { value: 'audio', label: 'Audio' },
    { value: 'image', label: 'Images' },
];

export default function MediaLibraryPage() {
    const {
        filter, setFilter,
        selectedIds, toggleSelect, selectAll, clearSelection, deleteSelected,
        searchQuery, setSearchQuery, filteredAssets,
    } = useAssetStore();

    const assets = filteredAssets();

    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-border-dim">
                <h1 className="text-xl font-bold text-white">Media Library</h1>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search assets..."
                            className="bg-deep-slate border border-border-dim rounded-[var(--radius)] pl-9 pr-4 py-2 text-sm text-white placeholder-muted focus:outline-none focus:border-electric-blue w-56"
                        />
                    </div>
                    <Button icon={<Plus className="w-4 h-4" />}>
                        Import Assets
                    </Button>
                </div>
            </header>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 px-6 py-3">
                {filterTabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setFilter(tab.value)}
                        className={`
              px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer
              ${filter === tab.value
                                ? 'bg-electric-blue text-white'
                                : 'bg-soft-gray text-muted hover:text-white'
                            }
            `}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-[40px_80px_1fr_100px_100px_80px_100px_120px] items-center gap-2 px-4 py-2 text-[10px] text-muted uppercase tracking-wider font-semibold border-b border-border-dim">
                <div className="flex items-center justify-center">
                    <div
                        className="w-4 h-4 rounded border border-border-dim cursor-pointer flex items-center justify-center hover:border-electric-blue transition-colors"
                        onClick={() => (selectedIds.length === assets.length ? clearSelection() : selectAll())}
                    >
                        {selectedIds.length === assets.length && assets.length > 0 && <span className="text-electric-blue text-[10px]">✓</span>}
                    </div>
                </div>
                <span />
                <span>File Name</span>
                <span>Type</span>
                <span>Duration</span>
                <span>Size</span>
                <span>Resolution</span>
                <span>Date Added</span>
            </div>

            {/* Asset Rows */}
            <div className="flex-1 overflow-y-auto">
                {assets.map((asset, i) => (
                    <motion.div
                        key={asset.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <AssetRow
                            {...asset}
                            selected={selectedIds.includes(asset.id)}
                            onSelect={() => toggleSelect(asset.id)}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Footer */}
            <footer className="flex items-center justify-between px-6 py-3 border-t border-border-dim text-xs">
                <div className="flex items-center gap-3">
                    <span className="text-muted">{selectedIds.length} Assets selected</span>
                    {selectedIds.length > 0 && (
                        <button
                            onClick={deleteSelected}
                            className="text-danger flex items-center gap-1 hover:text-red-400 cursor-pointer"
                        >
                            <Trash2 className="w-3 h-3" />
                            Delete Selected
                        </button>
                    )}
                </div>
                <span className="text-muted">Storage: 5.4 GB of 50 GB used</span>
            </footer>
        </div>
    );
}
