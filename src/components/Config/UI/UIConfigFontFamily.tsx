'use client';

import { Box, Select } from '@mantine/core';

import { useUIStatus } from '@/contexts/UIContext';

<<<<<<< HEAD
=======
const inter = Inter({
  subsets: ['latin'],
  preload: false,
});
const open_sans = Open_Sans({
  subsets: ['latin'],
  preload: true,
});
const montserrat = Montserrat({
  subsets: ['latin'],
  preload: false,
});
const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
  preload: false,
});
const lato = Lato({
  weight: '400',
  subsets: ['latin'],
  preload: false,
});
const pt_sans = PT_Sans({
  weight: '400',
  subsets: ['latin'],
  preload: false,
});
const merriwather = Merriweather({
  weight: '400',
  subsets: ['latin'],
  preload: false,
});
const raleway = Raleway({
  weight: '400',
  subsets: ['latin'],
  preload: false,
});
const source_sans = Source_Sans_3({
  weight: '400',
  subsets: ['latin'],
  preload: false,
});

export const fonts = {
  inter,
  open_sans,
  montserrat,
  roboto,
  lato,
  pt_sans,
  merriwather,
  raleway,
  source_sans,
};

export type FontKeys = keyof typeof fonts;

>>>>>>> f2548fac8062bfb24f1d2ba184e4d660dd6d97bd
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
