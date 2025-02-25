import { Box, ScrollArea } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

export function PageScrollArea({ children }: any) {
  const isNavbarVisible = useMediaQuery('(max-width: 576px)');
  return (
    <ScrollArea
      p={isNavbarVisible ? 2 : 10}
      style={{ height: '100%' }}
      scrollbars="y"
      //w={isMobile ? 'calc(100vw - 0px)' : 'calc(100vw - 20px - var(--app-shell-navbar-width))'}
    >
      <Box
        w={
          isNavbarVisible
            ? 'calc(100vw - 5px)'
            : 'calc(100vw - 20px - var(--app-shell-navbar-width))'
        }
      >
        {children}
      </Box>
    </ScrollArea>
  );
}
