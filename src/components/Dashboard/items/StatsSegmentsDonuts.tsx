import React from 'react';
import { DonutChart } from '@mantine/charts';
import { Text, Group, Center, Card, Title } from '@mantine/core';
import { IconActivity } from '@tabler/icons-react';

interface Segment {
  label: keyof typeof segmentColors;
  count: number;
}

interface StatsSegmentsProps {
  data: { stats: Segment[] };
  title: string;
  path: string;
  icon: any;
}

const segmentColors = {
  Completed: 'green.6',
  Failed: 'red.9',
  'Partial Failed': 'red.7',
  'Failed Validation': 'red.5',
  Deleting: 'gray',
  Unpaused: 'green.6',
  Paused: 'red.9',
};

export function StatsSegmentsDonuts({ data, title, icon, path }: StatsSegmentsProps) {
  const sections = data.stats.map((segment) => ({
    value: segment.count,
    color: segmentColors[segment.label],
    tooltip: segment.label,
    name: segment.label,
  }));

  return (
    <>
      <Card withBorder p="md" radius="md" shadow="sm">
        <Group justify="space-between" align="center" gap="xs">
          <Title order={5} mb={20}>
            {title} status
          </Title>

          <IconActivity size="2rem" stroke="1.5" color="var(--mantine-primary-color-light-color)" />
        </Group>
        <Center>
          {sections.length > 0 && (
            <DonutChart size={160} thickness={25} withLabels labelsType="value" data={sections} />
          )}
          {sections.length === 0 && (
            <Text fw={500} mt={50}>
              Not data found
            </Text>
          )}
        </Center>
      </Card>
    </>
  );
}
