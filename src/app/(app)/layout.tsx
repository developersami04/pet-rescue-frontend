
'use client';

import { useAuth } from '@/lib/auth.tsx';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loading from './loading';
import { BottomNavBar } from '@/components/bottom-nav-bar';
import { NotificationProvider } from '@/hooks/use-notifications';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return <Loading />;
  }

  return (
    <NotificationProvider>
        <div className="flex min-h-screen flex-col">
          <main className="flex-1 pb-20">{children}</main>
          <BottomNavBar />
        </div>
    </NotificationProvider>
  );
}
