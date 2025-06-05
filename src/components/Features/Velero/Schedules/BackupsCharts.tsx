import React, { useMemo } from 'react';
import { Box, Paper, useComputedColorScheme, useMantineTheme } from '@mantine/core';
import { DateTime, Duration } from 'luxon';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

function formatDate(isoDate: string): string {
  return DateTime.fromISO(isoDate).setLocale('it').toFormat('dd LLL yyyy, HH:mm');
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function BackupsCharts({
                                data,
                                pvbBackup,
                                show
                              }: any) {
  const computedColorScheme = useComputedColorScheme();
  const theme = useMantineTheme();

  const transformedItems = useMemo(() => {
    return (
      data?.map((item: any) => {
        const startTimestamp = item?.status?.startTimestamp;
        const completion = item?.status?.completionTimestamp;

        const duration = startTimestamp && completion
          ? DateTime.fromISO(completion).diff(DateTime.fromISO(startTimestamp), 'seconds').seconds
          : null;

        /*console.log({
          name: item?.metadata?.name,
          start: startTimestamp,
          end: completion,
          duration,
        });*/

        const backupName = item?.metadata?.name;

        const relatedPvbs = pvbBackup?.filter((pvb: any) =>
          pvb?.spec?.tags?.backup === backupName
        ).map((pvb: any) => ({
          volume: pvb?.spec?.volume,
          bytesDone: pvb?.status?.progress?.bytesDone || 0,
          totalBytes: pvb?.status?.progress?.totalBytes || 0,
          pod: pvb?.spec?.pod?.name,
          namespace: pvb?.spec?.pod?.namespace,
          phase: pvb?.status?.phase,
        })) || [];

        const totalVolumeSize = relatedPvbs.reduce(
          (acc: any, cur: any) => acc + (cur.bytesDone || 0),
          0
        );

        const stackedVolumes: Record<string, number> = {};
        relatedPvbs.forEach((v: any) => {
          const key = `volume_${v.volume}`;
          stackedVolumes[key] = (stackedVolumes[key] || 0) + v.bytesDone;
        });

        return {
          name: backupName || '',
          generation: item?.metadata?.generation || 0,
          creation: formatDate(item?.status?.completionTimestamp),
          creationRaw: item?.status?.completionTimestamp,
          errors: item?.status?.errors ?? 0,
          warnings: item?.status?.warnings ?? 0,
          itemsBackedUp: item?.status?.progress?.itemsBackedUp || 0,
          totalItems: item?.status?.progress?.totalItems || 0,
          duration,
          phase: item?.status?.phase || 'Unknown',
          failureReason: item?.status?.failureReason || 'N/A',
          humanDuration: duration
            ? Duration.fromMillis(duration * 1000).toFormat("h'h' m'm' s's'")
            : 'N.A.',
          pvbs: relatedPvbs,
          totalVolumeSize,
          ...stackedVolumes,
        };
      }) || []
    );
  }, [data, pvbBackup]);

  let series: { key: string; color: string }[] = [];

  if (show === 'Status') {
    series = [
      {
        key: 'errors',
        color: '#e03131'
      },
      {
        key: 'warnings',
        color: '#f08c00'
      },
    ];
  }

  if (show === 'Items') {
    series = [
      {
        key: 'totalItems',
        color: '#228be6'
      },
      {
        key: 'itemsBackedUp',
        color: '#40c057'
      },
    ];
  }

  if (show === 'Duration') {
    series = [
      {
        key: 'duration',
        color: '#228be6'
      },
    ];
  }

  const volumeKeys = Object.keys(transformedItems.reduce((acc: any, item: any) => {
    if (item.pvbs) {
      item.pvbs.forEach((v: any) => {
        acc[`volume_${v.volume}`] = true;
      });
    }
    return acc;
  }, {} as Record<string, boolean>));

  const CustomTooltip = ({
                           active,
                           payload
                         }: any) => {
    if (!active || !payload || !payload.length) return null;

    const point = payload[0].payload;

    return (
      <Paper
        p="sm"
        shadow="lg"
        style={{
          backgroundColor:
            computedColorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
          color:
            computedColorScheme === 'dark' ? theme.colors.gray[0] : theme.black,
          borderRadius: 4,
          maxWidth: 1000,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        <div><strong>{formatDate(point.creationRaw)}</strong></div>
        <div>Backup: {point.name}</div>
        {series.map((s) => (
          <div key={s.key}>
            {s.key === 'duration'
              ? `Duration: ${point.humanDuration}`
              : `${s.key}: ${point[s.key]}`}
          </div>
        ))}
        {show === 'Size' && (
          <>
            <div>Total Volume Size: {formatBytes(point.totalVolumeSize)}</div>
            <div>Volume Breakdown:</div>
            <ul style={{
              margin: 0,
              paddingLeft: 16
            }}>
              {volumeKeys.map((k) => (
                <li key={k}>{k.replace('volume_', '')}: {formatBytes(point[k] || 0)}</li>
              ))}
            </ul>
          </>
        )}
        <div>Phase: {point.phase}</div>
        <div>Failure: {point.failureReason}</div>
      </Paper>
    );
  };

  return (
    <Box h="calc(100% - 35px)">
      <ResponsiveContainer width="100%" height={300}>
        {show === 'Size' ? (
          <BarChart data={transformedItems} margin={{
            top: 20,
            right: 30,
            left: 10,
            bottom: 5
          }}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="creation"/>
            <YAxis tickFormatter={(value) => formatBytes(value)}/>
            <Tooltip content={<CustomTooltip/>}/>
            <Legend/>
            {volumeKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="a"
                fill={`hsl(${(index * 60) % 360}, 70%, 50%)`}
                name={key.replace('volume_', '')}
              />
            ))}
          </BarChart>
        ) : (
          <LineChart data={transformedItems} margin={{
            top: 20,
            right: 30,
            left: 10,
            bottom: 5
          }}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="creation"/>
            <YAxis/>
            <Tooltip content={<CustomTooltip/>}/>
            <Legend/>
            {series.map((s) => (
              <Line
                key={s.key}
                type="linear"
                dataKey={s.key}
                stroke={s.color}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        )}
      </ResponsiveContainer>
    </Box>
  );
}
