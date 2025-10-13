
'use client';

import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { useAuth, AuthProvider } from '@/lib/auth.tsx';
import { UnauthenticatedHeader } from './landing/_components/unauthenticated-header';
import { HeaderNav } from '@/components/header-nav';
import { Skeleton } from '@/components/ui/skeleton';
import { ThemeProvider } from '@/components/theme-provider';
import { NotificationProvider } from '@/hooks/use-notifications';
import { BottomNavBar } from '@/components/bottom-nav-bar';
import { usePathname } from 'next/navigation';
import { AdminHeader } from '@/components/admin-header';
import { Footer } from './landing/_components/footer';

function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const pathname = usePathname();
  
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

  const isAuthPage = isAuthenticated && pathname !== '/';
  const showLandingFooter = !isAuthenticated && pathname === '/';

  let HeaderComponent = <UnauthenticatedHeader />;
  if (isAuthPage) {
    if (user?.is_admin) {
      HeaderComponent = <AdminHeader />;
    } else {
      HeaderComponent = <HeaderNav />;
    }
  } else if (isAuthenticated) {
    // Authenticated user on the landing page
    HeaderComponent = user?.is_admin ? <AdminHeader /> : <HeaderNav />;
  }


  return (
    <div className="flex min-h-screen flex-col">
      {HeaderComponent}
      <main className={cn("flex-1", isAuthenticated && "pb-20")}>{children}</main>
      {showLandingFooter && <Footer />}
      {isAuthenticated && <BottomNavBar />}
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
        <title>Petrescue</title>
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
