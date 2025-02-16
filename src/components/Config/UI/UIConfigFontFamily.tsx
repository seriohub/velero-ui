'use client';

import {
  Inter,
  Lato,
  Merriweather,
  Montserrat,
  Open_Sans,
  PT_Sans,
  Raleway,
  Roboto,
  Source_Sans_3,
} from 'next/font/google';
import { Box, Select } from '@mantine/core';

import { useUIStatus } from '@/contexts/UIContext';

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

export function UIConfigFontFamily() {
  const appValues = useUIStatus();

  function setSelectedFont(selectedFont: FontKeys) {
    const fontClass = fonts[selectedFont];
    if (fontClass) {
      appValues.setUiFontFamily({
        name: selectedFont,
        fontFamily: fontClass,
      });
      // console.log(`Font changed to: ${selectedFont}, class: ${fontClass}`);
      localStorage.setItem('fontFamily', selectedFont);
    } else {
      console.error(`Font "${selectedFont}" not found`);
    }
  }

  return (
    <Box maw={400} mx="auto" mt={50}>
      <Select
        label="Font Family"
        data={[
          {
            value: 'inter',
            label: 'Inter',
          },
          {
            value: 'open_sans',
            label: 'Open Sans',
          },
          {
            value: 'montserrat',
            label: 'Montserrat',
          },
          {
            value: 'roboto',
            label: 'Roboto',
          },
          {
            value: 'lato',
            label: 'Lato',
          },
          {
            value: 'pt_sans',
            label: 'PT Sans',
          },
          {
            value: 'merriwather',
            label: 'Merriweather',
          },
          {
            value: 'raleway',
            label: 'Raleway',
          },
          {
            value: 'source_sans',
            label: 'Source Sans 3',
          },
        ]}
        onChange={(value) => setSelectedFont(value as FontKeys)}
        placeholder={appValues.uiFontFamily?.name}
      />
    </Box>
  );
}
