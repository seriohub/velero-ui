'use client';

import React from 'react';
import AuthShellLayout from '@/components/Layout/AuthLayout/AuthShell.Layout';

export default function RootLayout({ children }: { children: any }) {
  return <AuthShellLayout>{children}</AuthShellLayout>;
}
