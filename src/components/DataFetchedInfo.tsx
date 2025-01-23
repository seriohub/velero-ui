import { Group, Text } from '@mantine/core';

import ExpireIn from '@/components/Velero/Backups/ExpireIn';

export const DataFetchedInfo = ({ metadata }: any) => (
    <>
      {metadata?.timestamp && (
        <>
          <Group justify="flex-end">
            <Text fw={500} size="xs">
              Data fetched <ExpireIn expiration={metadata?.timestamp} />{' '}
            </Text>
          </Group>
        </>
      )}
    </>
  );
