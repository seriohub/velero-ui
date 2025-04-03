import { Box, Card, Group, Space, Text, Title } from '@mantine/core';

import { IconDeviceFloppy } from '@tabler/icons-react';

import React from 'react';
import { DetailsBackupRestoreContent } from '@/components/Features/Velero/Commons/DetailsBackupRestoreContent';
import { DetailsBackupRestoreLocation } from '@/components/Features/Velero/Commons/DetailsBackupRestoreLocation';
import { DetailsBackupRestoreStatus } from '@/components/Features/Velero/Commons/DetailsBackupRestoreStatus';

export function BackupDetailsView({
                                    data,
                                  }: any) {
  return (
    <Card shadow="sm" radius="md" withBorder h="100%">
      <Card.Section p="md">
        <Group gap={5}>
          <IconDeviceFloppy size={80}/>
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

      <Space h={3}/>

      <DetailsBackupRestoreStatus data={data}/>

      <Space h={3}/>

      <DetailsBackupRestoreContent data={data}/>

      <Space h={3}/>

      <DetailsBackupRestoreLocation data={data}/>
    </Card>
  );
}
