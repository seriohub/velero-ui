import { Box, Card, Text } from '@mantine/core';
import React from 'react';
import classes from '@/styles/veleroResourceDetails.module.css';

export function DetailsBackupRestoreContent({ data }: any) {
  // get value from spec or spec.template
  const getValue = (field: string) => {
    return data?.spec?.[field] ?? data?.spec?.template?.[field] ?? [];
  };

  const renderField = (label: string, field: string, showAsterisk = false) => {
    const values = getValue(field);
    return (
      <Box
        style={{
          display: 'flex',
          width: '100%',
        }}
        mt={3}
      >
        <Text w={150} size="sm">
          {label}:
        </Text>
        <Text fw={600} size="sm" style={{ flex: 1 }}>
          {values.length > 0 ? values.join(', ') : showAsterisk ? '*' : null}
        </Text>
      </Box>
    );
  };

  return (
    <Card.Section className={classes.section}>
      <Text fz="sm" c="dimmed" className={classes.label}>
        Content
      </Text>

      {renderField('Included namespaces', 'includedNamespaces', true)}
      {getValue('excludedNamespaces').length > 0 &&
        renderField('Excluded namespaces', 'excludedNamespaces')}

      {renderField('Included resources', 'includedResources', true)}
      {getValue('excludedResources').length > 0 &&
        renderField('Excluded resources', 'excludedResources')}
    </Card.Section>
  );
}
