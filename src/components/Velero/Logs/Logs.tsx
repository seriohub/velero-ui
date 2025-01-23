'use client';

import { useEffect, useMemo, useState } from 'react';

import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import {
  ActionIcon,
  Group,
  MultiSelect,
  Text,
  Loader,
  Center,
  Alert,
  Switch,
  Button,
} from '@mantine/core';

import sortBy from 'lodash/sortBy';

import { IconSearch, IconAlertTriangle, IconInfoCircle } from '@tabler/icons-react';

interface LogsProps {
  items: Array<any>;
  fetching: boolean;
  error: boolean;
}

export function Logs({ items = [], fetching, error }: LogsProps) {
  const resizeKey = 'resize-logs';
  const [withTableBorder, setWithTableBorder] = useState<boolean>(true);
  const [withColumnBorders, setWithColumnBorders] = useState<boolean>(true);

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
    // if (process.env.NODE_ENV === 'development') console.log(`%cuseEffect 580 has been called`, `color: green; font-weight: bold;`)
    setDataFilter(items);
  }, []);

  useEffect(() => {
    // if (process.env.NODE_ENV === 'development') console.log(`%cuseEffect 590 has been called`, `color: green; font-weight: bold;`)
    setDataFilter(items);
  }, [items]);

  useEffect(() => {
    // if (process.env.NODE_ENV === 'development') console.log(`%cuseEffect 600 has been called`, `color: green; font-weight: bold;`)
    const data_sorted = sortBy(items, sortStatus.columnAccessor);

    const data_filter = data_sorted.filter(({ level }: any) => {
      if (selectedLevel.length === 0) {
        return true;
      }

      return !(selectedLevel.length !== 0 && !selectedLevel.includes(level));
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

  if (error) {
    return (
      <Alert variant="light" color="red" title="Logs">
        Error in reading logs
      </Alert>
    );
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
        //withTableBorder={withTableBorder}
        //withColumnBorders={withColumnBorders}
        storeColumnsKey={resizeKey}
        height={400}
        fetching={fetching}
        striped
        highlightOnHover
        fz="xs"
        records={dataFiltered}

        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        idAccessor="id"
        columns={[
          {
            accessor: 'id',
            title: 'Row',
            sortable: true,
            //resizable: true,
          },
          {
            accessor: 'time',
            title: 'Time',
            //resizable: true,
          },
          {
            accessor: 'level',
            title: 'Level',
            //resizable: true,
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
            //resizable: true,
          },
          {
            accessor: 'backup',
            title: 'Backups',
            //resizable: true,
          },
          {
            accessor: 'logSource',
            title: 'logSource',
            //resizable: true,
          },
          {
            accessor: 'group',
            title: 'Group',
            //resizable: true,
          },
          {
            accessor: 'namespace',
            title: 'Namespace',
            //resizable: true,
          },
          {
            accessor: 'resource',
            title: 'Resource',
            width: '15rem',
            //resizable: true,
          },
          {
            accessor: '_',
            title: '',
            //resizable: true,
            render: (record) => <>{otherFields(record)}</>,
          },
        ]}
      />

    </>
  );
}
