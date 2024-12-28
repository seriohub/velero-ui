'use client';

import AppShellBoot from '@/components/Layout/AuthLayout/AppShell.Boot';
import React from 'react';

export default function RootLayout({ children }: { children: any }) {
  return <AppShellBoot>{children}</AppShellBoot>;
}
