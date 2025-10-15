
'use client';

import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { useAuth, AuthProvider } from '@/lib/auth.tsx';
import { LandingHeader } from './landing/_components/landing-header';
import { HeaderNav } from '@/components/header-nav';
import { ThemeProvider } from '@/components/theme-provider';
import { useTheme } from 'next-themes';
import { NotificationProvider } from '@/hooks/use-notifications';
import { BottomNavBar } from '@/components/bottom-nav-bar';
import { usePathname } from 'next/navigation';
import { AdminHeader } from '@/components/admin-header';
import { Footer } from './landing/_components/footer';
import { useEffect, useState } from 'react';

function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const { setTheme } = useTheme();
  const pathname = usePathname();
  const [hasToken, setHasToken] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    if (user?.is_admin) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, [user, setTheme]);

  useEffect(() => {
    setHasToken(!!localStorage.getItem('authToken'));
    setIsAdmin(localStorage.getItem('is_admin') === 'true');
  }, [isAuthenticated]);

  const isAuthPage = isAuthenticated && pathname !== '/';
  const showLandingFooter = !isAuthenticated && pathname === '/';

  let HeaderComponent;
  if (hasToken) {
      if (isAdmin) {
          HeaderComponent = <AdminHeader />;
      } else {
          HeaderComponent = <HeaderNav />;
      }
  } else {
      HeaderComponent = <LandingHeader />;
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
        <title>Pet Rescue</title>
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
