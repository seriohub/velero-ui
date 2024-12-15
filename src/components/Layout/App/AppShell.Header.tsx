import {
  Group,
  ActionIcon,
  Alert,
  Box,
  Burger,
  Stack,
  Button,
  useComputedColorScheme,
} from '@mantine/core';

import {
  IconInfoCircle,
  IconBrandGithub,
  IconHelp,
  IconHeart,
  IconHeartFilled,
  IconTriangle,
  IconAlertTriangle,
  IconHeartBolt,
  IconHeartCode,
} from '@tabler/icons-react';

import Link from 'next/link';

import SwitchColorScheme from '../../HeaderLink/SwitchColorScheme/SwitchColorScheme';
import CheckAppVersion from '@/components/HeaderLink/CheckAppVersion/CheckAppVersion';
import UserMenu from '@/components/HeaderLink/UserMenu';
import PrimaryColorSwitch from '@/components/Config/UI/PrimaryColorSwitch';

export function AppShellHeader({ opened, toggle, openedUIDrawer, toggleUIDrawer }: any) {
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
            bg={computedColorScheme == 'light' ? '' : 'red'}
          >
            <IconHeartFilled
              style={computedColorScheme == 'light' ? { color: 'red' } : { color: 'white' }}
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
            <IconBrandGithub stroke={2} />
          </ActionIcon>

          <ActionIcon
            component={Link}
            target="_blank"
            size={38}
            variant="default"
            radius={8}
            href="https://vui.seriohub.com"
          >
            <IconHelp stroke={2} />
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
