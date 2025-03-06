'use client';

import { Center, Loader, Text, Stack } from '@mantine/core';

interface LogsProps {
  items: Array<any>;
  fetching: boolean;
}

export function LogsView({ items = [], fetching }: LogsProps) {
  if (fetching) {
    return (
      <Center mt={50}>
        <Loader />
      </Center>
    );
  }

  return (
    <Stack h={400} gap={0}>
      {items.map((item, index) => (
        <Text key={index} size="sm">{item}</Text>
      ))}
    </Stack>
  );
}
