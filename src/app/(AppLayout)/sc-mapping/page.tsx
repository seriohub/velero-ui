import { SCDatatable } from '@/components/Features/Velero/SCMapping/SCDatatable';
import WithCoreAndAgentReady from '@/components/WithCoreAndAgentReady';

export default function ScMappingPage() {
  return <WithCoreAndAgentReady><SCDatatable/></WithCoreAndAgentReady>;
}
