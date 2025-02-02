'use client';

import { useEffect, useState } from 'react';

import { Box, Card, Text } from '@mantine/core';

import WatchdogServiceConfigTable from '@/components/Inputs/WatchdogServiceConfigTable';
import { useWatchdogAppSecrets } from '@/api/Watchdog/useWatchdogAppSecrets';

interface CreateWatchdogServiceFormProps {
  form: any;
  onDone: any;
  mode: string;
}

export default function CreateWatchdogServiceForm({
  form,
  onDone,
  mode,
}: CreateWatchdogServiceFormProps) {
  const { data: dataServices, getWatchdogAppSecrets } = useWatchdogAppSecrets();

  const [services, setServices] = useState([]);
  const [config, setConfig] = useState([]);
  const [reload, setReload] = useState(1);

  useEffect(() => {
    form.setFieldValue('config', config);
  }, [config]);

  useEffect(() => {
    getWatchdogAppSecrets();
  }, [reload]);

  useEffect(() => {
    setServices(dataServices?.payload || []);
  }, [dataServices]);

  useEffect(() => {
    /*if (form.values.credentialSecretName) {
      getVeleroSecretKey(form.values.credentialSecretName);
    } else {
      form.setFieldValue('credentialKey', '');
      setSeks([]);
    }*/
  }, [form.values.credentialSecretName]);

  return (
    <>
      <Card withBorder radius="md" p="xl">
        <Card.Section withBorder inheritPadding p="xs">
          <Text fz="lg" fw={500}>
            Service notification
          </Text>
          <Text fz="xs" c="dimmed" mt={3} mb="xl">
            Config apprise service
          </Text>
        </Card.Section>
        <Card.Section withBorder inheritPadding p="xs">
          <Box mx="auto" w="100%">
            <form
              onSubmit={form.onSubmit((values: any) => {
                onDone(values);
              })}
            >
              <WatchdogServiceConfigTable services={services} setServices={setServices} />

              {/*<Group justify="space-between" mt="xl">
            <Button type="submit"> {mode === 'create' ? 'Create' : 'Update'}</Button>
          </Group>*/}
            </form>
          </Box>
        </Card.Section>
      </Card>
    </>
  );
}
