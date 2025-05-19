import { Anchor, Box, Card, Group, Text, Tooltip } from '@mantine/core';
import React from 'react';
import { useRouter } from 'next/navigation';
import { IconClock } from '@tabler/icons-react';
import classes from '@/styles/veleroResourceDetails.module.css';
import VeleroResourceStatusBadge from './Display/VeleroResourceStatusBadge';
import { getExpirationString } from '@/utils/getExpirationString';
import { getDurationDetails } from '@/utils/getDurationDetails';

function get_duration({ status }: { status: any }) {
  if (status?.startTimestamp && status?.completionTimestamp) {
    const { startTimestamp } = status;
    const { completionTimestamp } = status;
    const {
      formattedDuration,
      duration
    } = getDurationDetails(startTimestamp, completionTimestamp);
    return (
      <Tooltip label={duration} color="blue">
        <Text size="sm" fw={600}>
          {formattedDuration}
        </Text>
      </Tooltip>
    );
  }
  return <></>;
}

export function DetailsBackupRestoreStatus({ data }: any) {
  const router = useRouter();
  return (
    <Card.Section className={classes.section}>
      <Text fz="sm" c="dimmed" className={classes.label}>
        Status Info
      </Text>

      <Box
        style={{
          display: 'flex',
          width: '100%',
        }}
        mt={3}
      >
        <Text w={150} size="sm">
          Phase:
        </Text>
        {data?.status?.phase && <VeleroResourceStatusBadge status={data?.status?.phase}/>}
      </Box>

      {data?.status?.errors && (
        <Box
          style={{
            display: 'flex',
            width: '100%',
          }}
          mt={3}
        >
          <Text w={150} size="sm">
            Error:
          </Text>
          <Text fw={600} size="sm" style={{ flex: 1 }}>
            {data?.status?.errors}
          </Text>
        </Box>
      )}
      {data?.status?.warnings && (
        <Box
          style={{
            display: 'flex',
            width: '100%',
          }}
          mt={3}
        >
          <Text w={150} size="sm">
            Warnings:
          </Text>
          <Text fw={600} size="sm" style={{ flex: 1 }}>
            {data?.status?.warnings}
          </Text>
        </Box>
      )}
      {data?.kind === 'Backup' && (
        <Box
          style={{
            display: 'flex',
            width: '100%',
          }}
          mt={3}
        >
          <Text w={150} size="sm">
            Expire in:
          </Text>
          <Text fw={600} size="sm" style={{ flex: 1 }}>
            {data?.status?.expiration && <>{getExpirationString(data?.status?.expiration)}</>}
          </Text>
        </Box>
      )}

      <Box
        style={{
          display: 'flex',
          width: '100%',
        }}
        mt={3}
      >
        <Text w={150} size="sm">
          Items:
        </Text>
        <Text fw={600} size="sm" style={{ flex: 1 }}>
          {data?.status?.phase && data?.status?.phase === 'InProgress' && (
            <>
              {data?.status?.progress?.itemsBackedUp ||
                data?.status?.progress?.itemsRestored ||
                'n.a.'}
              {` / `}{data?.status?.progress?.totalItems || 'n.a.'}
            </>
          )}
          {data?.status?.phase !== 'InProgress' && <>{data?.status?.progress?.totalItems}</>}
        </Text>
      </Box>

      {data?.metadata?.labels?.['velero.io/schedule-name'] && (
        <Box
          style={{
            display: 'flex',
            width: '100%',
          }}
          mt={3}
        >
          <Text w={150} size="sm">
            Schedule:
          </Text>
          <Anchor
            size="sm"
            onClick={() => {
              router.push(`/schedules/${data?.metadata?.labels['velero.io/schedule-name']}`);
            }}
          >
            <Group gap={5}>
              <IconClock size={16}/>
              <Text size="sm">{data?.metadata?.labels['velero.io/schedule-name']}</Text>
            </Group>
          </Anchor>
        </Box>
      )}

      <Box
        style={{
          display: 'flex',
          width: '100%',
        }}
        mt={3}
      >
        <Text w={150} size="sm">
          Duration:
        </Text>

        {get_duration({ status: data?.status })}
      </Box>
    </Card.Section>
  );
}
