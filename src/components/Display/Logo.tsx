'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import { Anchor, Box, Group, Text } from '@mantine/core';
import { IconSailboat } from '@tabler/icons-react';
import { useUIStatus } from '@/contexts/UIContext';

interface LogoProps {
  collapsed?: boolean;
}

export function Logo({ collapsed }: LogoProps) {
  const router = useRouter();
  const uiValues = useUIStatus();

  return (
    <Anchor
      href="#"
      onClick={() => {
        router.push('/');
      }}
      underline="never"
    >
      <Box lightHidden>
        <Group p={0} gap={2}>
          <IconSailboat size={40} color="white"/>
          <Text fz="xl" size="xl" fw={800} c="white">
            Vui
          </Text>
        </Group>
      </Box>
      <Box darkHidden>
        <Group p={0} gap={2}>
          <IconSailboat size={40}
                        color={uiValues.navbarColored && !collapsed ? 'white' : 'var(--mantine-primary-color-filled)'}/>
          <Text
            fz="xl"
            size="xl"
            fw={800}
            c={uiValues.navbarColored && !collapsed ? 'white' : 'var(--mantine-primary-color-filled)'}
          >
            Vui
          </Text>
        </Group>
      </Box>
    </Anchor>
  );
}
