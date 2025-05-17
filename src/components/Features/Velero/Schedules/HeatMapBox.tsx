'use client';

import { useEffect, useState } from 'react';

import { Box, Center, Group, List, Space, Tabs, Text, ThemeIcon, rem } from '@mantine/core';

import { IconCircleCheck, IconClockOff } from '@tabler/icons-react';

import { useStatsSchedules } from '@/api/Stats/useStatsSchedules';

import { HeatMapContent } from './HeatMapContent';

function isAllZeros(arrayOfArrays: any) {
  // Check if every element in every sub-array is 0
  return arrayOfArrays.every((subArray: any) => subArray.every((element: any) => element === 0));
}

export function HeatMapBox() {
  const {
    data: weekday,
    getStatsSchedules
  } = useStatsSchedules();

  const [day, setDay] = useState(-1);
  const [heatmap, setHeatmap] = useState([]);
  const [heatmapScheduleName, setHeatmapScheduleName] = useState([]);

  useEffect(() => {
    getStatsSchedules();
  }, []);

  useEffect(() => {
    if (weekday !== undefined && Object.keys(weekday?.week_heatmap).length > 0) setDay(0);
  }, [weekday]);

  useEffect(() => {
    setHeatmap(weekday?.week_heatmap[day]);
    setHeatmapScheduleName(weekday?.heatmap_schedule_name[day]);
  }, [day]);

  return (
    <>
      <Text size="sm">Heatmap constructed as follows:</Text>
      <List
        mt={5}
        spacing="xs"
        size="sm"
        center
        icon={
          <ThemeIcon color="teal" size={20} radius="xl">
            <IconCircleCheck
              style={{
                width: rem(16),
                height: rem(16),
              }}
            />
          </ThemeIcon>
        }
      >
        <List.Item>Generation of events triggered for each schedule over the next 7 days</List.Item>
        <List.Item>
          Duration is estimated based on the actual duration of the last executed backup for each
          schedule
        </List.Item>
      </List>
      <Space h={10}/>
      <Tabs defaultValue="0">
        <Tabs.List>
          <Tabs.Tab value="0" onClick={() => setDay(0)}>
            Sunday
          </Tabs.Tab>
          <Tabs.Tab value="1" onClick={() => setDay(1)}>
            Monday
          </Tabs.Tab>
          <Tabs.Tab value="2" onClick={() => setDay(2)}>
            Tuesday
          </Tabs.Tab>
          <Tabs.Tab value="3" onClick={() => setDay(3)}>
            Wednesday
          </Tabs.Tab>
          <Tabs.Tab value="4" onClick={() => setDay(4)}>
            Thursday
          </Tabs.Tab>
          <Tabs.Tab value="5" onClick={() => setDay(5)}>
            Friday
          </Tabs.Tab>
          <Tabs.Tab value="6" onClick={() => setDay(6)}>
            Saturday
          </Tabs.Tab>
        </Tabs.List>

        <Box
          pt={10}
          py={20}
          style={{
            minHeight: '20rem',
          }}
        >
          {heatmap !== undefined && isAllZeros(heatmap) && (
            <>
              <Center>
                <Group>
                  <IconClockOff
                    style={{
                      width: rem(30),
                      height: rem(30),
                    }}
                  />
                  <Text>No cron</Text>
                </Group>
              </Center>
            </>
          )}

          {heatmap !== undefined && !isAllZeros(heatmap) && heatmap && heatmap.length > 0 && (
            <HeatMapContent data={heatmap} heatmapScheduleName={heatmapScheduleName}/>
          )}
        </Box>
      </Tabs>
    </>
  );
}
