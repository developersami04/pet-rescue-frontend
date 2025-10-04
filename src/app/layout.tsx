
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
import { BottomNavBar } from '@/components/bottom-nav-bar';

function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
      return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-9 w-9 rounded-full" />
                </div>
            </header>
            <main className="flex-1">{children}</main>
        </div>
      )
  }

  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col">
          <HeaderNav />
          <main className="flex-1 pb-20">{children}</main>
          <BottomNavBar />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">{children}</main>
    </div>
  )
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Petopia</title>
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
              <AppLayoutClient>
                {children}
              </AppLayoutClient>
            </NotificationProvider>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
