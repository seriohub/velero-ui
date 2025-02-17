'use client';

import { Box, Select } from '@mantine/core';

import { useUIStatus } from '@/contexts/UIContext';

export function UIConfigFontFamily() {
  const appValues = useUIStatus();

  function setSelectedFont(selectedFont: any) {
    appValues.setUiFontFamily({
      name: selectedFont,
      fontFamily: selectedFont,
    });

    localStorage.setItem('fontFamily', selectedFont);
  }

  return (
    <Box maw={400} mx="auto" mt={50}>
      <Select
        label="Font Family"
        data={[
          {
            value: 'Inter',
            label: 'Inter',
          },
          {
            value: 'Lato',
            label: 'Lato',
          },
          {
            value: 'Merriweather Sans',
            label: 'Merriweather Sans',
          },
          {
            value: 'Open Sans',
            label: 'Open Sans',
          },
          {
            value: 'Montserrat ',
            label: 'Montserrat',
          },

          {
            value: 'Raleway',
            label: 'Raleway',
          },
          {
            value: 'Roboto',
            label: 'Roboto',
          },
          {
            value: 'Ubuntu',
            label: 'Ubuntu',
          },
        ]}
        onChange={(value) => setSelectedFont(value as any)}
        placeholder={appValues.uiFontFamily?.name}
      />
    </Box>
  );
}
