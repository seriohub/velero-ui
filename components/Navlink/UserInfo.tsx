import { useEffect } from 'react';

import { Avatar, Group, Text, useComputedColorScheme } from '@mantine/core';

import { useApiGet } from '@/hooks/useApiGet';
import {
  IconAt,
  IconPhoneCall,
  IconUser,
  IconUserCircle,
  IconUserSquare,
} from '@tabler/icons-react';

export const UserInfo = () => {
  const { data, getData } = useApiGet();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  useEffect(() => {
    getData('/api/v1/users/me/info');
  }, []);

  if (data === undefined) return <></>;
  
  return (
    <>
      <Group wrap="nowrap" mb={10}>
        <Avatar color={computedColorScheme === 'dark' ? 'white':'blue'} size={64} radius={0}>
          <IconUserSquare size={64} stroke={1} />
        </Avatar>
        <div>
          <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
            {data.is_admin ? 'ADMIN' : ''}
          </Text>

          <Text fz="lg" fw={500}>
            {data.username}
          </Text>

          {/*<Group wrap="nowrap" gap={10} mt={3}>
            <IconAt stroke={1.5} size="1rem" />
            <Text fz="xs" c="dimmed">
             
            </Text>
          </Group>

          <Group wrap="nowrap" gap={10} mt={5}>
            <IconPhoneCall stroke={1.5} size="1rem" />
            <Text fz="xs" c="dimmed">
             
            </Text>
  </Group>*/}
        </div>
      </Group>
    </>
  );
};
