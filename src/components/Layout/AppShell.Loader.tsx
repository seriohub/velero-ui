import { Center, Group, Loader, Stack, Text } from '@mantine/core';

export default function AppShellLoader({ description }: any) {
  return (
    <Stack h="100vh" justify="center" align="center">
      <Center>
        <Group>
          <Loader size="lg"/>
          <Text>{description}</Text>
        </Group>
      </Center>
    </Stack>
  );
}
