import React from 'react';
import { DonutChart } from '@mantine/charts';
import { Text, Group, Center, Card, Title, Anchor } from '@mantine/core';
import { IconActivity } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
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
          <Group gap={5}>
            {icon}
            <Title order={3}>{title}</Title>
          </Group>

          <Anchor
            href="#"
            onClick={() => {
              router.push(path);
            }}
            underline="never"
          >
            <IconActivity
              size="2rem"
              stroke="1.5"
              color="var(--mantine-primary-color-light-color)"
            />
          </Anchor>
        </Group>
        <Center py={30}>
          {sections.length > 0 && (
            <DonutChart
              size={200}
              thickness={30}
              labelsType="value"
              data={sections}
              paddingAngle={1}
            />
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
