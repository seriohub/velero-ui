'use client';

import { ActionIcon, Button } from '@mantine/core';


export default function SendReport({ requestSendReport, fetching = false }: any) {
  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        requestSendReport({url:'/v1/watchdog/send-report'});
      }}
      
      variant={fetching ? 'filled' : 'default'}
      disabled={fetching}
      aria-label="ActionIcon with size as a number"
    >
      Send Report
    </Button>
  );
}
