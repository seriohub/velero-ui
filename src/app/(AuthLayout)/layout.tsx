'use client';

import React from 'react';
import AppShellBoot from '@/components/Layout/AuthLayout/AppShell.Boot';

export default function RootLayout({ children }: { children: any }) {
  return <AppShellBoot>{children}</AppShellBoot>;
}
