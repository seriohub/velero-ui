'use client';

import { Loader, Stack } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { env } from 'next-runtime-env';

export default function LoginPage() {
  const router = useRouter();
  const NEXT_PUBLIC_AUTH_ENABLED = env('NEXT_PUBLIC_AUTH_ENABLED')?.toLowerCase() !== 'false';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const jwtToken = localStorage.getItem('token');
      if (jwtToken !== null || !NEXT_PUBLIC_AUTH_ENABLED) {
        router.push('/dashboard');
      } else {
        router.push('/login');
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
