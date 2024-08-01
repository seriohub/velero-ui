import { Group, ActionIcon, Alert, Box, Burger, Stack } from '@mantine/core';

import { IconInfoCircle, IconBrandGithub, IconHelp } from '@tabler/icons-react';

import Link from 'next/link';

import SwitchColorScheme from '../../SwitchColorScheme/SwitchColorScheme';
import CheckAppVersion from '@/components/CheckAppVersion/CheckAppVersion';
import Help from '@/components/Help/Help';

export function AppShellHeader({ opened, toggle }: any) {
  return (
    <Stack justify="center" h="100%">
      <Group justify="space-between" p={5}>
        <div>
          <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
        </div>
        <Group justify="flex-end" gap={10} visibleFrom="sm">
          <Box>
            <Alert
              visibleFrom="md"
              variant="filled"
              color="yellow"
              title="Develop version: UI not fully responsive."
              icon={<IconInfoCircle />}
              p={5}
            />
          </Box>

          <ActionIcon
            component={Link}
            target="_blank"
            size={40}
            variant="default"
            radius={8}
            href="https://github.com/seriohub/velero-ui"
          >
            <IconBrandGithub />
          </ActionIcon>
          <Help />
          <CheckAppVersion />
          <SwitchColorScheme />
        </Group>
      </Group>
    </Stack>
  );
}
