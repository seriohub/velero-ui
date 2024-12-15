import { Sparkline } from '@mantine/charts';

import { useAppState } from '@/contexts/AppStateContext';
import { Group, Text } from '@mantine/core';

export const ProcessTime = () => {
  const appValues = useAppState();

  const xProcessTimeArray = appValues.apiResponse.map(
    (item: { xProcessTime: number }) => item.xProcessTime
  );

  const xProcessTimeAvg =
    xProcessTimeArray.length > 0
      ? xProcessTimeArray.reduce(
          (sum: number, current: number) => Number(sum) + Number(current),
          0
        ) / xProcessTimeArray.length
      : 0;

  return (
    <>
      <Group gap={8}>
        <Sparkline
          w={200}
          h={24}
          data={xProcessTimeArray}
          curveType="linear"
          color="blue"
          fillOpacity={0.6}
          strokeWidth={2}
        />
        <Text size="sm">avg: {Math.trunc(xProcessTimeAvg * 100) / 100}ms</Text>
      </Group>
    </>
  );
};
