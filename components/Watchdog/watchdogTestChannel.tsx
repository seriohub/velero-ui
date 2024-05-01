import { useApiGet } from '@/hooks/useApiGet';
import { Box, Button, Group, SimpleGrid } from '@mantine/core';
import { IconBrandSlack, IconBrandTelegram, IconMail } from '@tabler/icons-react';
import Toolbar from '../Toolbar';

interface WatchdogTestChannelProps {
  configuration: any;
}

export function WatchdogTestChannel({ configuration }: WatchdogTestChannelProps) {
  const { data, getData } = useApiGet();

  return (
    <>
      <Box p={5}>
        <Toolbar title="Test notification">
          <></>
        </Toolbar>

        <SimpleGrid cols={3} spacing="sm" verticalSpacing="sm" w={600}>
          <div>Email enabled</div>
          <div>{configuration?.payload?.EMAIL_ENABLE}</div>
          <div>
            <Button
              size="xs"
              leftSection={<IconMail size={16} />}
              component="a"
              disabled={configuration?.payload?.EMAIL_ENABLE?.toLowerCase() != 'true'}
              onClick={(event) => {
                event.preventDefault();
                getData(
                  '/v1/watchdog/send-test-notification',
                  'email=true&slack=False&telegram=False'
                );
              }}
            >
              Send test message
            </Button>
          </div>
          <div>Slack enabled</div>
          <div>{configuration?.payload?.SLACK_ENABLE || 'False'}</div>
          <div>
            <Button
              size="xs"
              leftSection={<IconBrandSlack size={16} />}
              component="a"
              disabled={configuration?.payload?.SLACK_ENABLE?.toLowerCase() != 'true'}
              onClick={(event) => {
                event.preventDefault();
                getData(
                  '/v1/watchdog/send-test-notification',
                  'email=False&slack=True&telegram=False'
                );
              }}
            >
              Send test message
            </Button>
          </div>
          <div>Telegram enabled</div>
          <div>{configuration?.payload?.TELEGRAM_ENABLE || 'False'}</div>
          <div>
            <Button
              size="xs"
              leftSection={<IconBrandTelegram size={16} />}
              component="a"
              disabled={configuration?.payload?.TELEGRAM_ENABLE.toLowerCase() != 'true'}
              onClick={(event) => {
                event.preventDefault();
                getData(
                  '/v1/watchdog/send-test-notification',
                  'email=False&slack=False&telegram=True'
                );
              }}
            >
              Send test message
            </Button>
          </div>
        </SimpleGrid>
      </Box>
    </>
  );
}
