import { Anchor, Box, Card, Group, Space, Text, Title } from '@mantine/core';
import { useRouter } from 'next/navigation';
import {
  IconDatabaseExport,
  IconDatabaseImport,
  IconDeviceFloppy,
  IconServer,
} from '@tabler/icons-react';

import React from 'react';
import VeleroResourceStatusBadge from '@/components/Features/Velero/Commons/Display/VeleroResourceStatusBadge';
import classes from '@/styles/veleroResourceDetails.module.css';

export function PVBDetailsView({ manifest, ...rest }: any) {
  const router = useRouter();
  return (
    <Card shadow="sm" radius="md" withBorder h="100%" {...rest}>
      <Card.Section p="md">
        <Group gap={5}>
          {manifest?.kind === 'PodVolumeBackup' && <IconDatabaseExport size={80} />}
          {manifest?.kind === 'PodVolumeRestore' && <IconDatabaseImport size={80} />}
          <Box>
            <Title order={2} fw={800}>
              {manifest?.metadata?.name}
            </Title>
            <Text size="md" fw={600} c="dimmed">
              {manifest?.metadata?.uid}
            </Text>
          </Box>
        </Group>
      </Card.Section>

      <Space h={3} />
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
            Status:
          </Text>
          {manifest?.status?.phase && <VeleroResourceStatusBadge status={manifest?.status.phase} />}
        </Box>
      </Card.Section>

      <Space h={3} />
      <Card.Section p="sm" className={classes.section}>
        <Text fz="sm" c="dimmed" className={classes.label}>
          Config
        </Text>

        {manifest?.kind === 'PodVolumeBackup' && (
          <Box
            style={{
              display: 'flex',
              width: '100%',
            }}
            mt={3}
          >
            <Text w={150} size="sm">
              Backup:
            </Text>
            <Anchor
              size="sm"
              onClick={() => {
                router.push(`/backups/${manifest?.spec?.tags?.backup}`);
              }}
            >
              <Group gap={5}>
                <IconDeviceFloppy size={16} />
                <Text size="sm">{manifest?.spec?.tags?.backup}</Text>
              </Group>
            </Anchor>
          </Box>
        )}
        {manifest?.kind === 'PodVolumeRestore' && (
          <Box
            style={{
              display: 'flex',
              width: '100%',
            }}
            mt={3}
          >
            <Text w={150} size="sm">
              Backup:
            </Text>
            <Anchor
              size="sm"
              onClick={() => {
                router.push(`/restores/${manifest?.spec?.tags?.restore}`);
              }}
            >
              <Group gap={5}>
                <IconDeviceFloppy size={16} />
                <Text size="sm">{manifest?.spec?.tags?.restore}</Text>
              </Group>
            </Anchor>
          </Box>
        )}
        <Box
          style={{
            display: 'flex',
            width: '100%',
          }}
          mt={3}
        >
          <Text w={150} size="sm">
            Volume:
          </Text>
          <Text fw={600} size="sm">
            {manifest?.spec?.tags?.volume}
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
            Node:
          </Text>
          <Text fw={600} size="sm">
            {manifest?.spec?.node}
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
          {manifest?.spec?.backupStorageLocation && (
            <Anchor
              size="sm"
              onClick={() => {
                router.push(`/backup-storage-locations/${manifest?.spec.backupStorageLocation}`);
              }}
            >
              <Group gap={5}>
                <IconServer size={16} />
                <Text size="sm">{manifest?.spec?.backupStorageLocation}</Text>
              </Group>
            </Anchor>
          )}
        </Box>
      </Card.Section>
    </Card>
  );
}
