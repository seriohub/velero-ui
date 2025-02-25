'use client';

import { useEffect, useState } from 'react';

import { useForm } from '@mantine/form';
import { closeAllModals } from '@mantine/modals';

import CreateBackupScheduleForm from '@/components/Features/Velero/Commons/Forms/CreateBackupScheduleForm';
import { useAppStatus } from '@/contexts/AppContext';
import { useCreationBackupSettings } from '@/api/Backup/useBackupSettings';
import { useCreateBackup } from '@/api/Backup/useCreateBackup';

interface CreateBackupProps {
  reload: number;
  setReload: any;
}

export function CreateBackup({ reload, setReload }: CreateBackupProps) {
  const appValues = useAppStatus();
  const { data, getCreationBackupSettings } = useCreationBackupSettings();

  const { handleCreateBackup } = useCreateBackup();

  const [namespaces, setNamespaces] = useState([]);
  const [backupLocation, setBackupLocation] = useState([]);
  const [snapshotLocation, setSnapshotLocation] = useState([]);
  const [resources, setResources] = useState([]);

  const form = useForm({
    initialValues: {
      name: '',
      includedNamespaces: [],
      excludedNamespaces: [],
      includedResources: [],
      excludedResources: [],
      backupRetention: '720h0m0s',
      snapshotVolumes: true,
      includeClusterResources: true,
      defaultVolumesToFsBackup: true,
      backupLabel: '',
      selector: '',
      backupLocation: '',
      snapshotLocation: [],
    },

    validate: {
      name: (value) => (value.length === 0 ? 'Invalid name' : null),
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
    }
  }, [data]);

  function createBackup(values: any) {
    handleCreateBackup(values);
    closeAllModals();
    const interval = setInterval(() => {
      setReload(reload + 1);
      clearInterval(interval);
    }, appValues.refreshDatatableAfter);
  }

  return (
    <CreateBackupScheduleForm
      resource="backup"
      mode="create"
      form={form}
      namespaces={namespaces}
      backupLocation={backupLocation}
      snapshotLocation={snapshotLocation}
      resources={resources}
      onDone={createBackup}
    />
  );
}
