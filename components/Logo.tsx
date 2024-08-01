'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import { Anchor, Box, Group, Text } from '@mantine/core';
import { IconSailboat } from '@tabler/icons-react';

export function Logo() {
  const router = useRouter();

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
            <IconSailboat size={48} stroke="1.5" />
            <Text fz="xl" size="xl" fw={800} c="blue">
              Vui
            </Text>
          </Group>
        </Box>
      </Anchor>
    </>
  );
}
