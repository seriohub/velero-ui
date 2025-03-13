import { useEffect, useState } from 'react';

import { useForm } from '@mantine/form';
import { closeAllModals } from '@mantine/modals';

import BackupScheduleFormView from '@/components/Features/Velero/Commons/Forms/BackupScheduleFormView';
// import { useAppStatus } from '@/contexts/AppContext';
import { useCreationBackupSettings } from '@/api/Backup/useBackupSettings';
import { useCreateBackup } from '@/api/Backup/useCreateBackup';

const ttlRegex = /^(\d+h)?(\d+m)?(\d+s)?$/;
const timeoutRegex = /^\d+[smh]$/;

export function CreateBackupForm() {
  // const appValues = useAppStatus();
  const { data, getCreationBackupSettings } = useCreationBackupSettings();

  const { handleCreateBackup } = useCreateBackup();

  const [namespaces, setNamespaces] = useState([]);
  const [backupLocation, setBackupLocation] = useState([]);
  const [snapshotLocation, setSnapshotLocation] = useState([]);
  const [resources, setResources] = useState([]);
  const [resourcesPolicy, setResourcesPolicy] = useState([]);

  const form = useForm({
    initialValues: {
      // metadata
      name: '',

      // spec
      csiSnapshotTimeout: '10m',
      itemOperationTimeout: '4h',
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

      // resourcePolicy
      resourcePolicy: null,

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
      itemOperationTimeout: (value) =>
        timeoutRegex.test(value)
          ? null
          : 'Invalid format. Expected a number followed by s, m, or h',
    },
  });

  useEffect(() => {
    getCreationBackupSettings();
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

  function createBackup(values: any) {
    handleCreateBackup(values);
    closeAllModals();
    /*const interval = setInterval(() => {
      setReload(reload + 1);
      clearInterval(interval);
    }, appValues.refreshDatatableAfter);*/
  }

  return (
    <BackupScheduleFormView
      resource="backup"
      mode="create"
      form={form}
      namespaces={namespaces}
      backupLocation={backupLocation}
      snapshotLocation={snapshotLocation}
      resources={resources}
      resourcePolicy={resourcesPolicy}
      onDone={createBackup}
    />
  );
}
