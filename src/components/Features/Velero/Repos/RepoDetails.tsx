'use client';

import { useEffect, useState } from 'react';
import { Card, Grid } from '@mantine/core';
import { useVeleroManifest } from '@/api/Velero/useVeleroManifest';
import { useAgentStatus } from '@/contexts/AgentContext';

import { PageScrollArea } from '@/components/Commons/PageScrollArea';

import Toolbar from '@/components/Display/Toolbar';
import ReloadData from '@/components/Inputs/ReloadData';
import { DetailsView } from '@/components/Features/Velero/Repos/DetailsView';
import { Manifest } from '@/components/Features/Velero/Commons/Display/Manifest';
import { isRecordStringAny } from '@/utils/isRecordStringIsType';

interface BackupProps {
  params: any;
}

export function RepoDetails({ params }: BackupProps) {
  const { data, getManifest, fetching } = useVeleroManifest();
  const [reload, setReload] = useState(1);
  const agentValues = useAgentStatus();
  const [manifest, setManifest] = useState<Record<string, any>>([]);
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
          <DetailsView data={manifest} fetching={fetching} />
        </Grid.Col>

        <Grid.Col span={8}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h={600}>
            <Card.Section withBorder inheritPadding p="sm">
              <Manifest resourceType="BackupRepository" resourceName={params.repo} h={570} />
            </Card.Section>
          </Card>
        </Grid.Col>
      </Grid>
    </PageScrollArea>
  );
}
