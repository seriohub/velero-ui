import { useEffect, useState } from 'react';
import { Card, Grid } from '@mantine/core';
import { useVeleroManifest } from '@/api/Velero/useVeleroManifest';
import { useAgentStatus } from '@/contexts/AgentContext';

import Toolbar from '@/components/Display/Toolbar';
import ReloadData from '@/components/Inputs/ReloadData';

import { PageScrollArea } from '@/components/Commons/PageScrollArea';

import { ScheduleDetailsView } from '@/components/Features/Velero/Schedules/ScheduleDetailsView';
import { Manifest } from '@/components/Features/Velero/Commons/Display/Manifest';
import { BackupsDatatable } from '@/components/Features/Velero/Backups/BackupsDatatable';
import DeleteAction from '@/components/Features/Velero/Commons/Actions/DeleteAction';
import { isRecordStringAny } from '@/utils/isRecordStringIsType';
import EditScheduleAction from '@/components/Features/Velero/Schedules/Action/EditScheduleAction';
import CreateBackupFromScheduleAction from '@/components/Features/Velero/Schedules/Action/CreateBackupFromScheduleAction';
import StartStopActionIcon from '@/components/Features/Velero/Schedules/StartStopActionIcon';

interface ScheduleProps {
  params: any;
}

export function ScheduleDetails({ params }: ScheduleProps) {
  const { data, getManifest, fetching } = useVeleroManifest();
  const [reload, setReload] = useState(1);
  const agentValues = useAgentStatus();
  const [manifest, setManifest] = useState<Record<string, any>>([]);

  useEffect(() => {
    if (params.schedule) {
      getManifest('schedule', params.schedule, false);
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
        title="Schedule"
        breadcrumbItem={[
          {
            name: 'Schedules',
            href: '/schedules/',
          },
          {
            name: `${params.schedule}`,
          },
        ]}
      >
        <ReloadData setReload={setReload} reload={reload} />
        <CreateBackupFromScheduleAction record={manifest} buttonType="button" />
        <StartStopActionIcon
          resourceName={manifest?.metadata?.name}
          paused={manifest?.spec?.paused === true}
          reload={reload}
          setReload={setReload}
          buttonType="button"
        />
        <EditScheduleAction record={manifest} setReload={setReload} buttonType="button" />
        <DeleteAction
          resourceType="schedule"
          record={manifest}
          setReload={setReload}
          buttonType="button"
          redirectAfterDelete="/schedules"
        />
      </Toolbar>

      <Grid gutter="sm">
        <Grid.Col
          span={{
            base: 12,
            md: 12,
            lg: 4,
          }}
        >
          <ScheduleDetailsView data={data} fetching={fetching} />
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
              <Manifest resourceType="schedule" resourceName={params.schedule} h={570} />
            </Card.Section>
          </Card>
        </Grid.Col>
      </Grid>

      <Card shadow="sm" mt="sm" radius="md" withBorder h={400} p={0}>
        <BackupsDatatable scheduleName={params.schedule} />
      </Card>
    </PageScrollArea>
  );
}
