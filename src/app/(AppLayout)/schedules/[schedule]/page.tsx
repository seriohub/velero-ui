'use client';

import { use } from "react";
import { ScheduleDetails } from '@/components/Features/Velero/Schedules/ScheduleDetails';
import WithCoreAndAgentReady from '@/components/WithCoreAndAgentReady';

export default function SchedulePage(props: any) {
  const params = use(props.params);
  return <WithCoreAndAgentReady><ScheduleDetails params={params}/></WithCoreAndAgentReady>;
}
