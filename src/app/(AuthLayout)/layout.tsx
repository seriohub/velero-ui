'use client';

import React from 'react';
import AuthShellLayout from '@/components/Layout/AuthLayout/AuthShell.Layout';
import AppShellBoot from '@/components/Layout/AuthLayout/AppShell.Boot';

export default function RootLayout({ children }: { children: any }) {
  return (
    <>
      <AppShellBoot>{children}</AppShellBoot>
    </>
  );
}
