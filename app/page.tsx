'use client';

import { Loader, Stack } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
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
