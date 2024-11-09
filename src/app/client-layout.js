'use client';

import { ThemeProvider } from 'next-themes';
import ThemeToggle from '@/components/ThemeToggle';

export default function ClientLayout({ children }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
      <ThemeToggle />
      {children}
    </ThemeProvider>
  );
}
