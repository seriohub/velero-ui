'use client';

import { useEffect, useState } from 'react';

import { useForm } from '@mantine/form';
import { closeAllModals } from '@mantine/modals';

import CreateBackupScheduleForm from './CreateBackupScheduleForm';
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
    // if (process.env.NODE_ENV === 'development')
    //  console.log(`%cuseEffect 140 has been called`, `color: green; font-weight: bold;`);
    getCreationBackupSettings();
  }, []);

  useEffect(() => {
    // if (process.env.NODE_ENV === 'development')
    //  console.log(`%cuseEffect 150 has been called`, `color: green; font-weight: bold;`);
    if (data !== undefined) {
      setNamespaces(data.payload.namespaces);
      setBackupLocation(data.payload.backup_location);
      setSnapshotLocation(data.payload.snapshot_location);
      setResources(data.payload.resources);
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
