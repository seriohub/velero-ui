import { useEffect } from 'react';

import { Group, Text } from '@mantine/core';
import { usePathname } from 'next/navigation';
import { useAgentStatus } from '@/contexts/AgentStatusContext';
import { useClusterHealth } from '@/api/Cluster/useClusterHealth';

export const ClusterStatus = () => {
  const { data, getClusterHealth, error, fetching } = useClusterHealth();
  const pathname = usePathname();
  const agentValues = useAgentStatus();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development')
      console.log(`%cuseEffect 130 has been called`, `color: green; font-weight: bold;`);
    if (agentValues.isAgentAvailable && pathname != '/' && pathname != '/login') getClusterHealth();
  }, [agentValues.isAgentAvailable]);

  if (data === undefined) return <>-</>;

  return (
    <>
      <Group justify="space-between" gap={8}>
        <Group gap={1}>
          <Text size="sm">k8s:</Text>
          <Text size="sm" fw={700}>
            {data?.payload?.cluster_online ? 'online' : 'error'}
          </Text>
        </Group>
        <Group gap={1}>
          <Text size="sm">Nodes:</Text>
          <Text size="sm" fw={700}>
            {data?.payload?.nodes?.total}
          </Text>
        </Group>
        <Group gap={1}>
          <Text size="sm">NotReady:</Text>
          <Text size="sm" fw={700}>
            {data?.payload?.nodes?.in_error}
          </Text>
        </Group>
      </Group>
    </>
  );
};
