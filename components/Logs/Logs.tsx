'use client';

import { useEffect, useMemo, useState } from 'react';

import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { ActionIcon, Group, MultiSelect, Text, Loader, Center } from '@mantine/core';

import sortBy from 'lodash/sortBy';

import { IconSearch, IconAlertTriangle, IconInfoCircle } from '@tabler/icons-react';

interface LogsProps {
  items: Array<any>;
  fetching: boolean;
  error: boolean;
}

export function Logs({ items = [], fetching}: LogsProps) {
  const [dataFiltered, setDataFilter] = useState<any[]>([]);

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'Number',
    direction: 'asc',
  });

  const [selectedLevel, setSelectedLevel] = useState<string[]>([]);

  const levelList = useMemo(() => {
    if (items.length > 0) {
      const list = Array.from(
        new Set<string>(items.map((e: any) => e.level).filter((item: any) => item !== undefined))
      );
      return [...list];
    }
    return [];
  }, [items]);

  useEffect(() => {
    setDataFilter(items);
  }, []);

  useEffect(() => {
    setDataFilter(items);
  }, [items]);

  useEffect(() => {
    const data_sorted = sortBy(items, sortStatus.columnAccessor);

    const data_filter = data_sorted.filter(({ level }: any) => {
      if (selectedLevel.length === 0) {
        return true;
      }

      if (selectedLevel.length !== 0 && !selectedLevel.includes(level)) {
        return false;
      }

      return true;
    });
    setDataFilter(data_filter);
  }, [selectedLevel]);

  function otherFields(record: any) {
    const exclude = [
      'id',
      'time',
      'level',
      'msg',
      'backup',
      'logSource',
      'group',
      'namespace',
      'resource',
    ];

    return Object.keys(record)
      .filter((key) => !exclude.includes(key))
      .map((key) => (
        <Group gap="xs" key={key}>
          <Text fw={800} fz="xs">
            {' '}
            {key}
          </Text>
          =<Text fz="xs">{record[key]}</Text>
        </Group>
      ));
  }

  if (items.length === undefined || items.length === 0) {
    return (
      <Center>
        <Loader color="blue" />
      </Center>
    );
  }

  return (
    <>
      <DataTable
        fetching={fetching}
        striped
        highlightOnHover
        fz="xs"
        records={dataFiltered}
        style={{
          minHeight: '20rem',
        }}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        idAccessor="id"
        columns={[
          {
            accessor: 'id',
            title: 'Row',
            sortable: true,
            width: '5rem',
          },
          {
            accessor: 'time',
            title: 'Time',
            width: '12rem',
          },
          {
            accessor: 'level',
            title: 'Level',
            width: '8rem',
            filter: (
              <MultiSelect
                label="Level"
                description="Select level message"
                data={levelList}
                value={selectedLevel}
                placeholder="Search level…"
                onChange={setSelectedLevel}
                leftSection={<IconSearch size={16} />}
                clearable
                searchable
              />
            ),
            filtering: selectedLevel.length > 0,
            render: ({ level }) => {
              if (level === 'info') {
                return (
                  <>
                    <Group gap={3}>
                      <ActionIcon size={20} variant="filled" color="blue">
                        <IconInfoCircle />
                      </ActionIcon>
                      {level}
                    </Group>
                  </>
                );
              }
              if (level === 'warning') {
                return (
                  <>
                    <Group gap={3}>
                      <ActionIcon size={20} variant="filled" color="yellow">
                        <IconAlertTriangle />
                      </ActionIcon>
                      {level}
                    </Group>
                  </>
                );
              }
              if (level === 'error') {
                return (
                  <>
                    <Group>
                      <ActionIcon size={20} variant="filled" color="red">
                        <IconAlertTriangle />
                      </ActionIcon>
                      {level}
                    </Group>
                  </>
                );
              }
              return <></>;
            },
          },
          {
            accessor: 'msg',
            title: 'Message',
          },
          { accessor: 'backup', title: 'Backup', width: '20rem' },
          { accessor: 'logSource', title: 'logSource', width: '20rem' },
          { accessor: 'group', title: 'Group', width: '15rem' },
          { accessor: 'namespace', title: 'Namespace', width: '10rem' },
          { accessor: 'resource', title: 'Resource', width: '15rem' },
          {
            accessor: '_',
            title: '',
            render: (record) => <>{otherFields(record)}</>,
          },
        ]}
      />
    </>
  );
}
