import { getDurationDetails, getDurationInMilliseconds } from '@/utils/getDurationDetails';
import { Text, Tooltip } from '@mantine/core';
import React from 'react';

export function get_duration(status: any) {
  if (status?.startTimestamp && status?.completionTimestamp) {
    const { startTimestamp } = status;
    const { completionTimestamp } = status;
    const ms = getDurationInMilliseconds(startTimestamp, completionTimestamp)
    const {
      humanDuration,
      durationHHmmss
    } = getDurationDetails(ms);
    return (
      <Tooltip label={durationHHmmss} offset={5}>
        <Text size="sm">{humanDuration}</Text>
      </Tooltip>
    );
  }
  return <></>;
}
