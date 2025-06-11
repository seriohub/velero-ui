import { Box, Group, Text } from '@mantine/core';
import { getExpirationString } from '@/utils/getExpirationString';

export const DataFetchedInfo = ({ fetchedTime }: any) => (
  <Box mt={5}>
    {fetchedTime && (
      <Group justify="flex-end">
        <Text fw={500} size="xs">
          Data fetched <>{getExpirationString(fetchedTime)}</>
        </Text>
      </Group>
    )}
  </Box>
);
