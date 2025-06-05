import { useBackups } from '@/api/Backup/useBackups';
import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { eventEmitter } from '@/lib/EventEmitter.js';
import { Box, Center, SegmentedControl } from '@mantine/core';
import { BackupsCharts } from '@/components/Features/Velero/Schedules/BackupsCharts';
import { usePodVolumes } from '@/api/PodVolumeBackups/usePodVolumes';

interface BackupsOverviewProps {
  scheduleName?: string;
}

export function BackupsOverview({ scheduleName }: BackupsOverviewProps) {
  const {
    data: backups,
    getBackups,
  } = useBackups();

  const [reload, setReload] = useState(5);
  const [pvbBackup, setPvbBackup] = useState([]);
  const [value, setValue] = useState('Status')

  // useWatchResources('backups');
  /* watch */
  const handleWatchResources = debounce((message) => {
    if (message?.payload?.resources === 'backups' || message?.payload?.resources === 'deletebackuprequests') {
      setReload((prev) => prev + 1);
    }
  }, 150);

  useEffect(() => {
    eventEmitter.on('watchResources', handleWatchResources);

    return () => {
      eventEmitter.off('watchResources', handleWatchResources);
    };
  }, []);
  /* end watch */

  useEffect(() => {
    getBackups({
      scheduleName,
      onlyLast4Schedule: false,
      forced: true,
    });
  }, [reload]);

  const {
    data: pvbs,
    getPodVolumes,
  } = usePodVolumes();

  useEffect(() => {
    getPodVolumes('PodVolumeBackup').then(response => {
      const backupNames = backups ? backups.map((backup: any) => backup.metadata?.name).filter(Boolean) : [];
      const relatedPvbs = pvbs ? response.filter((pvb: any) =>
        backupNames.includes(pvb.spec?.tags?.backup)
      ) : [];
      setPvbBackup(relatedPvbs);
    })
  }, [backups, pvbs]);

  const segmentedControlValues = [
    {
      label: 'Errors & Warnings',
      value: 'Status'
    },
    {
      label: 'Backed Up Items',
      value: 'Items'
    },
    {
      label: 'Operation Duration',
      value: 'Duration'
    }
  ]

  if (pvbBackup.length > 0) {
    segmentedControlValues.push({
      label: 'Pod Volume Backup Size',
      value: 'Size'
    })
  }

  return (
    <Box h="calc(100% - 35px)">
      <Center>
        <SegmentedControl
          value={value}
          onChange={setValue}
          data={segmentedControlValues}
        />
      </Center>
      <BackupsCharts data={backups} show={value} pvbBackup={pvbBackup}/>
    </Box>
  )

}
