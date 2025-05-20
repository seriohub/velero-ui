'use client';

import { useState } from 'react';
import AppInitializer from '@/components/Layout/AppInitializer';
import AuthGate from "@/components/Layout/AuthGate";

export default function AppClientWrapper({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  return (
    <>
      <AppInitializer onReady={() => setReady(true)}/>
      {ready && <AuthGate>{children}</AuthGate>}
    </>
  );
}
