import { Anchor, Box, Card, Group, ScrollArea, Space, Text, Title, Tooltip } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { IconCamera, IconClock, IconDeviceFloppy, IconServer } from '@tabler/icons-react';

import { getExpirationString } from '@/utils/getExpirationString';
import { getDurationDetails } from '@/utils/getDurationDetails';

import VeleroResourceStatusBadge from '@/components/Features/Velero/Commons/Display/VeleroResourceStatusBadge';

function get_duration({ status }: { status: any }) {
  if (status?.startTimestamp && status?.completionTimestamp) {
    const { startTimestamp } = status;
    const { completionTimestamp } = status;
    const { formattedDuration, duration } = getDurationDetails(startTimestamp, completionTimestamp);
    return (
      <Tooltip label={duration} offset={5}>
        <Text fw={600}>{formattedDuration}</Text>
      </Tooltip>
    );
  }
  return <></>;
}

export function BackupDetailsView({ data }: any) {
  const router = useRouter();
  return (
    <Card shadow="sm" padding="lg" radius="md" h={600} withBorder>
      <Card.Section withBorder inheritPadding p="sm">
        <ScrollArea h={550}>
          <Group gap={5}>
            <IconDeviceFloppy size={80} />
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

          {data?.status?.errors && (
            <Group mt={10}>
              <Text w={170}>Error:</Text>

              <Text fw={600}>{data?.status.errors}</Text>
            </Group>
          )}
          {data?.status?.warnings && (
            <Group mt={10}>
              <Text w={170}>Warnings:</Text>
              <Text fw={600}>{data?.status.warnings}</Text>
            </Group>
          )}
          <Group mt={10}>
            <Text w={170}>Expire in</Text>

            <Tooltip label={data?.status?.expiration} offset={5}>
              <Text fw={600}>
                {data?.status?.expiration && <>{getExpirationString(data?.status?.expiration)}</>}
              </Text>
            </Tooltip>
          </Group>

          <Group mt={10}>
            <Text w={170}>Items</Text>
            <Text fw={600}>{data?.status?.progress?.totalItems}</Text>
          </Group>

          {data?.metadata?.labels?.['velero.io/schedule-name'] && (
            <Group mt={10}>
              <Text w={170}>Schedule</Text>

              <Anchor
                size="sm"
                onClick={() => {
                  router.push(`/schedules/${data?.metadata.labels['velero.io/schedule-name']}`);
                }}
              >
                <Group gap={5}>
                  <IconClock size={16} />
                  <Text size="md">{data?.metadata.labels['velero.io/schedule-name']}</Text>
                </Group>
              </Anchor>
            </Group>
          )}

          <Group mt={10}>
            <Text w={170}>Duration</Text>
            {data?.status && <>{get_duration({ status: data?.status })}</>}
          </Group>

          <Group mt={10}>
            <Text w={170}>Included namespaces</Text>
            <Box>
              {data?.spec?.includedNamespaces?.length > 0 ? (
                data.spec.includedNamespaces.map((location: string, index: string) => (
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
            <Text w={170}>Storage Location</Text>
            {data?.spec.storageLocation && (
              <Anchor
                size="sm"
                onClick={() => {
                  router.push(`/backup-storage-locations/${data?.spec.storageLocation}`);
                }}
              >
                <Group gap={5}>
                  <IconServer size={16} />
                  <Text size="md">{data?.spec.storageLocation}</Text>
                </Group>
              </Anchor>
            )}
          </Group>
          <Group mt={10}>
            <Text w={170}>Snapshot Locations</Text>
            <Box>
              {data?.spec.volumeSnapshotLocations?.length > 0 ? (
                data.spec.volumeSnapshotLocations.map((location: string, index: string) => (
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
