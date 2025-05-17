'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { AuthenticationForm } from '@/components/Features/Auth/AuthenticationForm';
import { env } from "next-runtime-env";

export default function LoginPage() {
  const router = useRouter();
  const NEXT_PUBLIC_AUTH_ENABLED = env('NEXT_PUBLIC_AUTH_ENABLED')?.toLowerCase() !== 'false';

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken !== null || !NEXT_PUBLIC_AUTH_ENABLED) {
      router.push('/dashboard');
    }
  }, []);

  return <AuthenticationForm/>;
}
