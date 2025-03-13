'use client';

import { Box, Select } from '@mantine/core';

import { useUIStatus } from '@/contexts/UIContext';

export function UIConfigBadgeVariant() {
  const appValues = useUIStatus();

  function setBadgeVariant(value: any) {
    appValues.setBadgeVariant(value);

    localStorage.setItem('badgeVariant', value);
  }

  return (
    <Box maw={400} mx="auto" mt={50}>
      <Select
        label="Font Family"
        data={[
          {
            value: 'filled',
            label: 'Filled',
          },
          {
            value: 'light',
            label: 'Light',
          },
          {
            value: 'outline',
            label: 'Outline',
          },
          {
            value: 'dot',
            label: 'Dot',
          },
          {
            value: 'transparent',
            label: 'Transparent',
          },

          {
            value: 'white',
            label: 'White',
          },
        ]}
        onChange={(value) => setBadgeVariant(value as any)}
        placeholder={appValues.badgeVariant}
      />
    </Box>
  );
}
