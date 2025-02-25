'use client';

import { ScheduleDetails } from '@/components/Features/Velero/Schedules/ScheduleDetails';

export default function SchedulePage({ params }: any) {
  return (
    <>
      <ScheduleDetails params={params} />
    </>
  );
}
