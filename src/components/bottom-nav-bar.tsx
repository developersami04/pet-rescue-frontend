
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, PawPrint, Plus, User, Shapes } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

const navItems = [
  { href: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
  { href: '/pets', icon: PawPrint, label: 'Pets' },
  { href: '/submit-request', icon: Plus, label: 'Request', isCenter: true },
  { href: '/pet-categories', icon: Shapes, label: 'Categories' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export function BottomNavBar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t z-50">
      <div className="flex items-center justify-around h-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <div key={item.href} className="-mt-6">
                <Button asChild size="icon" className="h-14 w-14 rounded-full shadow-lg">
                  <Link href={item.href} aria-label={item.label}>
                    <Icon className="h-7 w-7" />
                  </Link>
                </Button>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 w-full h-full transition-colors text-muted-foreground',
                isActive && 'text-primary'
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
