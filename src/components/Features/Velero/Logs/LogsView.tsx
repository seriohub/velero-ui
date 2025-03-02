'use client';

import { Center, Code, Loader } from '@mantine/core';

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
    <Code block h={400}>
      {items.join('\n')}
    </Code>
  );
}
