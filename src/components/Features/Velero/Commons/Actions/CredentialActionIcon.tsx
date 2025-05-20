'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconKey } from '@tabler/icons-react';

import { CredentialView } from '../Display/CredentialView';

interface DetailActionIconProps {
  name: string;
  record: any;
}

export default function CredentialActionIcon({
                                               name,
                                               record
                                             }: DetailActionIconProps) {
  return (
    <>
      {record.spec.credential && (
        <Tooltip label="Credential">
          <ActionIcon
            size="sm"
            variant="subtle"
            onClick={(e) => {
              e.stopPropagation();
              openModal({
                title: `Credential ${name}`,
                size: 'md',
                children: (
                  <CredentialView
                    record={record}
                    secretName={record.spec.credential.name || ''}
                    secretKey={record.spec.credential.key || ''}
                    cloudCredential={false}
                  />
                ),
              });
            }}
          >
            <IconKey/>
          </ActionIcon>
        </Tooltip>
      )}
      {!record.spec.credential && (
        <Tooltip label="Default Cloud Credential">
          <ActionIcon
            size="sm"
            variant="subtle"
            color="red"
            onClick={(e) => {
              e.stopPropagation();
              openModal({
                title: `Credential ${name}`,
                size: 'md',
                children: <CredentialView record={record} cloudCredential/>,
              });
            }}
          >
            <IconKey/>
          </ActionIcon>
        </Tooltip>
      )}
    </>
  );
}
