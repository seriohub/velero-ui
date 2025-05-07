'use client';

import React from 'react';
import { Box, Image, Paper, Stack, Text, Group, Flex } from '@mantine/core';

import {
  IconCalendar,
  IconCheck,
  IconClock,
  IconDeviceFloppy,
  IconPlugConnected,
  IconRestore,
  IconServer
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import styles from './AgentStats.module.css';
import { useAgentStatus } from '@/contexts/AgentContext';
import { getExpirationString } from '@/utils/getExpirationString';

interface AgentStatsProps {
  name: string;
  data: any;
}

export function AgentStats({
                             name,
                             data
                           }: AgentStatsProps) {

  const agentValues = useAgentStatus();

  const router = useRouter();

  function findIndexByKeyValue(array: any, key: string, value: any): number {
    return array.findIndex((obj: { [x: string]: any }) => obj[key] === value);
  }

  function setAgent(agentName: string) {
    const index = findIndexByKeyValue(agentValues.agents, 'name', agentName);
    if (agentValues.agents && agentValues.agents[index] !== agentValues.currentAgent) {
      agentValues.setCurrentAgent(agentValues.agents[index]);
      agentValues.setIsAgentAvailable(undefined);
    }
    router.push('/dashboard');
  }

  return (
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
      <Group gap={20}>
        <Image radius="md" h={160} w="auto" fit="contain" src="/kubernetes_logo.svg"/>

        <Flex gap={5} direction="column">
          <Group justify="space-between">
            <Text fw={800} size="xl">
              {name}
            </Text>
          </Group>

          <Group justify="space-between" gap={60}>

            {/* backups */}
            <Box>
              <Group gap={5}>
                <IconDeviceFloppy size={20}/>
                <Text size="lg" fw={800}>{data?.stats?.backups?.stats?.all?.count}</Text>
                <Text size="sm">
                  Backups
                </Text>
              </Group>
              <Group gap={10}>
                <Group gap={2}>
                  <div>
                    <Text fw={600} size="xl">{data?.stats?.backups?.stats?.all?.stats[0]?.count || 0}</Text>
                    <Text fz="xs" c="dimmed">
                      Completed
                    </Text>
                  </div>
                </Group>
                <Group gap={2}>
                  <div>
                    <Text fw={600} size="xl">{data?.stats?.backups?.stats?.all?.stats[1]?.count || 0}</Text>
                    <Text fz="xs" c="dimmed">
                      Partial Failed
                    </Text>
                  </div>
                </Group>
                <Group gap={2}>
                  <div>
                    <Text fw={600} size="xl">{data?.stats?.backups?.stats?.all?.stats[2]?.count || 0}</Text>
                    <Text fz="xs" c="dimmed">
                      Failed
                    </Text>
                  </div>
                </Group>
              </Group>
            </Box>

            {/* latest */}
            <Box>
              <Group gap={5}>
                <IconClock size={20}/>
                <Text size="lg" fw={800}>{data?.stats?.backups?.stats?.latest?.count}</Text>
                <Text size="sm">
                  Latest
                </Text>
              </Group>
              <Group gap={10}>
                <Group gap={2}>
                  <div>
                    <Text fw={600} size="xl">{data?.stats?.backups?.stats?.latest?.stats[0]?.count || 0}</Text>
                    <Text fz="xs" c="dimmed">
                      Completed
                    </Text>
                  </div>
                </Group>
                <Group gap={2}>
                  <div>
                    <Text fw={600} size="xl">{data?.stats?.backups?.stats?.latest?.stats[1]?.count || 0}</Text>
                    <Text fz="xs" c="dimmed">
                      Partial Failed
                    </Text>
                  </div>
                </Group>
                <Group gap={2}>
                  <div>
                    <Text fw={600} size="xl">{data?.stats?.backups?.stats?.latest?.stats[2]?.count || 0}</Text>
                    <Text fz="xs" c="dimmed">
                      Failed
                    </Text>
                  </div>
                </Group>
              </Group>
            </Box>

            {/* Restore */}
            <Box>
              <Group gap={5}>
                <IconRestore size={20}/>
                <Text size="lg" fw={800}>{data?.stats?.restores?.all?.count}</Text>
                <Text size="sm">
                  Restore
                </Text>
              </Group>
              <Group gap={10}>
                <Group gap={2}>
                  <div>
                    <Text fw={600} size="xl">{data?.stats?.restores?.all?.stats[0]?.count || 0}</Text>
                    <Text fz="xs" c="dimmed">
                      Completed
                    </Text>
                  </div>
                </Group>
                <Group gap={2}>
                  <div>
                    <Text fw={600} size="xl">{data?.stats?.restores?.all?.stats[1]?.count || 0}</Text>
                    <Text fz="xs" c="dimmed">
                      Partial Failed
                    </Text>
                  </div>
                </Group>
                <Group gap={2}>
                  <div>
                    <Text fw={600} size="xl">{data?.stats?.restores?.all?.stats[2]?.count || 0}</Text>
                    <Text fz="xs" c="dimmed">
                      Failed
                    </Text>
                  </div>
                </Group>
              </Group>
            </Box>

            {/* Schedules */}
            <Box>
              <Group gap={5}>
                <IconCalendar size={20}/>
                <Text size="lg" fw={800}>{data?.stats?.schedules?.all?.count}</Text>
                <Text size="sm">
                  Schedule
                </Text>
              </Group>
              <Group gap={10}>
                <Group gap={2}>
                  <div>
                    <Text fw={600} size="xl">{data?.stats?.schedules?.all?.count || 0}</Text>
                    <Text fz="xs" c="dimmed">
                      Total
                    </Text>
                  </div>
                </Group>
                <Group gap={2}>
                  <div>
                    <Text fw={600} size="xl">{data?.stats?.schedules?.all?.stats[0]?.count || 0}</Text>
                    <Text fz="xs" c="dimmed">
                      Unpaused
                    </Text>
                  </div>
                </Group>
                <Group gap={2}>
                  <div>
                    <Text fw={600} size="xl">{data?.stats?.schedules?.all?.stats[1]?.count || 0}</Text>
                    <Text fz="xs" c="dimmed">
                      Paused
                    </Text>
                  </div>
                </Group>
              </Group>
            </Box>
          </Group>

          <Group justify="space-between" gap={10} mt={10}>
            <Group gap={30}>
              <Group gap={2}>
                <IconPlugConnected size={22} color="green"/>
                <Text size="sm" fw={500}>
                  connected
                </Text>
              </Group>
              <Group gap={5}>
                <IconServer size={22}/>
                <Text size="sm" fw={500}>
                  {data?.health?.nodes?.total}
                </Text>
                <Text size="sm" fw={500}>
                  nodes
                </Text>
              </Group>
              <Group gap={5}>
                <IconServer size={22} color="red"/>
                <Text size="sm" fw={500}>
                  {data?.health?.nodes?.in_error}
                </Text>
                <Text size="sm" fw={500}>
                  in error
                </Text>
              </Group>
            </Group>
            <Text size="sm" fw={500} c="green">
              {getExpirationString(data?.status?.expiration)}
            </Text>
          </Group>
        </Flex>
      </Group>
    </Paper>
  );
}
