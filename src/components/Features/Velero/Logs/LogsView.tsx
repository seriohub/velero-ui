'use client';

import { Center, Loader, Text, Stack } from '@mantine/core';

interface LogsProps {
  items: Record<string, any>;
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
      {items?.logs?.map((item: any, index: any) => (
        <Text key={index} size="sm">
          {item}
        </Text>
      ))}
    </Stack>
  );
}
