import { Anchor, Box, Card, Divider, Group, ScrollArea, Text, Tooltip } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { IconCamera, IconClock, IconServer } from '@tabler/icons-react';
import ExpireIn from '@/components/Velero/Backups/ExpireIn';
import Duration from '@/components/Velero/Backups/Duration';
import VeleroResourceStatusBadge from '@/components/Velero/VeleroResourceStatusBadge';

function get_duration({ status }: { status: any }) {
  if (status?.startTimestamp && status?.completionTimestamp) {
    const { startTimestamp } = status;
    const { completionTimestamp } = status;
    const { formattedDuration, duration } = Duration({
      startTimestamp,
      completionTimestamp,
    });
    return (
      <Tooltip label={duration} offset={5}>
        <Text fw={600}>{formattedDuration}</Text>
      </Tooltip>
    );
  }
  return <></>;
}

export function Details({ data }: any) {
  const router = useRouter();
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

          {data?.payload?.metadata?.labels['velero.io/schedule-name'] && (
            <Group mt={10}>
              <Text w={170}>Schedule:</Text>

              <Anchor
                size="sm"
                onClick={() => {
                  router.push(
                    `/schedules/${data?.payload.metadata.labels['velero.io/schedule-name']}`
                  );
                }}
              >
                <Group gap={5}>
                  <IconClock size={16} />
                  <Text size="md">{data?.payload.metadata.labels['velero.io/schedule-name']}</Text>
                </Group>
              </Anchor>
            </Group>
          )}
          <Divider mt={20} h={20} />
          <Group>
            <Text w={170}>Status:</Text>
            {data?.payload?.status?.phase && (
              <VeleroResourceStatusBadge status={data?.payload?.status.phase} />
            )}
          </Group>
          {data?.payload?.status.errors && (
            <Group mt={10}>
              <Text w={170}>Error:</Text>

              <Text fw={600}>{data?.payload?.status.errors}</Text>
            </Group>
          )}
          {data?.payload?.status.warnings && (
            <Group mt={10}>
              <Text w={170}>Warnings:</Text>
              <Text fw={600}>{data?.payload?.status.warnings}</Text>
            </Group>
          )}
          <Group mt={10}>
            <Text w={170}>Duration:</Text>
            {data?.payload?.status && <>{get_duration({ status: data?.payload?.status })}</>}
          </Group>
          <Group mt={10}>
            <Text w={170}>Expire in:</Text>

            <Tooltip label={data?.payload?.status.expiration} offset={5}>
              <Text fw={600}>
                {data?.payload?.status.expiration && (
                  <ExpireIn expiration={data?.payload?.status.expiration} />
                )}
              </Text>
            </Tooltip>
          </Group>
          <Group mt={10}>
            <Text w={170}>Items:</Text>
            <Text fw={600}>{data?.payload?.status?.progress?.totalItems}</Text>
          </Group>
          <Divider mt={20} h={20} />
          <Group>
            <Text w={170}>Included namespaces:</Text>
            <Box>
              {data?.payload?.spec?.includedNamespaces?.length > 0 ? (
                data.payload.spec.includedNamespaces.map((location: string, index: string) => (
                  <Text fw={600} key={index}>
                    {location}
                  </Text>
                ))
              ) : (
                <Text fw={600}></Text>
              )}
            </Box>
          </Group>
          <Group mt={10}>
            <Text w={170}>Storage Location:</Text>
            {data?.payload?.spec.storageLocation && (
              <Anchor
                size="sm"
                onClick={() => {
                  router.push(`/backup-storage-locations/${data?.payload?.spec.storageLocation}`);
                }}
              >
                <Group gap={5}>
                  <IconServer size={16} />
                  <Text size="md">{data?.payload?.spec.storageLocation}</Text>
                </Group>
              </Anchor>
            )}
          </Group>
          <Group mt={10}>
            <Text w={170}>Snapshot Locations:</Text>
            <Box>
              {data?.payload?.spec.volumeSnapshotLocations?.length > 0 ? (
                data.payload.spec.volumeSnapshotLocations.map((location: string, index: string) => (
                  <Anchor
                    size="sm"
                    onClick={() => {
                      router.push(`/volume-snapshot-locations/${location}`);
                    }}
                    key={index}
                  >
                    <Group gap={5}>
                      <IconCamera size={16} />
                      <Text size="md">{location}</Text>
                    </Group>
                  </Anchor>
                ))
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
