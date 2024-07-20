'use client';

import React from 'react';
import { Box, Image, Paper, Stack } from '@mantine/core';

import { Card, Text, Group, RingProgress, Center } from '@mantine/core';
import {
  IconAffiliate,
  IconCheck,
  IconDeviceFloppy,
  IconPlugConnected,
  IconServer,
} from '@tabler/icons-react';
import styles from './AgentStats.module.css';
import { useAgentStatus } from '@/contexts/AgentStatusContext';
import { useRouter } from 'next/navigation';
import ExpireIn from '@/components/Backup/ExpireIn';

interface AgentStatsProps {
  name: string;
  data: any;
}
export function AgentStats({ name, data }: AgentStatsProps) {
  const agentValues = useAgentStatus();

  const router = useRouter();
  function findIndexByKeyValue(array: any, key: string, value: any): number {
    return array.findIndex((obj: { [x: string]: any }) => obj[key] === value);
  }

  function setAgent(agentName: string) {
    const index = findIndexByKeyValue(agentValues.agents, 'name', agentName);
    if (agentValues.agents && agentValues.agents[index] !== agentValues.currentAgent) {
      router.push('/dashboard');
      agentValues.setCurrentAgent(agentValues.agents[index]);
      //agentValues.setIsAgentAvailable(undefined);
    }
  }

  return (
    <>
      <Paper
        withBorder
        p="md"
        radius="md"
        key={name}
        className={styles.element}
        onClick={() => {
          setAgent(name);
        }}
      >
        <Group>
          <Image radius="md" h={100} w="auto" fit="contain" src="./kubernetes_logo.svg" />
          <Stack>
            <Group justify="space-between">
              <Text fw={800} size="md">
                {name}
              </Text>
            </Group>
            <Group justify="space-between" gap={50}>
              {/* backups */}
              <Box>
                <Text size="sm" mb={3}>
                  Backups
                </Text>
                <Group>
                  <Group gap={2}>
                    <div>
                      <Text fw={800}>{data?.stats?.backups?.stats?.all?.stats[0].count}</Text>
                      <Text fz="xs" c="dimmed">
                        Completed
                      </Text>
                    </div>
                  </Group>
                  <Group gap={2}>
                    <div>
                      <Text fw={800}>{data?.stats?.backups?.stats?.all?.stats[1].count}</Text>
                      <Text fz="xs" c="dimmed">
                        Partial Failed
                      </Text>
                    </div>
                  </Group>
                  <Group gap={2}>
                    <div>
                      <Text fw={800}>{data?.stats?.backups?.stats?.all?.stats[2].count}</Text>
                      <Text fz="xs" c="dimmed">
                        Failed
                      </Text>
                    </div>
                  </Group>
                </Group>
              </Box>
              {/* latest */}
              <Box>
                <Text size="sm" mb={3}>
                  Latest
                </Text>
                <Group>
                  <Group gap={2}>
                    <div>
                      <Text fw={800}>{data?.stats?.backups?.stats?.latest?.stats[0].count}</Text>
                      <Text fz="xs" c="dimmed">
                        Completed
                      </Text>
                    </div>
                  </Group>
                  <Group gap={2}>
                    <div>
                      <Text fw={800}>{data?.stats?.backups?.stats?.latest?.stats[1].count}</Text>
                      <Text fz="xs" c="dimmed">
                        Partial Failed
                      </Text>
                    </div>
                  </Group>
                  <Group gap={2}>
                    <div>
                      <Text fw={800}>{data?.stats?.backups?.stats?.latest?.stats[2].count}</Text>
                      <Text fz="xs" c="dimmed">
                        Failed
                      </Text>
                    </div>
                  </Group>
                </Group>
              </Box>
              {/* Restore */}
              <Box>
                <Text size="sm" mb={3}>
                  Restore
                </Text>
                <Group>
                  <Group gap={2}>
                    <div>
                      <Text fw={800}>{data?.stats?.restores?.all?.stats[0].count}</Text>
                      <Text fz="xs" c="dimmed">
                        Completed
                      </Text>
                    </div>
                  </Group>
                  <Group gap={2}>
                    <div>
                      <Text fw={800}>{data?.stats?.restores?.all?.stats[1].count}</Text>
                      <Text fz="xs" c="dimmed">
                        Partial Failed
                      </Text>
                    </div>
                  </Group>
                  <Group gap={2}>
                    <div>
                      <Text fw={800}>{data?.stats?.restores?.all?.stats[2].count}</Text>
                      <Text fz="xs" c="dimmed">
                        Failed
                      </Text>
                    </div>
                  </Group>
                </Group>
              </Box>
              {/* Schedule */}
              <Box>
                <Text size="sm" mb={3}>
                  Schedule
                </Text>
                <Group>
                  <Group gap={2}>
                    <div>
                      <Text fw={500}>{data?.stats?.schedules?.all?.count}</Text>
                      <Text fz="xs" c="dimmed">
                        Total
                      </Text>
                    </div>
                  </Group>
                  <Group gap={2}>
                    <div>
                      <Text fw={500}>{data?.stats?.schedules?.all?.stats[0].count}</Text>
                      <Text fz="xs" c="dimmed">
                        Unpaused
                      </Text>
                    </div>
                  </Group>
                  <Group gap={2}>
                    <div>
                      <Text fw={500}>{data?.stats?.schedules?.all?.stats[1].count}</Text>
                      <Text fz="xs" c="dimmed">
                        Paused
                      </Text>
                    </div>
                  </Group>
                </Group>
              </Box>
            </Group>
            <Group justify="space-between">
              <Group>
                <Group gap={5}>
                  <IconPlugConnected size={18} />
                  <Text size="sm" fw={500}>
                    k8s online
                  </Text>
                  <IconCheck color="green" />
                </Group>
                <Group gap={5}>
                  <IconServer size={18} />
                  <Text size="sm" fw={500}>
                    nodes
                  </Text>
                  <Text size="sm" fw={500}>
                    {data?.health?.nodes?.total}
                  </Text>
                </Group>
                <Group gap={5}>
                  <IconServer size={18} />
                  <Text size="sm" fw={500}>
                    in error
                  </Text>
                  <Text size="sm" fw={500}>
                    {data?.health?.nodes?.in_error}
                  </Text>
                </Group>
              </Group>
              <Text size="sm" fw={500} c='green'>
                <ExpireIn expiration={data?.health?.timestamp} />
              </Text>
            </Group>
          </Stack>
        </Group>
      </Paper>
    </>
  );
}
