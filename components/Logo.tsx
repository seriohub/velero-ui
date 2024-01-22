'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import { Group, Anchor, Text } from '@mantine/core';

export function Logo() {
  const router = useRouter();

  return (
    <>
      <Anchor
        href="#"
        onClick={() => {
          router.push('/');
        }}
      >
        <Group>
          <Text fw={900} fz="xl" size="xl">
            Velero UI
          </Text>
        </Group>
      </Anchor>
    </>
  );
}
