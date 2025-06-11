import { SchedulesDatatable } from '@/components/Features/Velero/Schedules/SchedulesDatatable';
import WithCoreAndAgentReady from '@/components/WithCoreAndAgentReady';

export default function ScheduledPage() {
  return <WithCoreAndAgentReady><SchedulesDatatable/></WithCoreAndAgentReady>
}
