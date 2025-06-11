import { SnapshotLocationsDatatable } from '@/components/Features/Velero/SnapshotLocations/SnapshotLocationsDatatable';
import WithCoreAndAgentReady from '@/components/WithCoreAndAgentReady';

export default function VolumeSnapshotLocationsPage() {
  return <WithCoreAndAgentReady><SnapshotLocationsDatatable/></WithCoreAndAgentReady>;
}
