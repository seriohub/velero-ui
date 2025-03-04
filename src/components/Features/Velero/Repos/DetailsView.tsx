import { Anchor, Box, Card, Group, ScrollArea, Space, Text, Title } from '@mantine/core';
import { IconFolders, IconServer } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import VeleroResourceStatusBadge from '@/components/Features/Velero/Commons/Display/VeleroResourceStatusBadge';

export function DetailsView({ data }: any) {
  const router = useRouter();
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder h={600}>
      <Card.Section p="sm">
        <ScrollArea h={600}>
          <Group gap={5}>
            <IconFolders size={80} />
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
            <Text w={180}>Type</Text>
            <Text fw={600}>
              <VeleroResourceStatusBadge status={data?.spec?.repositoryType} />
            </Text>
          </Group>
          <Group mt={10}>
            <Text w={180}>Restic Identifier</Text>
            <Text fw={600} size="sm">
              {data?.spec?.resticIdentifier}
            </Text>
          </Group>
          <Group mt={10}>
            <Text w={180}>Maintenance Frequency</Text>
            <Text fw={600}>{data?.spec?.maintenanceFrequency}</Text>
          </Group>

          <Group mt={10}>
            <Text w={180}>Last Maintenance Time</Text>
            <Text fw={600}>{data?.status?.lastMaintenanceTime}</Text>
          </Group>

          <Group mt={10}>
            <Text w={180}>Storage Location</Text>
            <Text fw={600}>{data?.spec?.backupStorageLocation}</Text>
          </Group>

          <Group mt={10}>
            <Text w={180}>Storage Location</Text>
            {data?.spec?.backupStorageLocation && (
              <Anchor
                size="sm"
                onClick={() => {
                  router.push(`/backup-storage-locations/${data?.spec?.backupStorageLocation}`);
                }}
              >
                <Group gap={5}>
                  <IconServer size={16} />
                  <Text size="md">{data?.spec?.backupStorageLocation}</Text>
                </Group>
              </Anchor>
            )}
          </Group>

          <Group mt={10}>
            <Text w={180}>Volume namespace</Text>
            <Text fw={600}>{data?.spec?.volumeNamespace}</Text>
          </Group>

          {data?.status?.message && (
            <>
              <Group mt={10}>
                <Text w={180}>Message</Text>
                <Box w={500} size="sm">
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
