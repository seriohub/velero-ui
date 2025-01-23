import React from 'react';

import { Text, Group, Card, Button, CardSection } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { IconChevronRight } from '@tabler/icons-react';

interface Segment {
  value: number;
  label: keyof typeof segmentColors;
}

interface StatsSegmentsProps {
  data: {
    stats: Segment[];
    count: number;
    from_schedule_count: number;
  };
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

export function StatsSegments({ data, title, icon, path }: StatsSegmentsProps) {
  const router = useRouter();

  return (
    <Card withBorder p="md" radius="md" shadow="sm">
      <Group justify="space-between" gap="xs">
        <Group align="baseline">
          <Text size="4rem" fw={800}>
            {data.count}
          </Text>

          {data.from_schedule_count > 0 && (
            <Text size="md" fw={500}>
              ({data.from_schedule_count} from schedule)
            </Text>
          )}
        </Group>

        {React.cloneElement(icon, {
          size: '3rem',
          color: 'var(--mantine-primary-color-light-color)',
          stroke: '1.5',
        })}
      </Group>

      <Text size="md" c="dimmed">
        {title}
      </Text>

      <CardSection>
        <Button
          variant="transparent"
          rightSection={<IconChevronRight size={18} />}
          onClick={() => {
            router.push(path);
          }}
        >
          View All
        </Button>
      </CardSection>
    </Card>
  );
}
