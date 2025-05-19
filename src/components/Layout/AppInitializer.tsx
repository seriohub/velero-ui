// AppInitializer.tsx con stato "pronto"
'use client';
import { useState, useEffect } from 'react';
import useAppBootstrap from '@/components/Layout/useAppBootstrap';

export default function AppInitializer({ onReady }: { onReady: () => void }) {
  useAppBootstrap();

  useEffect(() => {
    onReady();
  }, []);

  return null;
}
