import { BackupsDatatable } from '@/components/Features/Velero/Backups/BackupsDatatable';
import WithCoreAndAgentReady from '@/components/WithCoreAndAgentReady';

export default function BackupsPage() {
  return <WithCoreAndAgentReady><BackupsDatatable/></WithCoreAndAgentReady>;
}
