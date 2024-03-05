import { Group, ActionIcon } from '@mantine/core';

import { IconBrandGithub } from '@tabler/icons-react';

import Link from 'next/link';

import SwitchColorScheme from '@/components/SwitchColorScheme/SwitchColorScheme';

export function AuthShellHeader() {
  return (
    <Group w="100%" justify="flex-end" ml={50} gap={10} /*visibleFrom="sm"*/>
      <ActionIcon
        component={Link}
        target="_blank"
        size={42}
        variant="default"
        href="https://github.com/seriohub/velero-ui"
      >
        <IconBrandGithub />
      </ActionIcon>

      <SwitchColorScheme />
    </Group>
  );
}
