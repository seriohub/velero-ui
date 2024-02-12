'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import { Anchor, Text } from '@mantine/core';

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
        <Text fz="xl" size={"xl"} fw={800} c="white" lightHidden>
          Velero UI
        </Text>
        <Text fz="xl" size="xl" fw={800} c="blue" darkHidden>
          Velero UI
        </Text>

      </Anchor>
    </>
  );
}
