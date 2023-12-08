'use client';

import { useEffect, useState } from 'react';

import { useForm } from '@mantine/form';
import { closeAllModals } from '@mantine/modals';

import { useApiWithGet } from '@/hooks/useApiWithGet';
import { useApiWithPost } from '@/hooks/useApiWithPost';
import CreateBackupScheduleForm from './CreateBackupScheduleForm';

interface CreateBackupProps {
  reload: number;
  setReload: any;
}

export function CreateBackup({ reload, setReload }: CreateBackupProps) {
  const { data, getData, error, fetching } = useApiWithGet();

  const { postData } = useApiWithPost();

  const [namespaces, setNamespaces] = useState([]);
  const [backupLocation, setBackupLocation] = useState([]);
  const [snapshotLocation, setSnapshotLocation] = useState([]);

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
    getData('/api/v1/backup/create/settings');
  }, []);

  useEffect(() => {
    if (data !== undefined) {
      setNamespaces(data.payload.namespaces);
      setBackupLocation(data.payload.backup_location);
      setSnapshotLocation(data.payload.snapshot_location);
    }
  }, [data]);

  function createBackup(values: any) {
    postData('/api/v1/backup/create', {
      values,
    });
    closeAllModals();
    const interval = setInterval(() => {
      setReload(reload + 1);
      clearInterval(interval);
    }, 3000);
  }

  return (
    <>
      <CreateBackupScheduleForm
        resource="backup"
        mode="create"
        form={form}
        namespaces={namespaces}
        backupLocation={backupLocation}
        snapshotLocation={snapshotLocation}
        onDone={createBackup}
      />
    </>
  );
}
