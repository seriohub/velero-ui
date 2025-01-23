import { Card, Group, ScrollArea, Text } from '@mantine/core';

export function Details({ data }: any) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
      <Card.Section withBorder inheritPadding p="xs">
        <Text fw={600}>Details</Text>
      </Card.Section>
      <Card.Section p="sm">
        <ScrollArea h={600}>
          <Group>
            <Text w={170}>Uid:</Text>
            <Text fw={600}>{data?.payload?.metadata.uid}</Text>
          </Group>
          <Group mt={10}>
            <Text w={170}>Provider:</Text>
            <Text fw={600}>{data?.payload?.spec.provider}</Text>
          </Group>
        </ScrollArea>
      </Card.Section>
    </Card>
  );
}
