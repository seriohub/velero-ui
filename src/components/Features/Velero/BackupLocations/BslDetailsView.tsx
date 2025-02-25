import { Box, Card, Divider, Group, ScrollArea, Text } from '@mantine/core';

import VeleroResourceStatusBadge from '@/components/Features/Velero/Commons/Display/VeleroResourceStatusBadge';

export function BslDetailsView({ data }: any) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
      <Card.Section withBorder inheritPadding p="xs">
        <Text fw={600}>Details</Text>
      </Card.Section>
      <Card.Section p="sm">
        <ScrollArea h={600}>
          <Group>
            <Text w={170}>Uid:</Text>
            <Text fw={600}>{data?.metadata.uid}</Text>
          </Group>

          <Divider mt={20} h={20} />
          <Group>
            <Text w={170}>Status:</Text>
            {data?.status?.phase && <VeleroResourceStatusBadge status={data?.status.phase} />}
          </Group>
          <Group mt={10}>
            <Text w={170}>Last Synced Time:</Text>
            <Text fw={600}>{data?.status.lastSyncedTime}</Text>
          </Group>
          <Group mt={10}>
            <Text w={170}>Last Validation Time:</Text>
            <Text fw={600}>{data?.status.lastValidationTime}</Text>
          </Group>
          <Group mt={10}>
            <Text w={170}>Access mode:</Text>
            <Text fw={600}>{data?.spec.accessMode}</Text>
          </Group>

          {data?.status?.message && (
            <>
              <Group mt={10}>
                <Text w={170}>Message:</Text>
                <Box w={500}>
                  <Text fw={600}>{data?.status.message}</Text>
                </Box>
              </Group>
            </>
          )}
        </ScrollArea>
      </Card.Section>
    </Card>
  );
}
