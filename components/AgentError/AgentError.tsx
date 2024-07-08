import { useEffect, useContext } from 'react';

import { Alert, Avatar, Center, Group, Modal, Notification, Stack, Text } from '@mantine/core';
import { usePathname } from 'next/navigation';
import { useApiGet } from '@/hooks/useApiGet';

import { useAppState } from '@/contexts/AppStateContext';
import { IconInfoCircle, IconServer } from '@tabler/icons-react';

import { Title, Button, Container } from '@mantine/core';
import { useServerStatus } from '@/contexts/ServerStatusContext';
import { useAgentStatus } from '@/contexts/AgentStatusContext';

export const AgentError = () => {
  const appValues = useAppState();
  //const { isConnected } = useBackendConnection();
  const isAgentConnected = useAgentStatus();
  const icon = <IconInfoCircle />;

  return (
    <>
      {!isAgentConnected && (
        
          <Alert variant="light" color="pink" title="Error" icon={icon}>
            Agent disconnected
          </Alert>
        
      )}
    </>
  );
};
