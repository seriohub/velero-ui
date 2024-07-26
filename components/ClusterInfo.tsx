import { Avatar, Group, Text } from '@mantine/core';

import { IconServer } from '@tabler/icons-react';

import { useServerStatus } from '@/contexts/ServerStatusContext';

export const ClusterInfo = () => {
  const serverValues = useServerStatus();

  return (
    <>
      <Group wrap="nowrap" px={5} mt={25} mb={10} gap={6}>
        <Avatar size={46}>
          <IconServer size={46} stroke={1} />
        </Avatar>
        <div>
          <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
            {serverValues?.currentServer?.name}
          </Text>

          <Text size="xs" fw={700}>
            {serverValues?.currentServer?.url}
          </Text>
        </div>
      </Group>
    </>
  );
};
