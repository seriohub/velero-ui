'use client';

import { useEffect } from 'react';
import { useUIStatus } from '@/contexts/UIContext';
import { FontSizeKey, fontSizeMap } from '@/components/Features/Config/UI/UIConfigFontSize';

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

    const defaultFontFamily = localStorage.getItem('fontFamily') || 'Open Sans';
    uiValues.setUiFontFamily({
      name: defaultFontFamily,
      fontFamily: defaultFontFamily,
    });

    const mainColored = localStorage.getItem('mainColored') ? localStorage.getItem('navbarColored') === 'true' : 'true';
    uiValues.setMainColored(mainColored);

    const navbarColored = localStorage.getItem('navbarColored') ? localStorage.getItem('navbarColored') === 'true' : 'true';
    uiValues.setNavbarColored(navbarColored);

    const primaryColor = localStorage.getItem('primaryColor') || 'indigo';
    uiValues.setPrimaryColor(primaryColor);

    const badgeVariant = localStorage.getItem('badgeVariant') || 'filled';
    uiValues.setBadgeVariant(badgeVariant);
  }, []);
};
