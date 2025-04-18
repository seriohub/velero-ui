import { Code, Group, Text } from '@mantine/core';

import { useAppStatus } from '@/contexts/AppContext';
import { useServerStatus } from '@/contexts/ServerContext';
import { useAgentStatus } from '@/contexts/AgentContext';

import { ProcessTime } from '@/components/Display/ProcessTime';
import { DiagnosticAgentInfo } from '@/components/Features/Diagnostic/DiagnosticAgentInfo';
import { DiagnosticCoreInfo } from '@/components/Features/Diagnostic/DiagnosticCoreInfo';

export function AppShellFooter() {
  const appValues = useAppStatus();
  const agentValues = useAgentStatus();
  const serverValues = useServerStatus();

  return (
    <>
      <Group justify="space-between" gap={5} grow>
        <Group gap={30}>
          {serverValues.isCurrentServerControlPlane && <DiagnosticCoreInfo/>}
          {(appValues.isAuthenticated || serverValues.isCurrentServerControlPlane === false) && (
            <DiagnosticAgentInfo/>
          )}
        </Group>

        <Group visibleFrom="lg" gap={5} justify="center">
          <ProcessTime/>
        </Group>

        <Group gap={10} justify="right">
          <Text size="sm">App</Text>
          <Code fw={700}>v{agentValues.agentInfo?.helm_app_version}</Code>
        </Group>
      </Group>
    </>
  );
}
