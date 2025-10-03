
import { PawPrint } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <PawPrint className="h-6 w-6 text-primary" />
      <span className="font-headline text-2xl font-bold text-foreground">
        Petopia
      </span>
    </div>
  );
}
