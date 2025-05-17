import { Box, Card, Group, Space, Text, Title } from '@mantine/core';

import { IconRestore } from '@tabler/icons-react';
import React from 'react';

import { DetailsBackupRestoreContent } from '@/components/Features/Velero/Commons/DetailsBackupRestoreContent';
import { DetailsBackupRestoreStatus } from '@/components/Features/Velero/Commons/DetailsBackupRestoreStatus';

export function RestoreDetailsView({
                                     data,
                                     ...rest
                                   }: any) {
  return (
    <Card shadow="sm" radius="md" withBorder h="100%">
      <Card.Section p="md">
        <Group gap={5}>
          <IconRestore size={80}/>
          <Box>
            <Title order={2} fw={800}>
              {data?.metadata?.name}
            </Title>
            <Text size="md" fw={600} c="dimmed">
              {data?.metadata?.uid}
            </Text>
          </Box>
        </Group>
      </Card.Section>

      <Space h={5}/>

      <DetailsBackupRestoreStatus data={data}/>

      <Space h={5}/>

      <DetailsBackupRestoreContent data={data}/>
    </Card>
  );
}
