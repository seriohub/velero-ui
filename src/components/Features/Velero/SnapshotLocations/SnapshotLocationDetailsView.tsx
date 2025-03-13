import { Box, Card, Group, Space, Text, Title } from '@mantine/core';
import { IconDatabase } from '@tabler/icons-react';
import React from 'react';
import classes from '@/styles/veleroResourceDetails.module.css';

export function SnapshotLocationDetailsView({ data, ...rest }: any) {
  return (
    <Card shadow="sm" radius="md" withBorder {...rest}>
      <Card.Section p="sm">
        <Group gap={5}>
          <IconDatabase size={80} />
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
      <Space h={3} />
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
            Provider:
          </Text>
          <Text fw={600} size="sm">
            {data?.spec?.provider}
          </Text>
        </Box>
      </Card.Section>
    </Card>
  );
}
