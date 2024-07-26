import { useEffect } from 'react';

import { Avatar, Group, Text } from '@mantine/core';

import { useApiGet } from '@/hooks/useApiGet';
import { IconUserCircle } from '@tabler/icons-react';

export const UserInfo = () => {
  const { data, getData } = useApiGet();
  // const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') console.log(`%cuseEffect 8625 has been called`, `color: green; font-weight: bold;`)
    getData({ url: '/v1/users/me/info', target: 'static' });
  }, []);

  if (data === undefined) return <></>;

  return (
    <>
      <Group wrap="nowrap" px={5} mt={25} mb={10} gap={6}>
        <Avatar size={46}>
          <IconUserCircle size={46} stroke={1} />
        </Avatar>
        <div>
          <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
            {data.is_admin ? 'ADMIN' : ''}
          </Text>

          <Text fz="lg" fw={500}>
            {data.username}
          </Text>
        </div>
      </Group>
    </>
  );
};
