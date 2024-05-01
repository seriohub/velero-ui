'use client';

import { ActionIcon, Button } from '@mantine/core';


export default function SendReport({ sendReport, fetching = false }: any) {
  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        sendReport('/v1/watchdog/send-report');
      }}
      
      variant={fetching ? 'filled' : 'default'}
      disabled={fetching}
      aria-label="ActionIcon with size as a number"
    >
      Send Report
    </Button>
  );
}
