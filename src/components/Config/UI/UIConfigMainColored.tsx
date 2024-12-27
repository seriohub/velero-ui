'use client';

import { rem, Select, Slider, Text, Box, Switch } from '@mantine/core';
import { useAppStatus } from '@/contexts/AppContext';
import { useEffect, useState } from 'react';
import { useUIStatus } from '@/contexts/UIContext';

export function UIConfigMainColored() {
  const uiValues = useUIStatus();

  const [checked, setChecked] = useState(uiValues.mainColored);

  useEffect(() => {
    uiValues.setMainColored(checked);
    localStorage.setItem('mainColored', checked ? 'true' : 'false');
  }, [checked]);

  return (
    <Box maw={400} mx="auto">
      <Text size="sm" mt={50} fw={500}>
        Main background colored
      </Text>
      <Switch checked={checked} onChange={(event) => setChecked(event.currentTarget.checked)} />
    </Box>
  );
}
