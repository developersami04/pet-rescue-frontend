'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

type PetFiltersProps = {
  search: string;
  setSearch: (value: string) => void;
  type: string;
  setType: (value: string) => void;
  size: string;
  setSize: (value: string) => void;
  petTypes: string[];
  petSizes: string[];
  onClearFilters: () => void;
};

export function PetFilters({
  search,
  setSearch,
  type,
  setType,
  size,
  setSize,
  petTypes,
  petSizes,
  onClearFilters,
}: PetFiltersProps) {
  return (
    <div className="mb-8 p-4 bg-card border rounded-lg shadow-sm">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or breed..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            {petTypes.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={size} onValueChange={setSize}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by size" />
          </SelectTrigger>
          <SelectContent>
            {petSizes.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={onClearFilters} variant="secondary">
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
