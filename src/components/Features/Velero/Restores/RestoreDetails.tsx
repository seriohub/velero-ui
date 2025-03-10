'use client';

import { useEffect, useState } from 'react';
import { Card, Grid } from '@mantine/core';

import { useVeleroManifest } from '@/api/Velero/useVeleroManifest';

import { useAgentStatus } from '@/contexts/AgentContext';

import { PageScrollArea } from '@/components/Commons/PageScrollArea';

import Toolbar from '@/components/Display/Toolbar';
import ReloadData from '@/components/Inputs/ReloadData';

import { ResourceLogs } from '@/components/Features/Velero/Logs/ResourceLogs';

import { Manifest } from '@/components/Features/Velero/Commons/Display/Manifest';
import DeleteAction from '@/components/Features/Velero/Commons/Actions/DeleteAction';
import { isRecordStringAny } from '@/utils/isRecordStringIsType';
import { RestoreDetailsView } from '@/components/Features/Velero/Restores/RestoreDetailsView';

interface RestoreProps {
  params: any;
}

export function RestoreDetails({ params }: RestoreProps) {
  const { data, getManifest } = useVeleroManifest();
  const [reload, setReload] = useState(1);
  const agentValues = useAgentStatus();
  const [manifest, setManifest] = useState<Record<string, any>>([]);
  useEffect(() => {
    if (params.restore) {
      getManifest('restore', params.restore, false);
    }
  }, [agentValues.isAgentAvailable, reload]);
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
        title="Restore"
        breadcrumbItem={[
          {
            name: 'Restores',
            href: '/restores/',
          },
          {
            name: `${params.restore}`,
          },
        ]}
      >
        <DeleteAction
          resourceType="restore"
          record={manifest}
          setReload={setReload}
          buttonType="button"
          redirectAfterDelete="/backups"
        />
        <ReloadData setReload={setReload} reload={reload} />
      </Toolbar>

      <Grid gutter="sm">
        <Grid.Col
          span={{
            base: 12,
            md: 12,
            lg: 4,
          }}
        >
          <RestoreDetailsView data={data} />
        </Grid.Col>

        <Grid.Col
          span={{
            base: 12,
            md: 12,
            lg: 8,
          }}
        >
          <Card shadow="sm" padding="lg" radius="md" withBorder h={600}>
            <Card.Section withBorder inheritPadding p="sm">
              <Manifest resourceType="restore" resourceName={params.restore} h={570} />
            </Card.Section>
          </Card>

        </Grid.Col>
      </Grid>

      <Card shadow="sm" mt="md" radius="md" withBorder p={0}>
        <ResourceLogs resourceType="restore" resourceName={data?.metadata.name} />
      </Card>
    </PageScrollArea>
  );
}
