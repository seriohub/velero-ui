import { Loader, Center, Box, TextInput, Group, Button } from '@mantine/core';
import { useEffect } from 'react';
import { useForm } from '@mantine/form';
import { closeAllModals } from '@mantine/modals';
import 'react-json-view-lite/dist/index.css';
import { useBackupExpiration } from '@/api/Backup/useBackupExpiration';
import { useBackupUpdateExpiration } from '@/api/Backup/useBackupUpdateExpiration';

interface UpdateExpirationProps {
  record: any;
  setReload: React.Dispatch<React.SetStateAction<number>>;
}

export function UpdateExpirationForm({ record, setReload }: UpdateExpirationProps) {
  const { data, getBackupExpiration } = useBackupExpiration();
  const { backupUpdateExpiration } = useBackupUpdateExpiration();

  const form = useForm({
    initialValues: {
      expiration: '',
    },
    validate: {
      expiration: (value) => (value.length === 0 ? 'Invalid expiration' : null),
    },
  });

  useEffect(() => {
    getBackupExpiration(record?.metadata?.name);
  }, []);

  useEffect(() => {
    if (data !== undefined) {
      form.setFieldValue('expiration', data.toString());
    }
  }, [data]);

  if (record === undefined) {
    return (
      <Center>
        <Loader color="blue" />
      </Center>
    );
  }

  function onDone(values: any) {
    backupUpdateExpiration(record?.metadata?.name, values?.expiration).finally(() =>
      setReload((prev: number) => prev + 1)
    );
    closeAllModals();
  }

  return (
    <>
      <Box mx="auto">
        <form
          onSubmit={form.onSubmit((values: any) => {
            onDone(values);
          })}
        >
          <TextInput
            mt={20}
            label="Set new backup expiration"
            placeholder=""
            {...form.getInputProps('expiration')}
          />
          <Group justify="flex-end" mt="md">
            <Button type="submit">Update</Button>
          </Group>
        </form>
      </Box>
    </>
  );
}
