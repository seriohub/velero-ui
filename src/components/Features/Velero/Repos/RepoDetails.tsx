'use client';

import { useEffect, useState } from 'react';
import { Card, Grid } from '@mantine/core';
import { debounce } from 'lodash';
import { useVeleroManifest } from '@/api/Velero/useVeleroManifest';
import { useAgentStatus } from '@/contexts/AgentContext';

import { PageScrollArea } from '@/components/Commons/PageScrollArea';

import Toolbar from '@/components/Display/Toolbar';
import ReloadData from '@/components/Inputs/ReloadData';
import { DetailsView } from '@/components/Features/Velero/Repos/DetailsView';
import { Manifest } from '@/components/Features/Velero/Commons/Display/Manifest';
import { isRecordStringAny } from '@/utils/isRecordStringIsType';
import { eventEmitter } from '@/lib/EventEmitter.js';
import { useWatchResources } from '@/hooks/useWatchResources';

interface BackupProps {
  params: any;
}

export function RepoDetails({ params }: BackupProps) {
  const { data, getManifest, fetching } = useVeleroManifest();
  const [reload, setReload] = useState(1);
  const agentValues = useAgentStatus();
  const [manifest, setManifest] = useState<Record<string, any>>([]);

  /* watch */
  useWatchResources('backuprepositories');
  const handleWatchResources = debounce((message) => {
    if (
      message?.resources === 'backuprepositories' &&
      message?.resource?.metadata?.name === params.repo
    ) {
      setManifest(message?.resource);
    }
  }, 250);

  useEffect(() => {
    eventEmitter.on('watchResources', handleWatchResources);

    return () => {
      eventEmitter.off('watchResources', handleWatchResources);
    };
  }, []);
  /* end watch */

  useEffect(() => {
    if (params.repo) {
      getManifest('BackupRepository', params.repo, false);
    }
  }, [agentValues.isAgentAvailable]);

  useEffect(() => {
    if (isRecordStringAny(data)) {
      setManifest(data);
    } else {
      setManifest([]);
    }
  }, [data]);

  return (
    <PageScrollArea>
      <Toolbar
        title="Volume Snapshot Locations"
        breadcrumbItem={[
          {
            name: 'Backup Repository',
            href: '/repos/',
          },
          {
            name: `${params.repo}`,
          },
        ]}
      >
        <ReloadData setReload={setReload} reload={reload} />
      </Toolbar>
      <Grid gutter="sm">
        <Grid.Col span={4}>
          <DetailsView data={manifest} fetching={fetching} h={600} />
        </Grid.Col>

        <Grid.Col span={8}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h={600}>
            <Card.Section withBorder inheritPadding p="sm">
              <Manifest resourceType="BackupRepository" resourceName={params.repo} h={575} />
            </Card.Section>
          </Card>
        </Grid.Col>
      </Grid>
    </PageScrollArea>
  );
}
