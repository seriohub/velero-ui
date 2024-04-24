'use client';

import React from 'react';

import { List, ThemeIcon, rem, Text, Group, Stack, ScrollArea, Paper } from '@mantine/core';

import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';

import classes from './StatsSegments.module.css';

interface UnscheduledNamespacesProps {
  namespaces: string;
  total: number;
}

export function UnscheduledNamespaces({ namespaces, total }: UnscheduledNamespacesProps) {
  const values = () =>
    Object.entries(namespaces)
      .sort(([, valueA], [, valueB]) => valueA.localeCompare(valueB))
      .map(([key, value]) => <List.Item key={key}>{value}</List.Item>);

  return (
    <>
      <Paper withBorder p="md" radius="md">
        <Group justify="flex-start">
          <Text size="xs" c="dimmed" className={classes.title}>
            Unscheduled namespaces
          </Text>
          <Text size="xs" fw={800}>
            {namespaces.length} / {total}
          </Text>
        </Group>
        {namespaces.length === 0 && (
          <>
            <List spacing="xs" size="sm" center mt={25}>
              <List.Item
                icon={
                  <ThemeIcon color="green" size={24} radius="xl">
                    <IconCheck style={{ width: rem(16), height: rem(16) }} />
                  </ThemeIcon>
                }
              >
                <Stack gap={0}>
                  <Text fw={800}>Good!</Text>
                  <Text size="sm">All namespaces have at least one scheduled backup</Text>
                </Stack>
              </List.Item>
            </List>
          </>
        )}
        {namespaces.length > 0 && (
          <>
            <ScrollArea h={180} mt={25}>
              <List
                spacing="xs"
                size="sm"
                center
                icon={
                  <ThemeIcon color="orange" size={24} radius="xl">
                    <IconAlertTriangle style={{ width: rem(16), height: rem(16) }} />
                  </ThemeIcon>
                }
              >
                {values()}
              </List>
            </ScrollArea>
          </>
        )}
      </Paper>
    </>
  );
}
