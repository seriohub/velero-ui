'use client';

import { useEffect } from 'react';

import { Card, Group, ScrollArea, Text } from '@mantine/core';
import { IconDatabase, IconWeight } from '@tabler/icons-react';
import { useAgentStatus } from '@/contexts/AgentContext';

import { usePodVolumeBackup } from '@/api/PodVolumeBackups/usePodVolumeBackup';

function formatBytes(bytes: number, decimals = 0) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(decimals))} ${sizes[i]}`;
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
      <Group wrap="nowrap" mb={20}>
        <IconDatabase
          stroke={1.5}
          size={92}
          radius="md"
          color="var(--mantine-primary-color-filled)"
        />

        <div>
          <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
            {item.spec.pod.name}
          </Text>

          <Text fz="lg" fw={500}>
            {item.metadata.name}
          </Text>

          <Group wrap="nowrap" gap={10} mt={3}>
            <Text fz="xs" c="dimmed">
              {item.spec.tags.volume}
            </Text>
          </Group>

          <Group wrap="nowrap" gap={10} mt={5}>
            <IconWeight stroke={1.5} size={16} />
            <Text fz="xs" c="dimmed">
              {formatBytes(item.status.progress.totalBytes)}
            </Text>
          </Group>
        </div>
      </Group>
    </>
  ));

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
      <Card.Section withBorder inheritPadding p="xs">
        <Text fw={600}>Pod volumes [{data?.length}]</Text>
      </Card.Section>
      <Card.Section p="sm">
        {!data || (data.length === 0 && <Text>No volumes</Text>)}
        {data && data.length > 0 && <ScrollArea h="600px">{items}</ScrollArea>}
      </Card.Section>
    </Card>
  );
}
