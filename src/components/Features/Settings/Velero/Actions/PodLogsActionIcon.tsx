'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { openModal } from '@mantine/modals';

import { IconLogs } from '@tabler/icons-react';
import { PodLogsContent } from "@/components/Features/Settings/Velero/Display/PodLogsContent";

interface PodLogsActionIconProps {
  podName: string;
  target?: string;
}

export default function PodLogsActionIcon({
                                            podName,
                                            target = 'velero'
                                          }: PodLogsActionIconProps) {

  return (
    <Tooltip label="Logs">
      <ActionIcon
        size="sm"
        variant="subtle"
        onClick={(e) => {
          e.stopPropagation();

          openModal({
            withCloseButton: true,
            title: 'Logs',
            size: '100%',
            children: (
              <PodLogsContent podName={podName} target={target}/>
            ),
          });
        }}
      >
        <IconLogs/>
      </ActionIcon>
    </Tooltip>
  );
}
