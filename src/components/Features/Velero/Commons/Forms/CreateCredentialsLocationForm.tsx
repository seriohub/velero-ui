import { Box, Button, Group, TextInput, Divider } from '@mantine/core';

interface CreateCredentialsLocationFormProps {
  form: any;
  onDone: any;
  mode: string;
}

export default function CreateCredentialsLocationForm({
  form,
  onDone,
  mode,
}: CreateCredentialsLocationFormProps) {
  return (
    <Box mx="auto">
      <form
        onSubmit={form.onSubmit((values: any) => {
          onDone(values);
        })}
      >
        <TextInput
          label="Secret name"
          placeholder=""
          {...form.getInputProps('newSecretName')}
          required
        />

        <TextInput
          label="Secret key"
          placeholder="cloud"
          {...form.getInputProps('newSecretKey')}
          required
        />

        <TextInput
          label="AWS access key id"
          placeholder=""
          {...form.getInputProps('awsAccessKeyId')}
          required
        />

        <TextInput
          label="AWS secret access key"
          placeholder=""
          {...form.getInputProps('awsSecretAccessKey')}
          required
        />

        <Divider my="sm" />

        <Group justify="flex-end" mt="md">
          <Button type="submit"> {mode === 'create' ? 'Create' : 'Update'}</Button>
        </Group>
      </form>
    </Box>
  );
}
