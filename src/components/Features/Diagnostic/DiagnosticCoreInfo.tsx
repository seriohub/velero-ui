import { ActionIcon, Group, Modal, Text, Tooltip } from '@mantine/core';

import {
  IconCheck,
  IconInfoSquare,
  IconServer,
} from '@tabler/icons-react';

import { useDisclosure } from '@mantine/hooks';

import { useServerStatus } from '@/contexts/ServerContext';
import { useDiagnosticCore } from '@/hooks/diagnostic/useDiagnosticCore';

import { DiagnosticInfoData } from "@/components/Features/Diagnostic/DiagnosticInfoData";

export const DiagnosticCoreInfo = () => {
  const stateManager = useDiagnosticCore();

  const [opened, {
    open,
    close
  }] = useDisclosure(false);

  const serverValues = useServerStatus();

  return (
    <>
      <Group gap={2}>
        <Tooltip label="Vui Core">
          <Group gap={0}>
            {!serverValues.isServerAvailable && <IconServer size={20} color="red"/>}
            {serverValues.isServerAvailable && <IconServer size={20} color="green"/>}
            <Text size="sm" fw={600}>
              {serverValues?.currentServer?.name}
            </Text>
          </Group>
        </Tooltip>

        {stateManager?.allTrue && !stateManager?.hasWarnings && (
          <Tooltip label="Core Check Passed!">
            <IconCheck color="green"/>
          </Tooltip>
        )}

        {stateManager?.allTrue && stateManager?.hasWarnings && (
          <Group gap={0}>
            <IconCheck color="orange"/>
            <Text c="orange" size="sm">
              Check warning
            </Text>
          </Group>
        )}

        {!stateManager?.allTrue && (
          <Group gap={0}>
            <IconCheck color="red" size={20}/>
            <Text c="red" size="sm">
              Error
            </Text>
          </Group>
        )}

        <Tooltip label="Core info">
          <ActionIcon
            size={20}
            variant="transparent"
            onClick={open}
          >
            <IconInfoSquare size={20} stroke={1.5}/>
          </ActionIcon>
        </Tooltip>
      </Group>

      <Modal
        opened={opened}
        onClose={close}
        title="Core diagnostic"
        centered
        size="auto"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        {/* Modal content */}

        <DiagnosticInfoData
          uiURL={serverValues?.uiURL}
          apiURL={serverValues?.apiURL}
          apiArch={serverValues?.arch}
          origins={serverValues?.origins}
          k8sHealth={serverValues?.k8sHealth}
          stateManager={stateManager}
        />
      </Modal>
    </>
  );
};
