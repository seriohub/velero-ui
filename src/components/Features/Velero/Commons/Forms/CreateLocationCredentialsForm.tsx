import { useForm } from '@mantine/form';

import { useAppStatus } from '@/contexts/AppContext';

import CreateCredentialsLocationFormView from '@/components/Features/Velero/Commons/Forms/CreateCredentialsLocationFormView';
import { useCreateLocationCredentials } from '@/api/Velero/useCreateLocationCredentials';

interface CreateBslProps {
  reload: number;
  setReload: React.Dispatch<React.SetStateAction<number>>;
  close: any;
}

export function CreateLocationCredentialsForm({ reload, setReload, close }: CreateBslProps) {
  const appValues = useAppStatus();

  const { handleCreateCredentials } = useCreateLocationCredentials();

  const form = useForm({
    initialValues: {
      newSecretName: '',
      newSecretKey: 'cloud',
      awsAccessKeyId: '',
      awsSecretAccessKey: '',
    },

    validate: {
      newSecretName: (value) => (value.length === 0 ? 'Invalid name' : null),
      newSecretKey: (value) => (value.length === 0 ? 'Invalid secret key' : null),
      awsAccessKeyId: (value) => (value.length === 0 ? 'Invalid access key id' : null),
      awsSecretAccessKey: (value) => (value.length === 0 ? 'Invalid secret access key' : null),
    },
  });

  function createBsl(values: any) {
    handleCreateCredentials(values);
    close();
    /*const interval = setInterval(() => {
      setReload(reload + 1);
      clearInterval(interval);
    }, appValues.refreshDatatableAfter);*/
  }

  return <CreateCredentialsLocationFormView mode="create" form={form} onDone={createBsl} />;
}
