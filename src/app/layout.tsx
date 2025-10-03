
'use client';

import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { useAuth, AuthProvider } from '@/lib/auth.tsx';
import { LandingHeader } from './_components/landing-header';
import { HeaderNav } from '@/components/header-nav';
import { Skeleton } from '@/components/ui/skeleton';
import { ThemeProvider } from '@/components/theme-provider';
import { NotificationProvider } from '@/hooks/use-notifications';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Pet-Pal</title>
        <meta name="description" content="Find your forever friend." />
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <NotificationProvider>
                <main className="flex-1">{children}</main>
            </NotificationProvider>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
