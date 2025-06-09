import { Anchor, Box, Card, Group, Space, Text, Title } from '@mantine/core';
import { IconServer, IconStack } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import VeleroResourceStatusBadge from '@/components/Features/Velero/Commons/Display/VeleroResourceStatusBadge';
import React from 'react';
import classes from '@/styles/veleroResourceDetails.module.css';

export function DetailsView({
                              data,
                              ...rest
                            }: any) {
  const router = useRouter();
  return (
    <Card shadow="sm" radius="md" withBorder {...rest}>
      <Card.Section p="sm">
        <Group gap={5}>
          <IconStack size={80}/>
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

      <Space h={3}/>
      <Card.Section p="sm" className={classes.section}>
        <Text fz="sm" c="dimmed" className={classes.label}>
          Status
        </Text>

        <Box
          style={{
            display: 'flex',
            width: '100%',
          }}
          mt={3}
        >
          <Text w={150} size="sm">
            Last Maintenance:
          </Text>
          <Text fw={600} size="sm">
            {data?.status?.lastMaintenanceTime}
          </Text>
        </Box>

        {data?.status?.message && (
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
              {data?.status.message}
            </Text>
          </Box>
        )}
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
            Type:
          </Text>
          <VeleroResourceStatusBadge status={data?.spec?.repositoryType}/>
        </Box>

        <Box
          style={{
            display: 'flex',
            width: '100%',
          }}
          mt={3}
        >
          <Text w={150} size="sm">
            Restic Identifier:
          </Text>
          <Text fw={600} size="sm">
            {data?.spec?.resticIdentifier}
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
            Maintenance Freq:
          </Text>
          <Text fw={600} size="sm">
            {data?.spec?.maintenanceFrequency}
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
            Storage Location:
          </Text>
          {data?.spec?.backupStorageLocation && (
            <Anchor
              size="sm"
              onClick={() => {
                router.push(`/backup-storage-locations/${data?.spec?.backupStorageLocation}`);
              }}
            >
              <Group gap={5}>
                <IconServer size={16}/>
                <Text size="sm">{data?.spec?.backupStorageLocation}</Text>
              </Group>
            </Anchor>
          )}
        </Box>

        <Box
          style={{
            display: 'flex',
            width: '100%',
          }}
          mt={3}
        >
          <Text w={150} size="sm">
            Volume namespace:
          </Text>
          <Text fw={600} size="sm">
            {data?.spec?.volumeNamespace}
          </Text>
        </Box>
      </Card.Section>
    </Card>
  );
}
