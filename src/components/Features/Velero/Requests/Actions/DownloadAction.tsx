'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';

interface DownloadActionIconProps {
  url: string;
}

const DownloadAction: React.FC<DownloadActionIconProps> = ({ url }) => {
  const handleOpenModal = () => {
    const a = document.createElement('a');
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Tooltip label="Download">
      <ActionIcon size="sm" variant="subtle" onClick={handleOpenModal} disabled={url === undefined}>
        <IconDownload />
      </ActionIcon>
    </Tooltip>
  );
};

export default DownloadAction;
