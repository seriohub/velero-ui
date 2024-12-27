'use client';

import { Loader, Stack } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // if (process.env.NODE_ENV === 'development') console.log(`%cuseEffect 110 has been called`, `color: green; font-weight: bold;`)
    if (typeof window !== 'undefined') {
      const jwtToken = localStorage.getItem('token');
      if (jwtToken !== null) {
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
