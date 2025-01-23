'use client';

import { Schedule } from '@/components/Velero/Schedule/Schedule';

export default function SchedulePage({ params }: any) {
  return (
    <>
      <Schedule params={params} />
    </>
  );
}
