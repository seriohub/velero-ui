'use client';

import { useEffect } from 'react';

import { Card, Flex, Group, Paper, ScrollArea, Stack, Text } from '@mantine/core';

import { useAgentStatus } from '@/contexts/AgentContext';

import { usePodVolumeBackup } from '@/api/PodVolumeBackups/usePodVolumeBackup';
import VeleroResourceStatusBadge from '@/components/Features/Velero/Commons/Display/VeleroResourceStatusBadge';

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
      <Paper withBorder mb={25}>
        <Flex>
          <Stack w="100%" gap={0} p={5}>
            <Group justify="flex-end">
              {item?.status?.phase && (
                <VeleroResourceStatusBadge status={item?.status?.phase || undefined} />
              )}
            </Group>

            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" w={60}>
                  Name
                </Text>
                <Text fz="sm" fw={700} c="dimmed">
                  {item.metadata.name}
                </Text>
              </div>
              <div>
                {item?.status?.progress?.totalBytes && (
                  <div>
                    <Text size="xs" c="dimmed" mt={5} w={60} ta="right">
                      Size
                    </Text>
                    <Text c="dimmed" size="sm" ta="right">
                      {formatBytes(item.status.progress.totalBytes)}
                    </Text>
                  </div>
                )}
              </div>
            </Group>

            <div>
              <Text size="xs" c="dimmed" w={60} mt={5}>
                Pod Name
              </Text>
              <Text fz="sm" fw={500} size="sm">
                {item.spec.pod.name}
              </Text>
            </div>

            <div>
              <Text size="xs" c="dimmed" mt={5} w={60}>
                Volume
              </Text>
              <Text c="dimmed" size="sm">
                {item.spec.tags.volume}
              </Text>
            </div>
          </Stack>
        </Flex>
      </Paper>
    </>
  ));
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder h={600}>
      <Card.Section withBorder inheritPadding p="sm">
        <Text fw={600}>Pod volumes [{data?.length}]</Text>
      </Card.Section>
      <Card.Section p={0}>
        {!data || (data.length === 0 && <Text size="sm">No volumes</Text>)}
        {data && data.length > 0 && (
          <ScrollArea h={525} p="sm">
            {items}
          </ScrollArea>
        )}
      </Card.Section>
    </Card>
  );
}
