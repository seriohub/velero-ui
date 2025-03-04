import { Box, Button, Group, TextInput, Input } from '@mantine/core';

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
        <Input.Wrapper
          label="Secret name"
          description="Name of the secret within the Velero namespace to store the credentials"
          required
        >
          <TextInput placeholder="" {...form.getInputProps('newSecretName')} />
        </Input.Wrapper>

        <Input.Wrapper
          label="Secret name"
          description="The key to use within the secret"
          mt={10}
          required
        >
          <TextInput placeholder="cloud" {...form.getInputProps('newSecretKey')} />
        </Input.Wrapper>

        <Input.Wrapper label="AWS access key id" mt={10} required>
          <TextInput placeholder="" {...form.getInputProps('awsAccessKeyId')} />
        </Input.Wrapper>

        <Input.Wrapper label="AWS access key id" mt={10} required>
          <TextInput
            placeholder=""
            {...form.getInputProps('awsSecretAccessKey')}
          />
        </Input.Wrapper>
        <Group justify="flex-end" mt="md">
          <Button type="submit"> {mode === 'create' ? 'Create' : 'Update'}</Button>
        </Group>
      </form>
    </Box>
  );
}
