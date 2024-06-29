import { useEffect, useContext } from 'react';

import { Avatar, Group, Text } from '@mantine/core';
import { usePathname } from 'next/navigation';
import { useApiGet } from '@/hooks/useApiGet';

import VeleroAppContexts from '@/contexts/VeleroAppContexts';
import { IconServer } from '@tabler/icons-react';

export const ClusterInfo = () => {
  const appValues = useContext(VeleroAppContexts);
  return (
    <>
      <Group wrap="nowrap" px={5} mt={25} mb={10} gap={6}>
        <Avatar size={46}>
          <IconServer size={46} stroke={1} />
        </Avatar>
        <div>
          <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
            {appValues.state.currentBackend.name}
          </Text>
        
      
        <Text size="xs" fw={700}>
          {appValues.state.currentBackend.url}
        </Text>
        </div>
      </Group>
    </>
  );
};
