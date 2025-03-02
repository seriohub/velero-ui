import { Box, Card, Group, ScrollArea, Space, Text, Title } from '@mantine/core';

import { IconServer } from '@tabler/icons-react';
import VeleroResourceStatusBadge from '@/components/Features/Velero/Commons/Display/VeleroResourceStatusBadge';

export function BslDetailsView({ data }: any) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder h={600}>
      <Card.Section p="sm">
        <ScrollArea h={600}>
          <Group gap={5}>
            <IconServer size={80} />
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
          <Group>
            <Text w={170}>Status</Text>
            {data?.status?.phase && <VeleroResourceStatusBadge status={data?.status.phase} />}
          </Group>
          <Group mt={10}>
            <Text w={170}>Last Synced Time</Text>
            <Text fw={600}>{data?.status?.lastSyncedTime}</Text>
          </Group>
          <Group mt={10}>
            <Text w={170}>Last Validation Time</Text>
            <Text fw={600}>{data?.status?.lastValidationTime}</Text>
          </Group>
          <Group mt={10}>
            <Text w={170}>Access mode</Text>
            <Text fw={600}>{data?.spec?.accessMode}</Text>
          </Group>

          <Group mt={10}>
            <Text w={170}>Backup Sync Period</Text>
            <Text fw={600}>{data?.spec?.backupSyncPeriod}</Text>
          </Group>
          <Group mt={10}>
            <Text w={170}>Validation Frequency</Text>
            <Text fw={600}>{data?.spec?.validationFrequency}</Text>
          </Group>

          <Group mt={10}>
            <Text w={170}>Provider</Text>
            <Text fw={600}>{data?.spec?.provider}</Text>
          </Group>

          <Group mt={10}>
            <Text w={170}>Bucket</Text>
            <Text fw={600}>{data?.spec?.objectStorage.bucket}</Text>
          </Group>
          <Group mt={10}>
            <Text w={170}>Prefix</Text>
            <Text fw={600}>{data?.spec?.objectStorage.prefix}</Text>
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
