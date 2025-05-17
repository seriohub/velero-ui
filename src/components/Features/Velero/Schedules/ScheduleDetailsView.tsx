import { Anchor, Box, Card, Group, ScrollArea, Space, Text, Title } from '@mantine/core';
import { IconCalendar, IconCamera, IconDeviceFloppy, IconServer } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import VeleroResourceStatusBadge from '@/components/Features/Velero/Commons/Display/VeleroResourceStatusBadge';
import React from 'react';
import { DetailsBackupRestoreStatus } from '@/components/Features/Velero/Commons/DetailsBackupRestoreStatus';
import { DetailsBackupRestoreContent } from '@/components/Features/Velero/Commons/DetailsBackupRestoreContent';
import { DetailsBackupRestoreLocation } from '@/components/Features/Velero/Commons/DetailsBackupRestoreLocation';
import classes from '@/styles/veleroResourceDetails.module.css';

export function ScheduleDetailsView({
                                      data,
                                      ...rest
                                    }: any) {
  const router = useRouter();
  return (
    <Card shadow="sm" radius="md" withBorder h="100%">
      <Card.Section p="md" className={classes.section}>
        <Group gap={5}>
          <IconCalendar size={80}/>
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
      <Card.Section p="sm" className={classes.section}>
        <Box
          style={{
            display: 'flex',
            width: '100%',
          }}
          mt={3}
        >
          <Text w={150} size="sm">
            Cron:
          </Text>
          <Text fw={600} size="sm">
            {data?.spec?.schedule}
          </Text>
        </Box>

        <Box
          style={{
            display: 'flex',
            width: '100%',
          }}
          mt={3}
        >
          <Text w={150} size="sm">
            Status:
          </Text>
          {data?.status?.phase && <VeleroResourceStatusBadge status={data?.status.phase}/>}
        </Box>

        <Box
          style={{
            display: 'flex',
            width: '100%',
          }}
          mt={3}
        >
          <Text w={150} size="sm">
            Last Backup:
          </Text>
          <Text fw={600} size="sm">
            {data?.status?.lastBackup || '-'}
          </Text>
        </Box>

        <Space h={3}/>

        <DetailsBackupRestoreContent data={data}/>

        <Space h={3}/>

        <DetailsBackupRestoreLocation data={data}/>
      </Card.Section>
    </Card>
  );
}
