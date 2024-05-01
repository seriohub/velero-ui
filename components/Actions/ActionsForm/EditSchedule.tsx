'use client';

import { useContext, useEffect, useState } from 'react';

import { useForm } from '@mantine/form';
import { closeAllModals } from '@mantine/modals';

import { useApiGet } from '@/hooks/useApiGet';
import { useApiPost } from '@/hooks/useApiPost';
import CreateBackupScheduleForm from './CreateBackupScheduleForm';
import VeleroAppContexts from '@/contexts/VeleroAppContexts';

interface EditScheduleProps {
  record: any;
  reload: number;
  setReload: any;
}
export function EditSchedule({ record, reload, setReload }: EditScheduleProps) {
  const appValues = useContext(VeleroAppContexts);
  const { data, getData } = useApiGet();

  const { postData } = useApiPost();

  const [namespaces, setNamespaces] = useState([]);
  const [backupLocation, setBackupLocation] = useState([]);
  const [snapshotLocation, setSnapshotLocation] = useState([]);

  const form = useForm({
    initialValues: {
      name: record.metadata.name,
      oldName: record.metadata.name,
      schedule: record.spec.schedule,
      includedNamespaces: record.spec.template.includedNamespaces,
      excludedNamespaces: record.spec.template.excludedNamespaces,
      includedResources: record.spec.template.includedResources,
      excludedResources: record.spec.template.excludedResources,
      backupRetention: record.spec.template.ttl,
      snapshotVolumes: record.spec.template.snapshotVolumes,
      includeClusterResources: record.spec.template.includeClusterResources
        ? record.spec.template.includeClusterResources.toString()
        : '',
      defaultVolumesToFsBackup: record.spec.template.defaultVolumesToFsBackup,
      backupLabel: record.spec.template.labelSelector
        ? Object.keys(record.spec.template.labelSelector.matchLabels)
        : '',
      selector: record.spec.template.labelSelector
        ? Object.values(record.spec.template.labelSelector.matchLabels)
        : '',
      backupLocation: record.spec.template.storageLocation,
      snapshotLocation: record.spec.template.volumeSnapshotLocations,
    },

    validate: {
      name: (value) => (value.length === 0 ? 'Invalid name' : null),
    },
  });

  useEffect(() => {
    getData('/v1/schedule/create/settings');
  }, []);

  useEffect(() => {
    if (data !== undefined) {
      setNamespaces(data.payload.namespaces);
      setBackupLocation(data.payload.backup_location);
      setSnapshotLocation(data.payload.snapshot_location);
    }
  }, [data]);

  function createSchedule(values: any) {
    postData('/v1/schedule/update', {
      values,
    });
    closeAllModals();
    const interval = setInterval(() => {
      setReload(reload + 1);
      clearInterval(interval);
    }, appValues.state.refreshDatatableAfter);
  }

  return (
    <CreateBackupScheduleForm
      resource="schedule"
      mode="edit"
      form={form}
      namespaces={namespaces}
      backupLocation={backupLocation}
      snapshotLocation={snapshotLocation}
      onDone={createSchedule}
    />
  );
}
