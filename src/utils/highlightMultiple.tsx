import React from 'react';

export function highlightMultiple(text: string, highlights: string[]): React.ReactNode[] {
  if (!highlights.length) return [text];

  const regex = new RegExp(`(${highlights.filter(Boolean).join('|')})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) =>
    highlights.some(h => h.toLowerCase() === part.toLowerCase()) ? (
      <mark key={index} style={{ backgroundColor: '#fbdf5f' }}>{part}</mark>
    ) : (
      part
    )
  );
}
