
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, PawPrint, Plus, User, Bell, FilePenLine, Film } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useNotifications } from '@/hooks/use-notifications';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useState } from 'react';
import { useAuth } from '@/lib/auth.tsx';

export function BottomNavBar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: user?.is_admin ? '/admin/dashboard' : '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
    { href: '/pets', icon: PawPrint, label: 'Pets' },
    { href: '/submit-request', icon: Plus, label: 'Add', isCenter: true },
    { href: '/notifications', icon: Bell, label: 'Updates' },
    { href: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t z-50">
      <div className="flex items-center justify-around h-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isCenter) {
            // Conditionally render the center button for non-admin users
            if (user && !user.is_admin) {
              return (
                <div key={item.href} className="-mt-6">
                   <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                    <PopoverTrigger asChild>
                       <Button size="icon" className="h-14 w-14 rounded-full shadow-lg" aria-label="Add new item">
                         <Icon className="h-7 w-7" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent side="top" align="center" className="w-auto p-2 rounded-full mb-2">
                       <div className="flex items-center gap-2">
                           <Button asChild variant="secondary" className="rounded-full h-12 w-28 flex-col gap-1" onClick={() => setIsMenuOpen(false)}>
                             <Link href="/submit-request">
                              <FilePenLine className="h-5 w-5"/>
                               <span className="text-xs">Pet Request</span>
                             </Link>
                           </Button>
                           <Button asChild variant="secondary" className="rounded-full h-12 w-28 flex-col gap-1" onClick={() => setIsMenuOpen(false)}>
                              <Link href="/post-story">
                                  <Film className="h-5 w-5"/>
                                  <span className="text-xs">Post Story</span>
                              </Link>
                           </Button>
                       </div>
                    </PopoverContent>
                  </Popover>
                </div>
              );
            }
            // For admin users, render a placeholder to maintain layout if needed, or just null
            return <div key="center-placeholder" className="w-14" />;
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center justify-center gap-1 w-full h-full transition-colors text-muted-foreground',
                isActive && 'text-primary'
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
              {item.href === '/notifications' && unreadCount > 0 && (
                 <span className="absolute top-2 right-1/2 translate-x-4 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
                    {unreadCount}
                 </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
