import { ReposDatatable } from '@/components/Features/Velero/Repos/ReposDatatable';
import WithCoreAndAgentReady from '@/components/WithCoreAndAgentReady';

export default function RepoLocationPage() {
  return <WithCoreAndAgentReady><ReposDatatable/></WithCoreAndAgentReady>;
}
