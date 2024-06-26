import { useContext } from 'react';

import { ActionIcon, Group, Text } from '@mantine/core';

import { IconApi, IconPlugConnected, IconSettings } from '@tabler/icons-react';

import VeleroAppContexts from '@/contexts/VeleroAppContexts';

interface DiagnosticLinkProps {
  ApiURL: string;
}

export const DiagnosticLink = ({ ApiURL }: DiagnosticLinkProps) => {
  const appValues = useContext(VeleroAppContexts);

  return (
    <>
      {/* online */}
      <Group gap={8}>
        <Group gap={0}>
          <Text size="sm">ws:</Text>
          <Text size="sm" fw={800}>
            {appValues.state.socketStatus}
          </Text>
        </Group>
        <Group gap={2}>
          <Text size="sm">status:</Text>
          <ActionIcon
            component="a"
            href={ApiURL}
            size="sm"
            aria-label="Open in a new tab"
            target="_blank"
          >
            <IconPlugConnected size={20} />
          </ActionIcon>
        </Group>
        {/* info */}
        <Group gap={2}>
          <Text size="sm">info:</Text>
          <ActionIcon
            component="a"
            href={ApiURL + '/info/docs'}
            size="sm"
            aria-label="Docs"
            target="_blank"
          >
            <IconApi size={20} />
          </ActionIcon>
          <ActionIcon
            component="a"
            href={ApiURL + '/info/redoc'}
            size="sm"
            aria-label="Docs"
            target="_blank"
          >
            <IconSettings size={20} />
          </ActionIcon>
        </Group>

        {/* v1 */}
        <Group gap={2}>
          <Text size="sm">v1:</Text>
          <ActionIcon
            component="a"
            href={ApiURL + '/v1/docs'}
            size="sm"
            aria-label="Docs"
            target="_blank"
          >
            <IconApi size={20} />
          </ActionIcon>
          <ActionIcon
            component="a"
            href={ApiURL + '/v1/redoc'}
            size="sm"
            aria-label="Docs"
            target="_blank"
          >
            <IconSettings size={20} />
          </ActionIcon>
        </Group>
      </Group>
    </>
  );
};
