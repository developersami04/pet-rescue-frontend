import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { isAuthenticated } from '@/lib/auth';
import { LandingHeader } from './_components/landing-header';
import { HeaderNav } from '@/components/header-nav';
import { LandingFooter } from './_components/landing-footer';

export const metadata: Metadata = {
  title: 'Pet-Pal',
  description: 'Find your forever friend.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased flex flex-col'
        )}
      >
        {isAuthenticated ? <HeaderNav /> : <LandingHeader />}
        <main className="flex-1">{children}</main>
        {isAuthenticated ? null : <LandingFooter />}
        <Toaster />
      </body>
    </html>
  );
}
