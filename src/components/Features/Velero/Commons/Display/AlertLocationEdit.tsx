import { IconAlertTriangle } from '@tabler/icons-react';
import { Alert, List, Text } from '@mantine/core';

export default function AlertLocationEdit({ setShowAlert }: any) {
  return (
    <Alert
      variant="light"
      color="yellow"
      title="Warning: Configuration Change Risk"
      icon={<IconAlertTriangle/>}
      m={10}
      p={5}
      withCloseButton
      onClose={() => setShowAlert(false)}
    >
      <Text size="sm">
        Modifying a Backup Storage Location (BSL) or Volume Snapshot Location (VSL) through this UI
        will directly update the corresponding Kubernetes resource.
      </Text>

      <Text size="sm">However, please be aware of the following risks:</Text>

      <List size="sm">
        <List.Item>
          Some changes may not take effect immediately and could require a restart of Velero.
        </List.Item>
        <List.Item>
          Modifying critical parameters (e.g., storage bucket, region, or provider) may cause
          existing backups or snapshots to become inaccessible.
        </List.Item>
        <List.Item>
          Velero might not recognize certain updates dynamically, potentially leading to backup or
          restore failures.
        </List.Item>
        <List.Item>
          Changes to Volume Snapshot Locations may make existing snapshots unusable for restores.
        </List.Item>
      </List>

      <Text mt={20}>When is it recommended to modify these settings?</Text>
      <List size="sm">
        <List.Item>
          During the initial setup, before any backups have been created, to properly configure
          storage and snapshot parameters.
        </List.Item>
        <List.Item>
          If no critical backups or snapshots are linked, minimizing the risk of data loss.
        </List.Item>
      </List>

      <Text mt={20} size="sm">
        Proceed with caution and verify your configuration after applying any changes. If unsure,
        consider creating a backup of your Velero configuration before proceeding.
      </Text>
    </Alert>
  );
}
