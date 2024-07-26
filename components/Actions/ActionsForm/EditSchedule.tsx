'use client';

import { useEffect, useState } from 'react';

import { useForm } from '@mantine/form';
import { closeAllModals } from '@mantine/modals';

import { useApiGet } from '@/hooks/useApiGet';
import { useApiPost } from '@/hooks/useApiPost';
import CreateBackupScheduleForm from './CreateBackupScheduleForm';
import { useAppState } from '@/contexts/AppStateContext';

interface EditScheduleProps {
  record: any;
  reload: number;
  setReload: any;
}
export function EditSchedule({ record, reload, setReload }: EditScheduleProps) {
  const appValues = useAppState();
  const { data, getData } = useApiGet();

  const { postData } = useApiPost();

  const [namespaces, setNamespaces] = useState([]);
  const [backupLocation, setBackupLocation] = useState([]);
  const [snapshotLocation, setSnapshotLocation] = useState([]);
  const [resources, setResources] = useState([]);

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
    if (process.env.NODE_ENV === 'development') console.log(`%cuseEffect 210 has been called`, `color: green; font-weight: bold;`)
    getData({url:'/v1/schedule/create/settings'});
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') console.log(`%cuseEffect 220 has been called`, `color: green; font-weight: bold;`)
    if (data !== undefined) {
      setNamespaces(data.payload.namespaces);
      setBackupLocation(data.payload.backup_location);
      setSnapshotLocation(data.payload.snapshot_location);
      setResources(data.payload.resources);
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
    }, appValues.refreshDatatableAfter);
  }

  return (
    <CreateBackupScheduleForm
      resource="schedule"
      mode="edit"
      form={form}
      namespaces={namespaces}
      backupLocation={backupLocation}
      snapshotLocation={snapshotLocation}
      resources={resources}
      onDone={createSchedule}
    />
  );
}
