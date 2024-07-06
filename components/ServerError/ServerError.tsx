import { useEffect, useContext } from 'react';

import { Avatar, Center, Group, Modal, Stack, Text } from '@mantine/core';
import { usePathname } from 'next/navigation';
import { useApiGet } from '@/hooks/useApiGet';

import VeleroAppContexts from '@/contexts/VeleroAppContexts';
import { IconServer } from '@tabler/icons-react';
import useBackendConnection from '@/hooks/useBackendConnections';
import { Title,  Button, Container, } from '@mantine/core';


export const ServerError = () => {
  const appValues = useContext(VeleroAppContexts);
  const { isConnected } = useBackendConnection();

  return (
    <>
      <Modal opened={!isConnected} onClose={close} title="Connection error" withCloseButton={false} size="xl">
        <Stack align='center'>
          
        <Title order={1} ta="center" c='red'>500</Title>
        <Title order={2} ta="center">Something bad just happened...</Title>
        <Title order={4} ta="center">
          Server could not handle your request.
        </Title>

        <Title order={4} ta="center">
          Check core or agent running...
        </Title>


        <Title order={6} ta="center">
        This message disappears automatically once the connection is restored
        </Title>

        </Stack>
      </Modal>
    </>
  );
};
