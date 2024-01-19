'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { AuthenticationForm } from '@/components/Auth/AuthenticationForm';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
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
