import { Sparkline } from '@mantine/charts';

import { Group, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useAppStatus } from '@/contexts/AppContext';

export const ProcessTime = () => {
  const appValues = useAppStatus();
  const isVisible = useMediaQuery('(min-width: 74em');

  if (!isVisible) return <></>;

  const xProcessTimeArray = appValues.xProcessTimer;

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
          color="var(--mantine-primary-color-filled)"
          fillOpacity={0.6}
          strokeWidth={2}
        />
        <Text size="sm">avg: {Math.trunc(xProcessTimeAvg * 100) / 100}ms</Text>
        <Text size="sm">last: {Math.trunc(xProcessTimeArray.slice(-1)[0] * 100) / 100}ms</Text>
      </Group>
    </>
  );
};
