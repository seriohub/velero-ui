'use client';

import { rem, Select, Slider, Text, Box, Switch } from '@mantine/core';
import { useAppState } from '@/contexts/AppStateContext';
import { useEffect, useState } from 'react';
import { useUIState } from '@/contexts/UIStateContext';

export function UIConfigNavbarColor() {
  const uiValues = useUIState();

  const [checked, setChecked] = useState(uiValues.navbarColored);

  useEffect(() => {
    uiValues.setNavbarColored(checked);
    localStorage.setItem('navbarColored', checked ? 'true' : 'false');
  }, [checked]);

  return (
    <Box maw={400} mx="auto">
      <Text size="sm" mt={50} fw={500}>
        Navbar background colored
      </Text>
      <Switch checked={checked} onChange={(event) => setChecked(event.currentTarget.checked)} />
    </Box>
  );
}
