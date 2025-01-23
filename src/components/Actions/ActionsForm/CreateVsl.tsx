'use client';

import { useForm } from '@mantine/form';
import { closeAllModals } from '@mantine/modals';

import { useAppStatus } from '@/contexts/AppContext';

import { useCreateVsl } from '@/api/SnapshotLocation/useCreateVsl';
import CreateVslForm from '@/components/Actions/ActionsForm/CreateVslForm';

interface CreateVslProps {
  reload: number;
  setReload: any;
}

export function CreateVsl({ reload, setReload }: CreateVslProps) {
  const appValues = useAppStatus();

  const { handleCreateVsl } = useCreateVsl();

  const form = useForm({
    initialValues: {
      name: '',
      provider: '',

      config: {},

      credentialSecretName: '',
      credentialKey: '',
    },

    validate: {
      name: (value) => (value.length === 0 ? 'Invalid name' : null),
      provider: (value) => (value.length === 0 ? 'Invalid provider' : null),
    },
  });

  function createVsl(values: any) {
    handleCreateVsl(values);
    closeAllModals();
    const interval = setInterval(() => {
      setReload(reload + 1);
      clearInterval(interval);
    }, appValues.refreshDatatableAfter);
  }

  return <CreateVslForm mode="create" form={form} onDone={createVsl} />;
}
