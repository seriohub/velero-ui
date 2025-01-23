import { useEffect } from 'react';
import { useUIStatus } from '@/contexts/UIContext';
import { fontSizeMap, FontSizeKey } from '@/components/Config/UI/UIConfigFontSize';
import { fonts, FontKeys } from '@/components/Config/UI/UIConfigFontFamily';

export const useUIConfig = () => {
  const uiValues = useUIStatus();

  useEffect(() => {
    const defaultFontSizeRaw = localStorage.getItem('fontSize');
    const defaultFontSize = defaultFontSizeRaw ? parseInt(defaultFontSizeRaw) : 50;
    const validFontSizes: FontSizeKey[] = [0, 25, 50, 75, 100]; // Ensure this matches the FontSizeKey type
    const fontSizeKey: FontSizeKey = validFontSizes.includes(defaultFontSize as FontSizeKey)
      ? (defaultFontSize as FontSizeKey)
      : (50 as FontSizeKey);

    uiValues.setUiFontSize({
      value: fontSizeKey,
      fontSize: fontSizeMap[fontSizeKey],
    });

    const defaultFontFamily = localStorage.getItem('fontFamily') || 'open_sans';
    uiValues.setUiFontFamily({
      name: defaultFontFamily,
      fontFamily: fonts[defaultFontFamily as FontKeys],
    });

    const mainColored = localStorage.getItem('mainColored') === 'true';
    uiValues.setMainColored(mainColored);

    const navbarColored = localStorage.getItem('navbarColored') === 'true';
    uiValues.setNavbarColored(navbarColored);

    const primaryColor = localStorage.getItem('primaryColor') || 'blue';
    uiValues.setPrimaryColor(primaryColor);
  }, []);
};
