'use client';

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Toggle from '@/components/atoms/Toggle';
import Slider from '@/components/atoms/Slider';
import { useAppStore } from '@/stores/useAppStore';

const settingsTabs = ['General', 'Security', 'Billing', 'AI Preferences'];

export default function SettingsPage() {
    const { settings, updateSettings } = useAppStore();
    const [activeTab, setActiveTab] = useState('General');

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-white">Settings</h1>

            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-border-dim">
                {settingsTabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`
              pb-3 text-sm font-medium transition-colors relative cursor-pointer
              ${activeTab === tab
                                ? 'text-electric-blue'
                                : 'text-muted hover:text-white'
                            }
            `}
                    >
                        {tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-electric-blue rounded-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Profile Settings */}
            <div className="bg-deep-slate border border-border-dim rounded-[var(--radius)] p-6 space-y-5">
                <h2 className="text-lg font-bold text-white">Profile Settings</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="FULL NAME"
                        value={settings.fullName}
                        onChange={(e) => updateSettings({ fullName: e.target.value })}
                    />
                    <Input
                        label="EMAIL ADDRESS"
                        type="email"
                        value={settings.email}
                        onChange={(e) => updateSettings({ email: e.target.value })}
                    />
                </div>
            </div>

            {/* AI Preferences */}
            <div className="bg-deep-slate border border-border-dim rounded-[var(--radius)] p-6 space-y-5">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-electric-blue" />
                    <h2 className="text-lg font-bold text-white">AI Preferences</h2>
                </div>

                <Toggle
                    label="Auto-generate captions"
                    description="Automatically transcribe speech into on-screen text for all new projects."
                    enabled={settings.autoCaptions}
                    onChange={(val) => updateSettings({ autoCaptions: val })}
                />

                <div className="border-t border-border-dim pt-4 grid grid-cols-2 gap-6">
                    <Select
                        label="DEFAULT EXPORT RESOLUTION ⓘ"
                        value={settings.defaultResolution}
                        options={[
                            { value: '4K Ultra HD (3840 × 2160)', label: '4K Ultra HD (3840 × 2160)' },
                            { value: '1080p Full HD (1920 × 1080)', label: '1080p Full HD (1920 × 1080)' },
                            { value: '720p HD (1280 × 720)', label: '720p HD (1280 × 720)' },
                        ]}
                        onChange={(val) => updateSettings({ defaultResolution: val })}
                    />
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-semibold tracking-widest text-muted uppercase">AI Processing Power</label>
                            <span className="text-[10px] font-bold text-electric-blue border border-electric-blue rounded px-1.5 py-0.5 tracking-wider">
                                TURBO ACTIVE
                            </span>
                        </div>
                        <Slider
                            value={settings.aiProcessingPower}
                            onChange={(val) => updateSettings({ aiProcessingPower: val })}
                        />
                        <div className="flex justify-between mt-2 text-[10px] text-muted">
                            <span>STANDARD</span>
                            <span className="text-electric-blue">TURBO</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Billing Card */}
            <div className="bg-deep-slate border border-border-dim rounded-[var(--radius)] p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-electric-blue/15 rounded-lg flex items-center justify-center">
                        <span className="text-lg">👑</span>
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-white">Pro Editor Plan</h3>
                        <p className="text-xs text-muted">Your next billing date is Oct 14, 2023</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="secondary">View Billing History</Button>
                    <Button>Upgrade Plan</Button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-2">
                <button className="text-muted hover:text-white text-sm cursor-pointer">Discard Changes</button>
                <Button>Save Settings</Button>
            </div>
        </div>
    );
}
