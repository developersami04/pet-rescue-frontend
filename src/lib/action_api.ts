
'use server';

type PetType = {
  type: string;
};

export async function getPetTypes() {
    try {
        const response = await fetch('https://f3gzr7pv-8000.inc1.devtunnels.ms/api/pet-data/pet-types/', { cache: 'no-store' });
        if (!response.ok) {
            console.error('Failed to fetch pet types:', response.statusText);
            return null;
        }
        const data: PetType[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching pet types:', error);
        return null;
    }
}
