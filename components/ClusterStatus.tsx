import { useEffect } from 'react';

import { Group, Text } from '@mantine/core';
import { usePathname } from 'next/navigation';
import { useApiGet } from '@/hooks/useApiGet';

export const ClusterStatus = () => {
  const { data, getData, error, fetching } = useApiGet();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname != '/' && pathname != '/login') getData('/info/health-k8s');
  }, []);

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
