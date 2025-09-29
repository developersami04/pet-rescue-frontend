
'use server';

type PetType = {
  type: string;
};

const API_BASE_URL = process.env.API_BASE_URL;

export async function getPetTypes() {
    if (!API_BASE_URL) {
        console.error('API_BASE_URL is not defined in the environment variables.');
        return null;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/pet-data/pet-types/`, { cache: 'no-store' });
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
