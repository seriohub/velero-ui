'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { AuthenticationForm } from '@/components/Auth/AuthenticationForm';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // if (process.env.NODE_ENV === 'development') console.log(`%cuseEffect 120 has been called`, `color: green; font-weight: bold;`)
    const jwtToken = localStorage.getItem('token');
    if (jwtToken !== null) {
      router.push('/dashboard');
    }
  }, []);
  return (
    <>
      <AuthenticationForm />
    </>
  );
}
