
'use client';

import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/lib/auth';
import { LandingHeader } from './_components/landing-header';
import { HeaderNav } from '@/components/header-nav';
import { LandingFooter } from './_components/landing-footer';
import { Skeleton } from '@/components/ui/skeleton';
import { ThemeProvider } from '@/components/theme-provider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated, isLoading } = useAuth();

  const Header = isAuthenticated ? HeaderNav : LandingHeader;

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
          {isLoading ? (
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-9 w-9 rounded-full" />
              </div>
            </header>
          ) : (
            <Header />
          )}

          <main className="flex-1">{children}</main>
          
          {!isLoading && !isAuthenticated && <LandingFooter />}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
