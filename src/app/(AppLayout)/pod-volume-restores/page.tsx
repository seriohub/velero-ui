import { PVBDatatable } from '@/components/Features/Velero/PodVolumes/PVBDatatable';
import WithCoreAndAgentReady from '@/components/WithCoreAndAgentReady';

export default function PvbPage() {
  return <WithCoreAndAgentReady><PVBDatatable type="PodVolumeRestore"/></WithCoreAndAgentReady>;
}
