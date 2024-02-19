import { useEffect } from 'react';

import { Group, Text } from '@mantine/core';
import { usePathname } from 'next/navigation';
import { useApiGet } from '@/hooks/useApiGet';

export const ClusterInfo = () => {
  const { data, getData, error, fetching } = useApiGet();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname!='/' && pathname!='/login')
    getData('/info/health-k8s');
  }, []);
  
  if (pathname=='/' || pathname=='/login')
    return <><div></div></>
  
    if (data === undefined) return <>-</>;

  return (
    <>
      <Group justify="space-between">
        <Group gap={5}>
          <Text size="sm">Cluster Online:</Text>
          <Text size="sm" fw={700}>
            {data?.cluster_online ? 'true' : 'false'}
          </Text>
        </Group>
        <Group gap={5}>
          <Text size="sm">Nodes:</Text>
          <Text size="sm" fw={700}>
            {data?.nodes?.total}
          </Text>
        </Group>
        <Group gap={5}>
          <Text size="sm">Nodes in error:</Text>
          <Text size="sm" fw={700}>
            {data?.nodes?.in_error}
          </Text>
        </Group>
      </Group>
    </>
  );
};
