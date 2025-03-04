'use client';

import { ActionIcon, Tooltip } from '@mantine/core';

import { IconZoomCode } from '@tabler/icons-react';

import { useRouter } from 'next/navigation';

export default function InspectAction({ record }: any) {
  const router = useRouter();
  return (
    <Tooltip label="Inspect">
      <ActionIcon
        size="sm"
        variant="subtle"
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/inspect/${record.name}`);
        }}
      >
        <IconZoomCode />
      </ActionIcon>
    </Tooltip>
  );
}
