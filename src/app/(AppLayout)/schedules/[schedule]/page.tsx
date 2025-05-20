'use client';

import { use } from "react";
import { ScheduleDetails } from '@/components/Features/Velero/Schedules/ScheduleDetails';

export default function SchedulePage(props: any) {
  const params = use(props.params);
  return <ScheduleDetails params={params}/>;
}
