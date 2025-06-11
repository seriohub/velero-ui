import { ActionIcon, Box, Burger, Group, Stack, useComputedColorScheme } from '@mantine/core';

import { IconBrandGithub, IconHeartFilled, IconHelp } from '@tabler/icons-react';
import Link from 'next/link';

import { useServerStatus } from "@/contexts/ServerContext";

import SwitchColorScheme from '@/components/Layout/Header/SwitchColorScheme/SwitchColorScheme';
import CheckAppVersion from '@/components/Layout/Header/CheckAppVersion/CheckAppVersion';
import UserMenu from '@/components/Layout/Header/UserMenu';
import { Logo } from '@/components/Display/Logo';
import { SwitchAgent } from '@/components/Features/Config/SwitchCluster/SwitchAgent';

export function AppShellHeader({
                                 opened,
                                 toggle,
                                 collapsed
                               }: any) {
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const serverValues = useServerStatus();
  return (
    <Stack justify="center" h="100%">
      <Group justify="space-between" p={5}>
        <div>
          <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm"/>
          {collapsed && (<><Logo collapsed={collapsed}/></>)}
        </div>
        {serverValues.isCurrentServerControlPlane && collapsed && (
          <Box w={300}>
            <SwitchAgent/>
          </Box>
        )}
        <Group justify="flex-end" gap={10} visibleFrom="sm">
          <ActionIcon
            component={Link}
            target="_blank"
            size={38}
            variant="transparent"
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
            variant="outline"
            radius={8}
            href="https://github.com/seriohub/velero-ui"
          >
            <IconBrandGithub/>
          </ActionIcon>

          <ActionIcon
            component={Link}
            target="_blank"
            size={38}
            variant="outline"
            radius={8}
            href="https://vui.seriohub.com"
          >
            <IconHelp/>
          </ActionIcon>

          <CheckAppVersion/>
          {/*<PrimaryColorSwitch />*/}
          <SwitchColorScheme/>
          <UserMenu/>
        </Group>
      </Group>
    </Stack>
  );
}
