import { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { useVeleroManifest } from '@/api/Velero/useVeleroManifest';
import { useAgentStatus } from '@/contexts/AgentContext';

import Toolbar from '@/components/Display/Toolbar';
import ReloadData from '@/components/Inputs/ReloadData';

import { ScheduleDetailsView } from '@/components/Features/Velero/Schedules/ScheduleDetailsView';
import { Manifest } from '@/components/Features/Velero/Commons/Display/Manifest';
import { BackupsDatatable } from '@/components/Features/Velero/Backups/BackupsDatatable';
import DeleteAction from '@/components/Features/Velero/Commons/Actions/DeleteAction';
import { isRecordStringAny } from '@/utils/isRecordStringIsType';
import EditScheduleAction from '@/components/Features/Velero/Schedules/Action/EditScheduleAction';
import CreateBackupFromScheduleAction
  from '@/components/Features/Velero/Schedules/Action/CreateBackupFromScheduleAction';
import StartStopActionIcon from '@/components/Features/Velero/Schedules/StartStopActionIcon';
import { useWatchResources } from '@/hooks/useWatchResources';
import { eventEmitter } from '@/lib/EventEmitter.js';
import { VeleroDetailsLayout } from "@/components/Commons/VeleroDetailsLayout";

interface ScheduleProps {
  params: any;
}

export function ScheduleDetails({ params }: ScheduleProps) {
  const {
    data,
    getManifest,
    fetching
  } = useVeleroManifest();
  const [reload, setReload] = useState(1);
  const agentValues = useAgentStatus();
  const [manifest, setManifest] = useState<Record<string, any>>([]);

  /* watch */
  useWatchResources('schedules');
  const handleWatchResources = debounce((message) => {
    if (
      message?.payload?.resources === 'schedules' &&
      message?.payload?.resource?.metadata?.name === params.schedule
    ) {
      setReload((prev) => prev + 1);
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
    <VeleroDetailsLayout
      toolbar={
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
          <ReloadData setReload={setReload} reload={reload}/>
          <CreateBackupFromScheduleAction record={manifest} buttonType="button"/>
          <StartStopActionIcon
            resourceName={manifest?.metadata?.name}
            paused={manifest?.spec?.paused === true}
            reload={reload}
            setReload={setReload}
            buttonType="button"
          />
          <EditScheduleAction record={manifest} setReload={setReload} buttonType="button"/>
          <DeleteAction
            resourceType="schedule"
            record={manifest}
            setReload={setReload}
            buttonType="button"
            redirectAfterDelete="/schedules"
          />
        </Toolbar>
      }
      details={<ScheduleDetailsView data={manifest} fetching={fetching}/>}
      manifest={<Manifest resourceType="Schedule" resourceName={params.schedule} reload={reload}/>}
      tabs={(height) => (
        <BackupsDatatable scheduleName={params.schedule}/>
      )}
    />
  );
}
