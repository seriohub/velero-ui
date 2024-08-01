import { ActionIcon } from '@mantine/core';
import { IconHelp } from '@tabler/icons-react';

import Link from 'next/link';

export default function Help() {
  return (
    <ActionIcon
      component={Link}
      target="_blank"
      size={40}
      variant="default"
      radius={8}
      href="https://vui.seriohub.com"
    >
      <IconHelp />
    </ActionIcon>
  );
}
