'use client';

import { Text, Box, Switch } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useUIStatus } from '@/contexts/UIContext';

export function UIConfigNavbarColor() {
  const uiValues = useUIStatus();

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
