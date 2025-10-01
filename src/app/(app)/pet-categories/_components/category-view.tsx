'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';
import { CategoryCard } from './category-card';
import { CategoryListItem } from './category-list-item';
import { PageHeader } from '@/components/page-header';
import { cn } from '@/lib/utils';

type PetType = {
  id: number;
  name: string;
};

type CategoryViewProps = {
  petTypes: PetType[];
};

export function CategoryView({ petTypes }: CategoryViewProps) {
  const [view, setView] = useState('grid');

  return (
    <>
      <div className="flex items-center justify-between mb-6">
         <PageHeader
            title="Pet Categories"
            description="Browse pets by their category."
            className="pb-0"
        />
        <div className="flex items-center gap-2">
          <Button
            variant={view === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setView('grid')}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-5 w-5" />
          </Button>
          <Button
            variant={view === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setView('list')}
            aria-label="List view"
          >
            <List className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div
        className={cn(
          view === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
            : 'space-y-4'
        )}
      >
        {petTypes.map((petType) =>
          view === 'grid' ? (
            <CategoryCard key={petType.id} petType={petType} />
          ) : (
            <CategoryListItem key={petType.id} petType={petType} />
          )
        )}
      </div>
    </>
  );
}
