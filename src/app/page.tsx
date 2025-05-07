'use client';

import { Loader, Stack } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { env } from 'next-runtime-env';

export default function RootPage() {
  const router = useRouter();
  const NEXT_PUBLIC_AUTH_ENABLED = env('NEXT_PUBLIC_AUTH_ENABLED')?.toLowerCase() !== 'false';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const jwtToken = localStorage.getItem('token');
      if (NEXT_PUBLIC_AUTH_ENABLED && !jwtToken) {
        router.push('/login');
      } else {
        router.push('/dashboard');
      }
    }
  }, []);

  return (
    <>
      <Stack h="100vh" align="center" justify="center">
        <Loader />
      </Stack>
    </>
  );
}
