'use client';

import React from 'react';

import { Card, Text, Group, RingProgress, Center } from '@mantine/core';

interface BackupsStatsProps {
  stats: any;
  title: string;
}
export function BackupsStats({ stats, title }: BackupsStatsProps) {
  const values = () => {
    const tmp = [];
    tmp.push({
      value: (stats.completed_backup_count / stats.backups_count) * 100,
      color: 'green',
      tooltip: 'Completed',
    });
    tmp.push({
      value: (stats.partial_failed_backup_count / stats.backups_count) * 100,
      color: 'yellow',
      tooltip: 'Partially failed',
    });
    tmp.push({
      value: (stats.failed_backup_count / stats.backups_count) * 100,
      color: 'red',
      tooltip: 'Failed',
    });
    return tmp;
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="xs" withBorder style={{ width: '30rem' }}>
        <Card.Section withBorder inheritPadding py="xs">
          <Group justify="space-between">
            <Text fw={500}>{title}</Text>
          </Group>
        </Card.Section>
        <Center>
          <RingProgress
            size={200}
            //size={stats.backups_count}
            thickness={24}
            label={
              <Text size="xs" ta="center" px="xs" style={{ pointerEvents: 'none' }}>
                Hover sections to see detail
              </Text>
            }
            sections={values()}
          />
        </Center>
        <Group justify="space-between" mt="md" mb="xs" gap={20}>
          <Text fw={500}>Total count backup</Text>
          <Text fw={800}>{stats.backups_count}</Text>
        </Group>
        <Group justify="space-between" mb="xs">
          <Group gap={5}>
            <Text fw={500}>Total count backup</Text>
            <Text fw={800} c="green">
              Completed
            </Text>
          </Group>
          <Text fw={800}>{stats.completed_backup_count}</Text>
        </Group>
        <Group justify="space-between" mb="xs">
          <Group gap={5}>
            <Text fw={500}>Total count backup</Text>
            <Text fw={800} c="orange">
              Partially Failed
            </Text>
          </Group>
          <Text fw={800}>{stats.partial_failed_backup_count}</Text>
        </Group>
        <Group justify="space-between" mb="xs">
          <Group gap={5}>
            <Text fw={500}>Total count backup</Text>
            <Text fw={800} c="red">
              Failed
            </Text>
          </Group>
          <Text fw={800}>{stats.failed_backup_count}</Text>
        </Group>
        <Group justify="space-between" mt="md" mb="xs">
          <Text fw={500}>Total count backup from scheduled</Text>
          <Text fw={800}>{stats.scheduled_backup_count}</Text>
        </Group>
      </Card>
    </>
  );
}
