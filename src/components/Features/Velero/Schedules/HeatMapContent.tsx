'use client';

import { HeatMapGrid } from 'react-grid-heatmap';

import { Box, List, Text, rem, useComputedColorScheme } from '@mantine/core';
import { useState } from 'react';
import { IconClock } from '@tabler/icons-react';

interface DayHeatmapProps {
  data: any;
  heatmapScheduleName: Array<String>;
}

const xLabels = new Array(60).fill(0).map((_, i) => (i % 5 === 0 ? `${i}` : ''));
const yLabels = new Array(24).fill(0).map((_, i) => `${i}`);

export function HeatMapContent({
                                 data,
                                 heatmapScheduleName
                               }: DayHeatmapProps) {
  const computedColorScheme = useComputedColorScheme();
  const [scheduleName, setScheduleName] = useState<string[]>([]);

  function getName(x: number, y: number) {
    setScheduleName(heatmapScheduleName[x][y].split(','));
  }

  const renderScheduleName = scheduleName
    .filter((item: any) => item)
    .map((item: any) => (
      <List.Item>
        <Text>{item}</Text>
      </List.Item>
    ));

  return (
    <>
      <Box bg={computedColorScheme === 'light' ? 'white' : ''}>
        <HeatMapGrid
          data={data}
          xLabels={xLabels}
          yLabels={yLabels}
          // Reder cell with tooltip
          // cellRender={(x, y, value) => <div title={`Pos(${x}, ${y}) = ${value}`}>{value}</div>}
          cellRender={(x, y, value) => (
            <div
              onMouseOver={() => {
                getName(x, y);
              }}
              title={`Pos(${x}, ${y}) = ${value}`}
            >
              {value !== 0 ? value : ''}
            </div>
          )}
          xLabelsStyle={() => ({
            //color: index % 5 ? 'transparent' : '#777',
            fontSize: '0.9rem',
          })}
          yLabelsStyle={() => ({
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            //color: '#777',
          })}
          cellStyle={(_x, _y, ratio) => ({
            borderWidth: '1px',
            borderColor: computedColorScheme === 'light' ? 'white' : '#424242',
            color:
              computedColorScheme === 'light'
                ? `rgb(0, 0, 0, ${ratio / 2 + 0.4})`
                : `rgb(255, 255, 255, ${ratio / 2 + 0.4})`,
          })}
          cellHeight="1.3rem"
          xLabelsPos="top"
          // onClick={(x, y) => alert(`${getName(x,y)}`)}
          // yLabelsPos="right"
          // square
        />
      </Box>

      <Box
        style={{
          minHeight: '10rem',
        }}
      >
        <List
          mt={20}
          spacing="xs"
          size="sm"
          center
          icon={
            <IconClock
              style={{
                width: rem(16),
                height: rem(16),
              }}
              color="green"
            />
          }
        >
          {renderScheduleName}
        </List>
      </Box>
    </>
  );
}
