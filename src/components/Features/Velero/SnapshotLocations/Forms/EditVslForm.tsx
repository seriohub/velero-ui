import { useForm } from '@mantine/form';
import { closeAllModals } from '@mantine/modals';

import { useAppStatus } from '@/contexts/AppContext';

import { useUpdateVsl } from '@/api/SnapshotLocation/useUpdateVsl';
import VslFormView from '@/components/Features/Velero/SnapshotLocations/Forms/VslFormView';

interface EditBslProps {
  record: any;
  setReload: any;
}

export function EditVslForm({
                              record,
                              setReload
                            }: EditBslProps) {
  const appValues = useAppStatus();

  const { handleUpdateVsl } = useUpdateVsl();

  const form = useForm({
    initialValues: {
      name: record?.metadata?.name,
      provider: record?.spec?.provider,
      config: record?.spec?.config || {},
      credentialName: record?.spec?.credential?.name || null,
      credentialKey: record?.spec?.credential?.key || null,
    },

    validate: {
      name: (value) => (value.length === 0 ? 'Invalid name' : null),
      provider: (value) => (value.length === 0 ? 'Invalid provider' : null),
      credentialName: (value, values) => {
        if ((value && !values.credentialKey) || (!value && values.credentialKey)) {
          return 'Both Secret Name and Secret Key must be filled or both must be empty';
        }
        return null;
      },
      credentialKey: (value, values) => {
        if ((value && !values.credentialName) || (!value && values.credentialName)) {
          return 'Both Secret Name and Secret Key must be filled or both must be empty';
        }
        return null;
      },
    },
  });

  function updateBsl(values: any) {
    handleUpdateVsl(values);
    closeAllModals();
    /*const interval = setInterval(() => {
      setReload((prev: number) => prev + 1);
      clearInterval(interval);
    }, appValues.refreshDatatableAfter);*/
  }

  return <VslFormView mode="edit" form={form} onDone={updateBsl}/>;
}
