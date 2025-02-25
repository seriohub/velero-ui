'use client';

import { useState } from 'react';
import { ActionIcon, Text, Group } from '@mantine/core';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

export function MaskedService({ service }: { service: string }) {
  const [visible, setVisible] = useState(false);

  const maskUrl = (input: string) => {
    const parts = input.split('://');
    if (parts.length === 2) {
      return `${parts[0]}://********`;
    }
    return input;
  };

  return (
    <Group>
      <ActionIcon variant="outline" onClick={() => setVisible((v) => !v)}>
        {visible ? <IconEyeOff /> : <IconEye />}
      </ActionIcon>
      <Text>{visible ? service : maskUrl(service)}</Text>
    </Group>
  );
}
