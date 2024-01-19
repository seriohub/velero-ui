import { useEffect } from 'react';

import { Group, Text } from '@mantine/core';

import { useApiGet } from '@/hooks/useApiGet';

export const UserInfo = () => {
  const { data, getData } = useApiGet();

  useEffect(() => {
    getData('/api/v1/users/me/info');
  }, []);

  if (data === undefined) return <></>;

  return (
    <>
      <Group h={80} gap={5} pl={10}>
        <Text fw={700} size="md" c="dimmed" mb="xs" style={{ userSelect: 'none' }} tt="uppercase">
          {data.username}
        </Text>
      </Group>
    </>
  );
};
