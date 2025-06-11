'use client';

import React from 'react';
import { Group } from '@mantine/core';

import { MaskedConfiguration } from '@/components/Features/Settings/Watchdog/Display/MaskedConfiguration';
import { WatchdogEnvMRT } from '@/components/Features/Settings/Watchdog/WatchdogEnvMRT';

interface Props {
  deployConfiguration: Record<string, any>;
  userConfiguration: Record<string, any>;
  fetching: boolean;
  setReload: Function;
}

// List of keys whose values should be masked
const maskedKeys = ['APPRISE'];

export function WatchdogDeployConfigs({
                                        deployConfiguration,
                                        userConfiguration,
                                        fetching,
                                        setReload
                                      }: Props) {
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
    return maskedKeys.includes(key) ? <MaskedConfiguration service={value}/> : String(value);
  }

  const array = Object.entries(deployConfiguration).map(([key, value]) => ({
    hasChanged: hasChanged(key),
    name: key,
    value: maskValue(key, deployConfiguration[key]),
    newValue: <Group gap={2}>
      {/*maskValue(key, deployConfiguration[key])*/}
      {hasChanged(key) && (
        <>
          {/*<Text size="sm" c="var(--mantine-primary-color-light-color)"></Text>{' '}
          <IconArrowRight size={20} color="var(--mantine-primary-color-light-color)"/>*/}
          {maskValue(key, userConfiguration[key])}
        </>
      )}
    </Group>,
  }));
  return (
    <WatchdogEnvMRT
      fetching={fetching}
      setReload={setReload}
      items={array}
    />
  );
}
