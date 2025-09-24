'use client';

import { useState, useMemo } from 'react';
import { pets } from '@/lib/data';
import { PetCard } from './pet-card';
import { PetFilters } from './pet-filters';

export function PetList() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [size, setSize] = useState('All');

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        pet.name.toLowerCase().includes(searchLower) ||
        pet.breed.toLowerCase().includes(searchLower);
      const matchesType = type === 'All' || pet.type === type;
      const matchesSize = size === 'All' || pet.size === size;
      return matchesSearch && matchesType && matchesSize;
    });
  }, [search, type, size]);

  const petTypes = ['All', ...Array.from(new Set(pets.map((p) => p.type)))];
  const petSizes = ['All', ...Array.from(new Set(pets.map((p) => p.size)))];

  const handleClearFilters = () => {
    setSearch('');
    setType('All');
    setSize('All');
  };

  return (
    <>
      <PetFilters
        search={search}
        setSearch={setSearch}
        type={type}
        setType={setType}
        size={size}
        setSize={setSize}
        petTypes={petTypes}
        petSizes={petSizes}
        onClearFilters={handleClearFilters}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPets.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>
      {filteredPets.length === 0 && (
        <div className="text-center py-16 col-span-full">
          <h3 className="text-xl font-semibold">No Pets Found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your filters to find more friends.
          </p>
        </div>
      )}
    </>
  );
}
