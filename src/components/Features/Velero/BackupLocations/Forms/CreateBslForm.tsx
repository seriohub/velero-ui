'use client';

import { useForm } from '@mantine/form';
import { closeAllModals } from '@mantine/modals';

import { useAppStatus } from '@/contexts/AppContext';

import CreateBslView from '@/components/Features/Velero/BackupLocations/Forms/CreateBslView';
import { useCreateBsl } from '@/api/BackupLocation/useCreateBsl';

interface CreateBslProps {
  reload: number;
  setReload: any;
}

export function CreateBslForm({ reload, setReload }: CreateBslProps) {
  const appValues = useAppStatus();

  const { handleCreateBsl } = useCreateBsl();

  const form = useForm({
    initialValues: {
      name: '',
      provider: '',
      bucketName: '',
      config: {},
      accessMode: 'ReadWrite',

      credentialName: '',
      credentialKey: '',

      synchronizationPeriod: '',
      validationFrequency: '',

      default: false,
    },

    validate: {
      name: (value) => (value.length === 0 ? 'Invalid name' : null),
      provider: (value) => (value.length === 0 ? 'Invalid provider' : null),
      bucketName: (value) => (value.length === 0 ? 'Invalid bucket name' : null),
      accessMode: (value) => (value.length === 0 ? 'Invalid access mode' : null),
    },
  });

  function createBsl(values: any) {
    handleCreateBsl(values);
    closeAllModals();
    const interval = setInterval(() => {
      setReload(reload + 1);
      clearInterval(interval);
    }, appValues.refreshDatatableAfter);
  }

  return <CreateBslView mode="create" form={form} onDone={createBsl} />;
}
