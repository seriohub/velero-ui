import { Group, ActionIcon, Alert, Box, Indicator } from '@mantine/core';

import { IconInfoCircle, IconBrandGithub, IconBug } from '@tabler/icons-react';

import Link from 'next/link';

import SwitchColorScheme from '../../SwitchColorScheme/SwitchColorScheme';

export function AppShellHeader() {
  return (
    <Group w="100%" justify="flex-end">
      <Box h={30}>
        <Alert
          variant="filled"
          color="yellow"
          title="Development version. Not optimized on mobile screen. recommended at least 1920 width screen"
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
  );
}
