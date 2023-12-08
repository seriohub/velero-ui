'use client';

import { Text, Group } from '@mantine/core';

interface ToolbarProps {
  title: string;
  children: any;
}

export default function Toolbar({ title, children }: ToolbarProps) {
  return (
    <>
      <Group justify="space-between" mb={5}>
        <Text size="md" fw={600}>
          {title}
        </Text>
        <Group gap="xs">{children}</Group>
      </Group>
    </>
  );
}
