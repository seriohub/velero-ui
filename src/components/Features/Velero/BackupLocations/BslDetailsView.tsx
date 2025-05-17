import { Box, Card, Group, Space, Text, Title } from '@mantine/core';

import { IconServer } from '@tabler/icons-react';
import VeleroResourceStatusBadge from '@/components/Features/Velero/Commons/Display/VeleroResourceStatusBadge';
import React from 'react';
import classes from '@/styles/veleroResourceDetails.module.css';

export function BslDetailsView({ data }: any) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
      <Card.Section p="md">
        <Group gap={5}>
          <IconServer size={80}/>
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
        <Text fz="sm" c="dimmed" className={classes.label}>
          Status Info
        </Text>

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
            Last Synced Time:
          </Text>
          <Text fw={600} size="sm">
            {data?.status?.lastSyncedTime}
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
            Last Validation Time:
          </Text>
          <Text fw={600} size="sm">
            {data?.status?.lastValidationTime}
          </Text>
        </Box>
      </Card.Section>
      <Space h={3}/>
      <Card.Section p="sm" className={classes.section}>
        <Text fz="sm" c="dimmed" className={classes.label}>
          Config
        </Text>

        <Box
          style={{
            display: 'flex',
            width: '100%',
          }}
          mt={3}
        >
          <Text w={150} size="sm">
            Access mode:
          </Text>
          <Text fw={600} size="sm">
            {data?.spec?.accessMode}
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
            Backup Sync Period:
          </Text>
          <Text fw={600} size="sm">
            {data?.spec?.backupSyncPeriod}
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
            alidation Frequency:
          </Text>
          <Text fw={600} size="sm">
            {data?.spec?.validationFrequency}
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
            Provider:
          </Text>
          <Text fw={600} size="sm">
            {data?.spec?.provider}
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
            Bucket:
          </Text>
          <Text fw={600} size="sm">
            {data?.spec?.objectStorage?.bucket}
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
            Prefix:
          </Text>
          <Text fw={600} size="sm">
            {data?.spec?.objectStorage?.prefix}
          </Text>
        </Box>

        {data?.status?.message && (
          <>
            <Box
              style={{
                display: 'flex',
                width: '100%',
              }}
              mt={3}
            >
              <Text w={150} size="sm">
                Message:
              </Text>
              <Text fw={600} size="sm">
                {data?.data?.status?.message}
              </Text>
            </Box>
          </>
        )}
      </Card.Section>
    </Card>
  );
}
