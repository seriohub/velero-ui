import { Modal, Stack } from '@mantine/core';

import { Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { useServerStatus } from '@/contexts/ServerContext';
import { useEffect, useState } from 'react';

export const ServerError = () => {

  const serverValues = useServerStatus();
  const [opened, { open, close }] = useDisclosure(false);
  
  const [shouldOpen, setShouldOpen] = useState(false);

  useEffect(() => {
    if (serverValues.currentServer !== undefined && serverValues.isServerAvailable === false) {
      const timer = setTimeout(() => {
        if (serverValues.currentServer !== undefined && serverValues.isServerAvailable === false) {
          setShouldOpen(true);
          open();
        }
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setShouldOpen(false);
      close();
    }
  }, [serverValues.currentServer, serverValues.isServerAvailable, open, close]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Connection error"
        withCloseButton={false}
        size="xl"
      >
        <Stack align="center">
          <Title order={1} ta="center" c="red">
            500
          </Title>
          <Title order={2} ta="center">
            Something bad just happened...
          </Title>
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
