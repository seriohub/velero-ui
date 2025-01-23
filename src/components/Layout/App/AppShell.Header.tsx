import { Group, ActionIcon, Burger, Stack, useComputedColorScheme } from '@mantine/core';

import { IconBrandGithub, IconHelp, IconHeartFilled } from '@tabler/icons-react';

import Link from 'next/link';

import SwitchColorScheme from '../../HeaderLink/SwitchColorScheme/SwitchColorScheme';
import CheckAppVersion from '@/components/HeaderLink/CheckAppVersion/CheckAppVersion';
import UserMenu from '@/components/HeaderLink/UserMenu';

export function AppShellHeader({ opened, toggle }: any) {
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  return (
    <Stack justify="center" h="100%">
      <Group justify="space-between" p={5}>
        <div>
          <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
        </div>
        <Group justify="flex-end" gap={10} visibleFrom="sm">
          <ActionIcon
            component={Link}
            target="_blank"
            size={38}
            variant="default"
            radius={8}
            href="https://github.com/sponsors/davideserio"
            bg={computedColorScheme === 'light' ? '' : 'red'}
          >
            <IconHeartFilled
              style={computedColorScheme === 'light' ? { color: 'red' } : { color: 'white' }}
            />
          </ActionIcon>

          <ActionIcon
            component={Link}
            target="_blank"
            size={38}
            variant="default"
            radius={8}
            href="https://github.com/seriohub/velero-ui"
          >
            <IconBrandGithub stroke={1.5} />
          </ActionIcon>

          <ActionIcon
            component={Link}
            target="_blank"
            size={38}
            variant="default"
            radius={8}
            href="https://vui.seriohub.com"
          >
            <IconHelp stroke={1.5} />
          </ActionIcon>

          <CheckAppVersion />
          {/*<PrimaryColorSwitch />*/}
          <SwitchColorScheme />
          <UserMenu />
        </Group>
      </Group>
    </Stack>
  );
}
