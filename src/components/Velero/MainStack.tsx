import { Stack } from '@mantine/core';

export function MainStack({ children }: any) {
  return (
    <Stack h="100%" gap={0} p={10}>
      {children}
    </Stack>
  );
}
