'use client';

import { useEffect } from 'react';

import { Card, Group, ScrollArea, Stack, Text } from '@mantine/core';
import { IconArchive, IconWeight } from '@tabler/icons-react';
import { useAgentStatus } from '@/contexts/AgentContext';

import { usePodVolumeBackup } from '@/api/PodVolumeBackups/usePodVolumeBackup';
import VeleroResourceStatusBadge from "@/components/Features/Velero/Commons/Display/VeleroResourceStatusBadge";

function formatBytes(bytes: number, decimals = 0) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(decimals))}${sizes[i]}`;
}

interface PVBSummaryProps {
  backupName: string;
}

export function PVBDetails({ backupName }: PVBSummaryProps) {
  const { data, getPodVolumeBackup } = usePodVolumeBackup();
  const agentValues = useAgentStatus();

  useEffect(() => {
    getPodVolumeBackup(backupName);
  }, [agentValues.isAgentAvailable]);

  const items = data?.map((item: any) => (
    <>
      <Group wrap="nowrap" mb={25} gap={10}>
        <IconArchive
          stroke={1.5}
          size={40}
          radius="md"
          color="var(--mantine-primary-color-filled)"
        />

        <Stack w="100%" gap={0}>
          <Group justify="space-between">
          <Group gap={3}>
            <Text size="xs" c="dimmed" w={60}>
              Name
            </Text>
            <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
              {item.metadata.name}
            </Text>
          </Group>
            {item?.status?.phase && (
            <VeleroResourceStatusBadge status={item?.status?.phase || undefined} />
            )}
          </Group>

          <Group wrap="nowrap" justify="space-between" mt={5}>
            <Group gap={3}>
              <Text size="xs" c="dimmed" w={60}>
                Pod Name
              </Text>
              <Text fz="sm" fw={500}>
                {item.spec.pod.name}
              </Text>
            </Group>

            {item?.status?.progress?.totalBytes && (
            <Group gap={2}>
              <IconWeight stroke={1.5} size={18} />
                <Text fz="sm">{formatBytes(item.status.progress.totalBytes)}</Text>
            </Group>
            )}
          </Group>

          <Group gap={3}>
            <Text size="xs" c="dimmed" mt={5} w={60}>
              Volume
            </Text>
            <Text c="dimmed" size="sm">
              {item.spec.tags.volume}
            </Text>
          </Group>
        </Stack>
      </Group>
    </>
  ));

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder h={600}>
      <Card.Section withBorder inheritPadding p="sm">
        <Text fw={600}>Pod volumes [{data?.length}]</Text>
      </Card.Section>
      <Card.Section p="sm">
        {!data || (data.length === 0 && <Text>No volumes</Text>)}
        {data && data.length > 0 && <ScrollArea h={525}>{items}</ScrollArea>}
      </Card.Section>
    </Card>
  );
}
