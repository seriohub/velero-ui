import { RestoresDatatable } from '@/components/Features/Velero/Restores/RestoresDatatable';
import WithCoreAndAgentReady from '@/components/WithCoreAndAgentReady';

export default function RestoresPage() {
  return <WithCoreAndAgentReady><RestoresDatatable/></WithCoreAndAgentReady>;
}
