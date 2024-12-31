'use client';

import { Group, List, Table, Text, ThemeIcon, rem } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { ReactElement } from 'react';

interface DiagnosticItemProps {
  label: string;
  value: string;
  ok: boolean;
  warning?: boolean;
  actionIcon?: ReactElement;
  message?: string;
  message2?: string;
  message3?: string;
  message4?: any;
}

export function DiagnosticItemTable({
  label,
  value,
  ok,
  warning = false,
  actionIcon,
  message = '',
  message2 = '',
  message3 = '',
  message4 = '',
}: DiagnosticItemProps) {
  const IconOk = <IconCheck color="green" style={{ width: rem(16), height: rem(16) }} />;
  const IconError = <IconX color="red" style={{ width: rem(16), height: rem(16) }} />;
  const IconWarning = <IconCheck color="yellow" style={{ width: rem(16), height: rem(16) }} />;

  return (
    <>
      <Table.Tr key={btoa(label + '-' + value)}>
        <Table.Td>{label}</Table.Td>
        <Table.Td>
          <Text size="sm" fw={600}>
            {value}
          </Text>
          {(message != '' || message2 != '' || message3 != '') && (
            <List size="sm" mt={5}>
              {message != '' && <List.Item>{message}</List.Item>}
              {message2 != '' && <List.Item>{message2}</List.Item>}
              {message3 != '' && <List.Item>{message3}</List.Item>}
              {message4 !== '' && <List.Item>{message4}</List.Item>}
            </List>
          )}
        </Table.Td>
        <Table.Td>
          {ok && !warning && IconOk}
          {ok && warning && IconWarning}
          {!ok && IconError}
        </Table.Td>
        <Table.Td>
          <Group>{ok && actionIcon}</Group>
        </Table.Td>
      </Table.Tr>

      {/*<List.Item
      icon={
        <ThemeIcon color="dimmed" size={24} radius="xl">
          {ok && !warning && IconOk}
          {ok && warning && IconWarning}
          {!ok && IconError}
        </ThemeIcon>
      }
    >
      <Group gap={10}>
        <Text size="sm">{label}</Text>
        <Text size="sm" fw={800}>
          {value}
        </Text>
        {ok && actionIcon}
      </Group>

      {(message != '' || message2 != '' || message3 != '') && (
        <List size="sm" mt={5} pl={30}>
          {message != '' && <List.Item>{message}</List.Item>}
          {message2 != '' && <List.Item>{message2}</List.Item>}
          {message3 != '' && <List.Item>{message3}</List.Item>}
          {message4 !== '' && <List.Item>{message4}</List.Item>}
        </List>
      )}
    </List.Item>*/}
    </>
  );
}
