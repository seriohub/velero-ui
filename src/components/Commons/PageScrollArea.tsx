import { ScrollArea, Flex } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

export function PageScrollArea({ children }: any) {
  const isNavbarVisible = useMediaQuery('(max-width: 576px)');
  const isScrollableLayout = useMediaQuery('(max-width: 992px), (max-height: 900px)');

  if (isScrollableLayout) {
    return (
      <ScrollArea p={isNavbarVisible ? 2 : 10} h="100%" scrollbars="y">
        {children}
      </ScrollArea>
    );
  }

  return (
    <Flex direction="column" p={10} h="100%" w="100%">
      {children}
    </Flex>
  );
}

