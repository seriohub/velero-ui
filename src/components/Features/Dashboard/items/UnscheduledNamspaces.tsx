'use client';

import React, { useState } from 'react';
import { Button, Card, Group, List, rem, ScrollArea, Stack, Table, Text, ThemeIcon } from '@mantine/core';
import { IconAlertTriangle, IconCheck, IconMoodSad2 } from '@tabler/icons-react';
import { openModal } from '@mantine/modals';
import { CreateScheduleForm } from '@/components/Features/Velero/Schedules/Forms/CreateScheduleForm';

interface UnscheduledNamespacesProps {
  namespaces: string;
  total: number;
}

export function UnscheduledNamespaces({
                                        namespaces,
                                        total
                                      }: UnscheduledNamespacesProps) {
  const [selectedNamespace, setSelectedNamespace] = useState<string | null>(null);
  const [reload, setReload] = useState(0); // se ti serve per ricaricare dati

  const handleCreateSchedule = (namespace: string) => {
    setSelectedNamespace(namespace);
    openModal({
      title: 'Create New Schedule',
      size: '60rem',
      children: (
        <CreateScheduleForm
          ns={[namespace]}
        />
      ),
      padding: 'md',
      radius: 'md',
      centered: true,
    });
  };

  const rows = () =>
    Object.entries(namespaces)
      .sort(([, valueA], [, valueB]) => valueA.localeCompare(valueB))
      .map(([key, value]) => (
        <Table.Tr key={key}>
          <Table.Td><Group gap={5}><IconMoodSad2 color="orange"/>{value}</Group></Table.Td>
          <Table.Td>
            <Group justify="right" px={5}>
              <Button size="compact-sm" onClick={() => handleCreateSchedule(value)}>
                Create schedule
              </Button>
            </Group>
          </Table.Td>

        </Table.Tr>
      ));

  return (
    <Card withBorder p="md" radius="md" shadow="sm" h={310}>
      <Card.Section p="md">
        <Group justify="space-between" gap={5}>
          <Group align="baseline">
            <Text size="4rem" fw={800}>
              {namespaces.length}
            </Text>
            <Text size="md" fw={500}>
              / {total}
            </Text>
          </Group>
          <IconAlertTriangle
            size="4rem"
            color="var(--mantine-primary-color-light-color)"
          />
        </Group>
        <Text size="md" c="dimmed">
          Unscheduled namespace
        </Text>
      </Card.Section>
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
      <Card.Section p={0}>
        {namespaces.length > 0 && (
          <ScrollArea h={180} mt={10} type="auto" bg="var(--mantine-color-body)">
            <Table striped highlightOnHover>
              <Table.Tbody>
                {rows()}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        )}
      </Card.Section>
    </Card>
  );
}
