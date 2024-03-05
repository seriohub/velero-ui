import { Group, ActionIcon, Alert, Box, Burger } from '@mantine/core';

import { IconInfoCircle, IconBrandGithub } from '@tabler/icons-react';

import Link from 'next/link';

import SwitchColorScheme from '../../SwitchColorScheme/SwitchColorScheme';

export function AppShellHeader({ opened, toggle }: any) {
  
  return (
    <Group justify="space-between" p={5}>
      <div>
        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </div>
      <Group justify="flex-end">
        <Box h={30}>
          <Alert
            visibleFrom="md"
            variant="filled"
            color="yellow"
            title="Develop version: UI not fully responsive."
            icon={<IconInfoCircle />}
            p={8}
          />
        </Box>
        <Group>
          <Group ml={50} gap={15} visibleFrom="sm">
            {/*<Indicator position="bottom-end" radius="xs" size={20} label="API">
            <ActionIcon
              component={Link}
              target="_blank"
              size={42}
              variant="default"
              href="https://github.com/seriohub/velero-api"
            >
              <IconBrandGithub />
            </ActionIcon>
          </Indicator>
          <Indicator position="bottom-end" radius="xs" size={20} label="UI">*/}
            <ActionIcon
              component={Link}
              target="_blank"
              size={42}
              variant="default"
              href="https://github.com/seriohub/velero-ui"
            >
              <IconBrandGithub />
            </ActionIcon>
            {/*</Indicator>
          <ActionIcon
            component={Link}
            target="_blank"
            size={42}
            variant="default"
            href="https://github.com/seriohub/velero-ui/issues"
          >
            <IconBug />
          </ActionIcon>*/}
          </Group>
        </Group>
        <SwitchColorScheme />
      </Group>
    </Group>
  );
}
