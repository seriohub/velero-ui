'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import { Anchor, Box, Group, Text, useComputedColorScheme } from '@mantine/core';
import { IconSailboat } from '@tabler/icons-react';
import { useUIStatus } from '@/contexts/UIContext';

export function Logo() {
  const router = useRouter();
  const computedColorScheme = useComputedColorScheme();
  const uiValues = useUIStatus();

  console.log(computedColorScheme === 'light');
  console.log(uiValues.navbarColored);
  return (
    <>
      <Anchor
        href="#"
        onClick={() => {
          router.push('/');
        }}
        underline="never"
      >
        <Box lightHidden>
          <Group p={5} gap={5}>
            <IconSailboat size={48} stroke="1.5" color="white" />
            <Text fz="xl" size="xl" fw={800} c="white">
              Vui
            </Text>
          </Group>
        </Box>
        <Box darkHidden>
          <Group p={5} gap={5}>
            <IconSailboat size={48} stroke="1.5" color={uiValues.navbarColored ? 'white' : 'var(--mantine-primary-color-filled)'} />
            <Text
              fz="xl"
              size="xl"
              fw={800}
              c={uiValues.navbarColored ? 'white' : 'var(--mantine-primary-color-filled)'}
            >
              Vui
            </Text>
          </Group>
        </Box>
      </Anchor>
    </>
  );
}
