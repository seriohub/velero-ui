import { useEffect } from 'react';

import { Group, Text } from '@mantine/core';
import { usePathname } from 'next/navigation';
import { useApiGet } from '@/hooks/useApiGet';
import { useAgentStatus } from '@/contexts/AgentStatusContext';
import ExpireIn from './Backup/ExpireIn';

export const DataFetchedInfo = ({metadata}: any) => {
  

  return (
    <>
      {metadata?.timestamp && (
        <>
        <Group justify='flex-end'>
          <Text fw={500} size="xs">
            Data fetched <ExpireIn expiration={metadata?.timestamp} />{' '}
          </Text>
          </Group>
        </>
      )}
    </>
  );
};
