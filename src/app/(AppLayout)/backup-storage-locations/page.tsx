import { BslDatatable } from '@/components/Features/Velero/BackupLocations/BslDatatable';
import WithCoreAndAgentReady from '@/components/WithCoreAndAgentReady';

export default function BackupStorageLocationsPage() {
  return <WithCoreAndAgentReady><BslDatatable/></WithCoreAndAgentReady>;
}
