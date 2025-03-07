import { Box, Card, Group, Space, Text, Title } from '@mantine/core';
import { IconDatabase } from '@tabler/icons-react';

export function SnapshotLocationDetailsView({ data }: any) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder h={600}>
      <Card.Section withBorder inheritPadding p="xs">
        <Text fw={600}>Details</Text>
      </Card.Section>
      <Card.Section p="sm">
        <Group gap={5}>
          <IconDatabase size={80} />
          <Box>
            <Title order={2} fw={800}>
              {data?.metadata?.name}
            </Title>
            <Text size="md" fw={600} c="dimmed">
              {data?.metadata?.uid}
            </Text>
          </Box>
        </Group>
        <Space mt={20} h={20} />

        <Group mt={10}>
          <Text w={170}>Provider</Text>
          <Text fw={600}>{data?.spec?.provider}</Text>
        </Group>
      </Card.Section>
    </Card>
  );
}
