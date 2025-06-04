'use client';

import React from 'react';
import { Card, Group, List, rem, ScrollArea, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';

interface UnscheduledNamespacesProps {
  namespaces: string;
  total: number;
}

export function UnscheduledNamespaces({
                                        namespaces,
                                        total
                                      }: UnscheduledNamespacesProps) {
  const values = () =>
    Object.entries(namespaces)
      .sort(([, valueA], [, valueB]) => valueA.localeCompare(valueB))
      .map(([key, value]) => <List.Item key={key}>{value}</List.Item>);

  return (
    <Card withBorder p="md" radius="md" shadow="sm" h={310}>
      <Group justify="space-between" gap="xs">
        <Group align="baseline">
          <Text size="4rem" fw={800}>
            {namespaces.length}
          </Text>
          <Text size="md" fw={500}>
            / {total}
          </Text>
        </Group>
        {/*React.cloneElement(icon, { size: '3rem', className: classes.icon, stroke: '1.5' })*/}
        <IconAlertTriangle
          size="4rem"
          color="var(--mantine-primary-color-light-color)"
        />
      </Group>
      <Text size="md" c="dimmed">
        Unscheduled namespace
      </Text>

      {namespaces.length === 0 && (
        <List spacing="xs" size="sm" center mt={25}>
          <List.Item
            icon={
              <ThemeIcon color="green" size={24} radius="xl">
                <IconCheck
                  style={{
                    width: rem(16),
                    height: rem(16),
                  }}
                />
              </ThemeIcon>
            }
          >
            <Stack gap={0}>
              <Text fw={800}>Good!</Text>
              <Text size="sm">All namespaces have at least one scheduled backup</Text>
            </Stack>
          </List.Item>
        </List>
      )}
      {namespaces.length > 0 && (
        <ScrollArea h={160} mt={20} type="auto">
          <List
            spacing="xs"
            size="sm"
            center
            icon={
              <ThemeIcon color="orange" size={24} radius="xl">
                <IconAlertTriangle
                  style={{
                    width: rem(16),
                    height: rem(16),
                  }}
                />
              </ThemeIcon>
            }
          >
            {values()}
          </List>
        </ScrollArea>
      )}
    </Card>
  );
}
