import { Modal, Stack } from '@mantine/core';

import { Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { useServerStatus } from '@/contexts/ServerStatusContext';

export const ServerError = () => {

  const serverValues = useServerStatus();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={serverValues.currentServer !== undefined && !serverValues.isServerAvailable}
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
