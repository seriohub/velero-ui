import { useContext, useEffect } from 'react';
import { env } from 'next-runtime-env';
import VeleroAppContexts from '@/contexts/VeleroAppContexts';
import { useApiGet } from '@/hooks/useApiGet';
import { Group, Space, Text } from '@mantine/core';

export function AppShellFooter() {
  const value = useContext(VeleroAppContexts);
  const NEXT_PUBLIC_VELERO_API_URL = env('NEXT_PUBLIC_FRONT_END_VERSION');
  const { data, getData } = useApiGet();

  useEffect(() => {
    getData('/api/v1/info');
  }, []);

  return (
    <>
      <Group justify="flex-end" mx={5}>
        {data && <>
        <Group gap={5}>
          <Text >API</Text> 
          <Text fw={800}>{data['release_version']}({data['release_date']})</Text>
          </Group>
        </>}
        <Group gap={5}>
        <Text>UI</Text>
        <Text fw={800}>{NEXT_PUBLIC_VELERO_API_URL}</Text>
        </Group>
      </Group>
    </>
  );
}
