import { Group, ActionIcon, Alert, Box } from '@mantine/core';

import { IconInfoCircle, IconBrandGithub, IconBug } from '@tabler/icons-react';

import Link from 'next/link';

import SwitchColorScheme from '../SwitchColorScheme/SwitchColorScheme';

export function AppShellHeader() {
  return (
    <Group w="100%" justify="flex-end">
      <Box h={30}>
        <Alert
          variant="filled"
          color="yellow"
          title="Development version. Not optimized on mobile screen."
          icon={<IconInfoCircle />}
          p={8}
        />
      </Box>
      <Group>
        <Group ml={50} gap={10} visibleFrom="sm">
          <ActionIcon
            component={Link}
            target="_blank"
            size={42}
            variant="default"
            href="https://github.com/seriohub/velero-ui"
          >
            <IconBrandGithub />
          </ActionIcon>
          <ActionIcon
            component={Link}
            target="_blank"
            size={42}
            variant="default"
            href="https://github.com/seriohub/velero-ui/issues"
          >
            <IconBug />
          </ActionIcon>
        </Group>
      </Group>
      <SwitchColorScheme />
    </Group>
  );
}
