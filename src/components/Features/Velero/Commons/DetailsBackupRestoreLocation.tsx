import { Anchor, Box, Card, Group, Text } from '@mantine/core';
import { IconCamera, IconServer } from '@tabler/icons-react';
import React from 'react';
import { useRouter } from 'next/navigation';
import classes from '@/styles/veleroResourceDetails.module.css';

export function DetailsBackupRestoreLocation({ data }: any) {
  const router = useRouter();

  // Funzione per ottenere il valore corretto da spec o spec.template
  const getValue = (field: string) => {
    return data?.spec?.[field] ?? data?.spec?.template?.[field] ?? null;
  };

  // Funzione per renderizzare un link con icona
  const renderLink = (label: string, field: string, basePath: string, Icon: any) => {
    const value = getValue(field);
    if (!value) return null;

    return (
      <Box
        style={{
          display: 'flex',
          width: '100%',
        }}
        mt={3}
      >
        <Text w={150} size="sm">
          {label}:
        </Text>
        <Anchor size="sm" onClick={() => router.push(`${basePath}/${value}`)}>
          <Group gap={5}>
            <Icon size={16} />
            <Text size="sm">{value}</Text>
          </Group>
        </Anchor>
      </Box>
    );
  };

  // Funzione per renderizzare una lista di link con icone
  const renderLinkList = (label: string, field: string, basePath: string, Icon: any) => {
    const values = getValue(field);
    if (!Array.isArray(values) || values.length === 0) return null;

    return (
      <Box
        style={{
          display: 'flex',
          width: '100%',
        }}
        mt={3}
      >
        <Text w={150} size="sm">
          {label}:
        </Text>
        <Box>
          {values.map((value: string, index: number) => (
            <Anchor size="sm" onClick={() => router.push(`${basePath}/${value}`)} key={index}>
              <Group gap={5}>
                <Icon size={16} />
                <Text size="sm">{value}</Text>
              </Group>
            </Anchor>
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <Card.Section className={classes.section}>
      <Text fz="sm" c="dimmed" className={classes.label}>
        Location
      </Text>

      {renderLink('BSL', 'storageLocation', '/backup-storage-locations', IconServer)}
      {getValue('snapshotVolumes') &&
        renderLinkList('VSL', 'volumeSnapshotLocations', '/volume-snapshot-locations', IconCamera)}
    </Card.Section>
  );
}
