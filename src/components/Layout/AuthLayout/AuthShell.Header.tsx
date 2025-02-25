import { Group, ActionIcon } from '@mantine/core';

import { IconBrandGithub } from '@tabler/icons-react';

import Link from 'next/link';

import SwitchColorScheme from '@/components/Layout/Header/SwitchColorScheme/SwitchColorScheme';

export function AuthShellHeader() {
  return (
    <Group w="100%" justify="flex-end" gap={10} p={15}>
      <ActionIcon
        component={Link}
        target="_blank"
        size={38}
        radius={8}
        variant="outline"
        href="https://github.com/seriohub/velero-ui"
      >
        <IconBrandGithub />
      </ActionIcon>

      <SwitchColorScheme />
    </Group>
  );
}
