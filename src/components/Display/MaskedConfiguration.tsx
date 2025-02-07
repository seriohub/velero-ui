'use client';

import { useState } from 'react';
import { ActionIcon, Text, Group } from '@mantine/core';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

export function MaskedConfiguration({ service }: { service: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <Group gap={5}>
      <ActionIcon variant="transparent" onClick={() => setVisible((v) => !v)}>
        {visible ? <IconEyeOff /> : <IconEye />}
      </ActionIcon>
      <Text>{visible ? service : '*******'}</Text>
    </Group>
  );
}
