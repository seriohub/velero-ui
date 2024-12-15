'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import { Anchor, Box, Group, Text, useComputedColorScheme } from '@mantine/core';
import { IconSailboat } from '@tabler/icons-react';
import { useUIState } from '@/contexts/UIStateContext';

export function Logo() {
  const router = useRouter();
  const uiValues = useUIState();
  const computedColorScheme = useComputedColorScheme();

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
            <Text fz="xl" size={'xl'} fw={800} c="white">
              Vui
            </Text>
          </Group>
        </Box>
        <Box darkHidden>
          <Group p={5} gap={5}>
            <IconSailboat size={48} stroke="1.5" color={
          uiValues.navbarColored && computedColorScheme == 'light'
            ? 'var(--mantine-color-white)'
            : undefined
        }/>
            <Text fz="xl" size="xl" fw={800} c={
          uiValues.navbarColored && computedColorScheme == 'light'
            ? 'var(--mantine-color-white)'
            : undefined
        }>
              Vui
            </Text>
          </Group>
        </Box>
      </Anchor>
    </>
  );
}