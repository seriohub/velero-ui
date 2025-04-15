import { Group, ActionIcon, Burger, Stack, useComputedColorScheme, Box } from '@mantine/core';

import { IconBrandGithub, IconHelp, IconHeartFilled } from '@tabler/icons-react';

import Link from 'next/link';

import SwitchColorScheme from '@/components/Layout/Header/SwitchColorScheme/SwitchColorScheme';
import CheckAppVersion from '@/components/Layout/Header/CheckAppVersion/CheckAppVersion';
import UserMenu from '@/components/Layout/Header/UserMenu';
import { Logo } from "@/components/Display/Logo";
import { SwitchAgent } from "@/components/Features/Config/SwitchCluster/SwitchAgent";
import { useServerStatus } from "@/contexts/ServerContext";

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
            <IconBrandGithub stroke={1.5}/>
          </ActionIcon>

          <ActionIcon
            component={Link}
            target="_blank"
            size={38}
            variant="outline"
            radius={8}
            href="https://vui.seriohub.com"
          >
            <IconHelp stroke={1.5}/>
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
