import { Anchor, Box, Card, Divider, Group, ScrollArea, Text } from '@mantine/core';
import { IconCamera, IconServer } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import VeleroResourceStatusBadge from '@/components/Features/Velero/Commons/Display/VeleroResourceStatusBadge';

export function ScheduleDetailsView({ data }: any) {
  const router = useRouter();
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
      <Card.Section withBorder inheritPadding p="xs">
        <Text fw={600}>Details</Text>
      </Card.Section>
      <Card.Section p="sm">
        <ScrollArea>
          <Group>
            <Text w={170}>Uid:</Text>
            <Text fw={600}>{data?.metadata.uid}</Text>
          </Group>
          <Group mt={10}>
            <Text w={170}>Cron:</Text>
            <Text fw={600}>{data?.spec.schedule}</Text>
          </Group>
          <Divider mt={20} h={20} />
          <Group>
            <Text w={170}>Status:</Text>
            {data?.status?.phase && <VeleroResourceStatusBadge status={data?.status.phase} />}
          </Group>
          <Group mt={10}>
            <Text w={170}>Last Backup:</Text>
            <Text fw={600}>{data?.status?.lastBackup || '-'}</Text>
          </Group>

          <Divider mt={20} h={20} />
          <Group>
            <Text w={170}>Included namespaces:</Text>
            <Box>
              {data?.spec?.template?.includedNamespaces?.length > 0 ? (
                data.spec.template.includedNamespaces.map((location: string, index: string) => (
                  <Text fw={600} key={index}>
                    {location}
                  </Text>
                ))
              ) : (
                <Text fw={600}>-</Text>
              )}
            </Box>
          </Group>
          <Group mt={10}>
            <Text w={170}>Storage Location:</Text>
            {data?.spec?.template?.storageLocation && (
              <Anchor
                size="sm"
                onClick={() => {
                  router.push(`/backup-storage-locations/${data?.spec?.template?.storageLocation}`);
                }}
              >
                <Group gap={5}>
                  <IconServer size={16} />
                  <Text size="md">{data?.spec?.template?.storageLocation}</Text>
                </Group>
              </Anchor>
            )}
          </Group>
          <Group mt={10}>
            <Text w={170}>Snapshot Locations:</Text>
            <Box>
              {data?.spec.template?.volumeSnapshotLocations?.length > 0 ? (
                data?.spec.template?.volumeSnapshotLocations.map(
                  (location: string, index: string) => (
                    <Anchor
                      size="sm"
                      onClick={() => {
                        router.push(`/volume-snapshot-locations/${location}`);
                      }}
                      key={index}
                    >
                      <Group gap={5}>
                        <IconCamera size={16} />
                        <Text size="md"> {location}</Text>
                      </Group>
                    </Anchor>
                  )
                )
              ) : (
                <></>
              )}
            </Box>
          </Group>
        </ScrollArea>
      </Card.Section>
    </Card>
  );
}
