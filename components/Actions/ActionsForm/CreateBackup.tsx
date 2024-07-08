'use client';

import { useEffect, useState } from 'react';

import { useForm } from '@mantine/form';
import { closeAllModals } from '@mantine/modals';

import { useApiGet } from '@/hooks/useApiGet';
import { useApiPost } from '@/hooks/useApiPost';
import CreateBackupScheduleForm from './CreateBackupScheduleForm';
import { useAppState } from '@/contexts/AppStateContext';

interface CreateBackupProps {
  reload: number;
  setReload: any;
}

export function CreateBackup({ reload, setReload }: CreateBackupProps) {
  const appValues = useAppState();
  const { data, getData } = useApiGet();

  const { postData } = useApiPost();

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
    getData({ url: '/v1/backup/create/settings' });
  }, []);

  useEffect(() => {
    if (data !== undefined) {
      setNamespaces(data.payload.namespaces);
      setBackupLocation(data.payload.backup_location);
      setSnapshotLocation(data.payload.snapshot_location);
      setResources(data.payload.resources);
    }
  }, [data]);

  function createBackup(values: any) {
    postData('/v1/backup/create', values);
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
