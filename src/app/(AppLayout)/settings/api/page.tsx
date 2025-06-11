import { API } from '@/components/Features/Settings/API/API';
import WithCoreAndAgentReady from '@/components/WithCoreAndAgentReady';

export default function APIConfigurationPage() {
  return <WithCoreAndAgentReady><API/></WithCoreAndAgentReady>
}
