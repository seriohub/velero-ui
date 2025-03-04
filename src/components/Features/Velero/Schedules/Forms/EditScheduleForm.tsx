import { useEffect, useState } from 'react';

import { useForm } from '@mantine/form';
import { closeAllModals } from '@mantine/modals';

import BackupScheduleFormView from '@/components/Features/Velero/Commons/Forms/BackupScheduleFormView';
import { useAppStatus } from '@/contexts/AppContext';
import { useCreationScheduleSettings } from '@/api/Schedule/useScheduleSettings';
import { useUpdateSchedule } from '@/api/Schedule/useUpdateSchedule';

interface EditScheduleProps {
  record: any;
  setReload: React.Dispatch<React.SetStateAction<number>>;
}

const ttlRegex = /^(\d+h)?(\d+m)?(\d+s)?$/;
const timeoutRegex = /^\d+[smh]$/;

export function EditScheduleForm({ record, setReload }: EditScheduleProps) {
  const appValues = useAppStatus();
  const { data, getCreationScheduleSettings } = useCreationScheduleSettings();

  const { handleUpdateSchedule } = useUpdateSchedule();

  const [namespaces, setNamespaces] = useState([]);
  const [backupLocation, setBackupLocation] = useState([]);
  const [snapshotLocation, setSnapshotLocation] = useState([]);
  const [resources, setResources] = useState([]);
  const [resourcesPolicy, setResourcesPolicy] = useState([]);

  const form = useForm({
    initialValues: {
      // metadata
      name: record.metadata.name,
      schedule: record.spec.schedule,
      paused: record.spec.paused,
      useOwnerReferencesInBackup: record.spec.useOwnerReferencesInBackup,

      // spec.template
      csiSnapshotTimeout: record.spec.template.csiSnapshotTimeout || '10m',
      ttl: record.spec.template.ttl || '7203h0m0s',
      includedNamespaces: record.spec.template.includedNamespaces || [],
      excludedNamespaces: record.spec.template.excludedNamespaces || [],
      includedResources: record.spec.template.includedResources || [],
      excludedResources: record.spec.template.excludedResources || [],
      includeClusterResources: record.spec.template.includeClusterResources || null,
      defaultVolumesToFsBackup: record.spec.template.defaultVolumesToFsBackup,
      snapshotVolumes: record.spec.template.snapshotVolumes,
      storageLocation: record.spec.template.storageLocation,
      volumeSnapshotLocations: record.spec.template.volumeSnapshotLocations || [],
      datamover: record.spec.template.datamover || '',
      parallelFilesUpload: record.spec.template?.uploaderConfig?.parallelFilesUpload || 10,

      // spec.template.resourcePolicy
      resourcePolicy: record.spec.template?.resourcePolicy?.name || null,

      // spec.labelselector
      labelSelector: record.spec.template?.labelSelector?.matchLabels || {},
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
    handleUpdateSchedule(values);
    closeAllModals();
    const interval = setInterval(() => {
      setReload((prev) => prev + 1);
      clearInterval(interval);
    }, appValues.refreshDatatableAfter);
  }

  return (
    <BackupScheduleFormView
      resource="schedule"
      mode="edit"
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
