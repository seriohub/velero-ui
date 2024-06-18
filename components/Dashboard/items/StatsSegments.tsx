import React from 'react';
import { DonutChart } from '@mantine/charts';

import { Box, Text, Group, Paper, SimpleGrid, RingProgress, Center, Card } from '@mantine/core';

import classes from './StatsSegments.module.css';
import { Donut } from './Donut';

interface StatsSegmentsProps {
  data: any;
  title: string;
  icon: any;
}

export function StatsSegments({ data, title, icon }: StatsSegmentsProps) {
  /*const segments = data.stats.map((segment: any) => (
    <Progress.Section value={segment.perc} color={segment.color} key={segment.color}>
      {segment.perc > 10 && <Progress.Label>{segment.perc}%</Progress.Label>}
    </Progress.Section>
  ));*/

  const sections = data.stats.map((segment: any) => ({
    value: segment.perc,
    color: segment.color,
    tooltip: segment.label,
    name: segment.label,
  }));
  // console.log(sections);

  const descriptions = data.stats.map((stat: any) => (
    <Box key={stat.label} style={{ borderBottomColor: stat.color }} className={classes.stat}>
      <Text tt="uppercase" fz="xs" c="dimmed" fw={700}>
        {stat.label}
      </Text>

      <Group justify="space-between" align="flex-end" gap={0}>
        <Text fw={700}>{stat.count}</Text>
        <Text c={stat.color} fw={700} size="sm" className={classes.statCount}>
          {stat.perc}%
        </Text>
      </Group>
    </Box>
  ));

  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between">
        <Text size="md" c="dimmed" className={classes.title}>
          {title}
        </Text>
        {React.cloneElement(icon, { size: '2rem', className: classes.icon, stroke: '1.5' })}
      </Group>

      {/*<Group align="flex-end" gap="xs" mt={25}>
        <Text className={classes.value}>{data.count}</Text>
        {data.from_schedule_count > 0 && (
          <Text c="teal" className={classes.diff} fz="sm" fw={500}>
            <span>{data.from_schedule_count} from schedule</span>
          </Text>
        )}
      </Group>*/}
      <Center>
        <RingProgress
          size={180}
          label={
            <>
              <Group align="center" justify="center" gap="xs" style={{ pointerEvents: 'none' }}>
                <Text size="4rem" fw={800}>
                  {data.count}
                </Text>
              </Group>
              {/*<Text size="xs" ta="center" px="xs" style={{ pointerEvents: 'none' }}>
          Backups
      </Text>*/}
            </>
          }
          sections={sections}
        />
      </Center>

      {/*<Progress.Root size={20} classNames={{ label: classes.progressLabel }} mt={50}>
        {segments}
    </Progress.Root>*/}
      {/*<SimpleGrid cols={{ base: 1, xs: data.stats.length }} mt="xl">
        {descriptions}
      </SimpleGrid>**/}
      {/*<Donut data={sections}/>*/}
    </Paper>
  );
}
