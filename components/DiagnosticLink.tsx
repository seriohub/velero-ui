import { ActionIcon, Group, Text } from '@mantine/core';

import { IconApi, IconPlugConnected, IconSettings } from '@tabler/icons-react';

interface DiagnosticLinkProps {
  ApiURL: string;
}

export const DiagnosticLink = ({ ApiURL }: DiagnosticLinkProps) => {
  return (
    <>
      {/* online */}
      <Group gap={20}>
        <Group gap={5}>
          <Text size="sm">docs</Text>
          <ActionIcon
            component="a"
            href={ApiURL}
            size="sm"
            aria-label="Open in a new tab"
            target="_blank"
          >
            <IconPlugConnected size={20} />
          </ActionIcon>
          <ActionIcon
            component="a"
            href={ApiURL + '/api/docs'}
            size="sm"
            aria-label="Docs"
            target="_blank"
          >
            <IconApi size={20} />
          </ActionIcon>
          <ActionIcon
            component="a"
            href={ApiURL + '/api/redoc'}
            size="sm"
            aria-label="Docs"
            target="_blank"
          >
            <IconSettings size={20} />
          </ActionIcon>
        </Group>
        {/* info */}
        <Group gap={5}>
          <Text size="sm">info</Text>
          <ActionIcon
            component="a"
            href={ApiURL + '/api/info/docs'}
            size="sm"
            aria-label="Docs"
            target="_blank"
          >
            <IconApi size={20} />
          </ActionIcon>
          <ActionIcon
            component="a"
            href={ApiURL + '/api/info/redoc'}
            size="sm"
            aria-label="Docs"
            target="_blank"
          >
            <IconSettings size={20} />
          </ActionIcon>
        </Group>

        {/* v1 */}
        <Group gap={5}>
          <Text size="sm">v1</Text>
          <ActionIcon
            component="a"
            href={ApiURL + '/api/v1/docs'}
            size="sm"
            aria-label="Docs"
            target="_blank"
          >
            <IconApi size={20} />
          </ActionIcon>
          <ActionIcon
            component="a"
            href={ApiURL + '/api/v1/redoc'}
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
