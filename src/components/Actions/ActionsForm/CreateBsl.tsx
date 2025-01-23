'use client';

import { useForm } from '@mantine/form';
import { closeAllModals } from '@mantine/modals';

import { useAppStatus } from '@/contexts/AppContext';

import CreateBslForm from '@/components/Actions/ActionsForm/CreateBslForm';
import { useCreateBsl } from '@/api/BackupLocation/useCreateBsl';

interface CreateBslProps {
  reload: number;
  setReload: any;
}

export function CreateBsl({ reload, setReload }: CreateBslProps) {
  const appValues = useAppStatus();

  const { handleCreateBsl } = useCreateBsl();

  const form = useForm({
    initialValues: {
      name: '',
      provider: '',
      bucketName: '',
      config: {},
      accessMode: 'ReadWrite',

      credentialSecretName: '',
      credentialKey: '',

      //newSecretName: '',
      //newSecretKey: '',
      //awsAccessKeyId: '',
      //awsSecretAccessKey: '',

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

  return <CreateBslForm mode="create" form={form} onDone={createBsl} />;
}
