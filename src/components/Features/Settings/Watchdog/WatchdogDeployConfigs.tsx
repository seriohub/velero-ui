'use client';

import React from 'react';
import { Group, Text } from '@mantine/core';
import { IconAlertTriangle, IconArrowRight } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { MaskedConfiguration } from '@/components/Features/Settings/Watchdog/Display/MaskedConfiguration';

interface Props {
  deployConfiguration: Record<string, any>;
  userConfiguration: Record<string, any>;
  fetching: boolean;
}

// List of keys whose values should be masked
const maskedKeys = ['APPRISE'];

export function WatchdogDeployConfigs({ deployConfiguration, userConfiguration, fetching }: Props) {
  // Function to determine if a key has changed
  function hasChanged(key: string): boolean {
    return (
      userConfiguration?.[key] !== undefined &&
      deployConfiguration?.[key] !== undefined &&
      userConfiguration[key] !== deployConfiguration[key]
    );
  }

  // Function to mask sensitive values
  function maskValue(key: string, value: any): any {
    //return maskedKeys.includes(key) ? '••••••' : String(value);
    return maskedKeys.includes(key) ? <MaskedConfiguration service={value} /> : String(value);
  }

  const array = Object.entries(deployConfiguration).map(([key, value]) => ({
    key,
    value,
  }));
  return (
    <>
      <DataTable
        withTableBorder
        striped
        //minHeight={160}
        fetching={fetching}
        columns={[
          {
            accessor: 'name',
            title: 'Environment variable',
            width: 150,
            render: ({ key }) => (
              <>
                <Group gap={5}>
                  {hasChanged(key) && (
                    <IconAlertTriangle size={20} color="var(--mantine-primary-color-light-color)" />
                  )}
                  {key}
                </Group>
              </>
            ),
          },
          {
            accessor: 'value',
            title: 'value',
            render: ({ key }: any) => (
              <>
                <Group gap={2}>
                  {maskValue(key, deployConfiguration[key])}
                  {hasChanged(key) && (
                    <>
                      <Text size="sm" c="var(--mantine-primary-color-light-color)"></Text>{' '}
                      <IconArrowRight size={20} color="var(--mantine-primary-color-light-color)" />
                      <Text>{maskValue(key, userConfiguration[key])}</Text>
                    </>
                  )}
                </Group>
              </>
            ),
            sortable: true,
            width: 600,
            ellipsis: true,
          },
        ]}
        records={array}
      />
    </>
  );
}
