import { useEffect, useState } from 'react';

import { useForm } from '@mantine/form';
import { closeAllModals } from '@mantine/modals';

import BackupScheduleFormView from '@/components/Features/Velero/Commons/Forms/BackupScheduleFormView';
import { useAppStatus } from '@/contexts/AppContext';
import { useCreationScheduleSettings } from '@/api/Schedule/useScheduleSettings';
import { useCreateSchedule } from '@/api/Schedule/useCreateSchedule';

interface CreateScheduleProps {
  reload: number;
  setReload: React.Dispatch<React.SetStateAction<number>>;
}

const ttlRegex = /^(\d+h)?(\d+m)?(\d+s)?$/;
const timeoutRegex = /^\d+[smh]$/;

export function CreateScheduleForm({ reload, setReload }: CreateScheduleProps) {
  const appValues = useAppStatus();
  const { data, getCreationScheduleSettings } = useCreationScheduleSettings();

  const { handleCreateSchedule } = useCreateSchedule();

  const [namespaces, setNamespaces] = useState([]);
  const [backupLocation, setBackupLocation] = useState([]);
  const [snapshotLocation, setSnapshotLocation] = useState([]);
  const [resources, setResources] = useState([]);
  const [resourcesPolicy, setResourcesPolicy] = useState([]);

  const form = useForm({
    initialValues: {
      // metadata
      name: '',
      schedule: '0 * * * *',
      paused: false,
      useOwnerReferencesInBackup: false,

      // spec.template
      csiSnapshotTimeout: '10m',
      ttl: '720h0m0s',
      includedNamespaces: [],
      excludedNamespaces: [],
      includedResources: [],
      excludedResources: [],
      includeClusterResources: null,
      defaultVolumesToFsBackup: true,
      snapshotVolumes: null,
      storageLocation: null,
      volumeSnapshotLocations: [],
      datamover: '',
      parallelFilesUpload: 10,
      resourcePolicy: null,
      snapshotMoveData:true,

      // spec.labelselector
      labelSelector: {},
    },

    validate: {
      name: (value) => (value.length >= 3 ? null : 'Name must be at least 3 characters long'),
      ttl: (value) =>
        ttlRegex.test(value) ? null : 'Invalid TTL format. Expected format: 720h0m0s',
      parallelFilesUpload: (value) => (Number.isInteger(value) ? null : 'Value must be an integer'),
      csiSnapshotTimeout: (value) =>
        timeoutRegex.test(value)
          ? null
          : 'Invalid format. Expected a number followed by s, m, or h',
    },
  });

  useEffect(() => {
    getCreationScheduleSettings();
  }, []);

  useEffect(() => {
    if (data !== undefined) {
      setNamespaces(data.namespaces);
      setBackupLocation(data.backup_location);
      setSnapshotLocation(data.snapshot_location);
      setResources(data.resources);
      setResourcesPolicy(data.resource_policy);
    }
  }, [data]);

  function createSchedule(values: any) {
    handleCreateSchedule(values);
    closeAllModals();
    const interval = setInterval(() => {
      setReload(reload + 1);
      clearInterval(interval);
    }, appValues.refreshDatatableAfter);
  }

  return (
    <BackupScheduleFormView
      resource="schedule"
      mode="create"
      form={form}
      namespaces={namespaces}
      backupLocation={backupLocation}
      snapshotLocation={snapshotLocation}
      resources={resources}
      resourcePolicy={resourcesPolicy}
      onDone={createSchedule}
    />
  );
}
