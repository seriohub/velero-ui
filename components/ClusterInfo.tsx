import { Avatar, Group, Text } from '@mantine/core';

import { useAppState } from '@/contexts/AppStateContext';
import { IconServer } from '@tabler/icons-react';

export const ClusterInfo = () => {
  const appValues = useAppState();
  return (
    <>
      <Group wrap="nowrap" px={5} mt={25} mb={10} gap={6}>
        <Avatar size={46}>
          <IconServer size={46} stroke={1} />
        </Avatar>
        <div>
          <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
            {appValues?.currentServer?.name}
          </Text>

          <Text size="xs" fw={700}>
            {appValues?.currentServer?.url}
          </Text>
        </div>
      </Group>
    </>
  );
};
