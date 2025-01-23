import { Box, Card, Divider, Group, ScrollArea, Text } from '@mantine/core';
import VeleroResourceStatusBadge from '@/components/Velero/VeleroResourceStatusBadge';

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

          <Divider mt={20} h={20} />
          <Group>
            <Text w={170}>Status:</Text>
            {data?.payload?.status?.phase && (
              <VeleroResourceStatusBadge status={data?.payload?.status.phase} />
            )}
          </Group>
          <Group mt={10}>
            <Text w={170}>Last Synced Time:</Text>
            <Text fw={600}>{data?.payload?.status.lastSyncedTime}</Text>
          </Group>
          <Group mt={10}>
            <Text w={170}>Last Validation Time:</Text>
            <Text fw={600}>{data?.payload?.status.lastValidationTime}</Text>
          </Group>
          <Group mt={10}>
            <Text w={170}>Access mode:</Text>
            <Text fw={600}>{data?.payload?.spec.accessMode}</Text>
          </Group>

          {data?.payload?.status?.message && (
            <>
              <Group mt={10}>
                <Text w={170}>Message:</Text>
                <Box w={500}>
                  <Text fw={600}>{data?.payload?.status.message}</Text>
                </Box>
              </Group>
            </>
          )}
        </ScrollArea>
      </Card.Section>
    </Card>
  );
}
