'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressBar from '@/components/atoms/ProgressBar';
import { useAppStore } from '@/stores/useAppStore';
import { Diamond } from 'lucide-react';

const stages = [
  { threshold: 30, text: 'INITIALIZING STORES...' },
  { threshold: 70, text: 'ANALYZING VIDEO ENGINE...' },
  { threshold: 100, text: 'HYDRATING MEDIA ASSETS...' },
];

export default function LoadingPage() {
  const router = useRouter();
  const { setLoadingPhase, setIsLoaded } = useAppStore();
  const [progress, setProgress] = useState(0);
  const [stageText, setStageText] = useState(stages[0].text);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 3 + 1;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsLoaded(true);
          router.push('/dashboard');
        }, 600);
      }

      setProgress(current);

      const activeStage = stages.find((s) => current <= s.threshold) || stages[stages.length - 1];
      setStageText(activeStage.text);
      setLoadingPhase(current, activeStage.text);
    }, 80);

    return () => clearInterval(interval);
  }, [router, setIsLoaded, setLoadingPhase]);

  return (
    <div className="fixed inset-0 bg-void-black flex flex-col items-center justify-center z-[100]">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center gap-10"
        >
          {/* Logo */}
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Diamond className="w-10 h-10 text-white/80" strokeWidth={1.5} />
            </motion.div>
            <h1 className="text-3xl font-light tracking-[0.35em] text-white/90">
              TAILORED <span className="font-semibold">VIDEO</span>
            </h1>
          </div>

          {/* Progress */}
          <ProgressBar progress={progress} stageText={stageText} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
