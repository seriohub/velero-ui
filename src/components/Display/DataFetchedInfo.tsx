import { Group, Text } from '@mantine/core';

import { getExpirationString } from '@/utils/getExpirationString';

export const DataFetchedInfo = ({ metadata }: any) => (
  <>
    {metadata?.timestamp && (
      <>
        <Group justify="flex-end">
          <Text fw={500} size="xs">
            Data fetched <>{getExpirationString(metadata?.timestamp)}</>{' '}
          </Text>
        </Group>
      </>
    )}
  </>
);
