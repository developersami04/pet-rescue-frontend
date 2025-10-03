'use server';

import API_ENDPOINTS from "../endpoints";
import { fetchWithAuth, fetchWithTimeout } from "../api";
import type { Pet } from "../data";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type PetType = {
  id: number;
  name: string;
};

export async function getPetTypes(): Promise<PetType[] | null> {
    if (!API_BASE_URL) {
        console.error('API_BASE_URL is not defined in the environment variables.');
        return null;
    }

    try {
        const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.petTypes}`, { cache: 'no-store' });
        if (!response.ok) {
            console.error('Failed to fetch pet types:', response.statusText);
            return null;
        }
        const data: PetType[] = await response.json();
        return data;
    } catch (error) {
        if ((error as any).name === 'AbortError') {
             console.error('Error fetching pet types: Request timed out');
        } else {
            console.error('Error fetching pet types:', error);
        }
        return null;
    }
}

export async function getAllPets(token: string, type?: string) {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }

    const url = new URL(`${API_BASE_URL}${API_ENDPOINTS.allPets}`);
    if (type && type !== 'All') {
        url.searchParams.append('type', type);
    }

    try {
        const response = await fetchWithAuth(url.toString(), {
            method: 'GET',
            cache: 'no-store' 
        }, token);

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || result.detail || 'Failed to fetch pets.');
        }

        return result.data || [];
    } catch (error) {
        if ((error as any).name === 'AbortError') {
            throw new Error('Request to fetch pets timed out.');
        }
        console.error('Error fetching pets:', error);
        if (error instanceof Error) {
           throw new Error(error.message);
        }
        throw new Error('An unknown error occurred while fetching pets.');
    }
}

export async function getPetById(token: string, petId: string): Promise<Pet> {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }

    try {
        const response = await fetchWithAuth(`${API_BASE_URL}${API_ENDPOINTS.petProfile}${petId}`, {
            method: 'GET',
            cache: 'no-store' 
        }, token);

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || result.detail || 'Failed to fetch pet details.');
        }

        return result.data;
    } catch (error) {
        if ((error as any).name === 'AbortError') {
            throw new Error('Request to fetch pet details timed out.');
        }
        console.error('Error fetching pet details:', error);
        if (error instanceof Error) {
           throw new Error(error.message);
        }
        throw new Error('An unknown error occurred while fetching pet details.');
    }
}

export async function getMyPets(token: string): Promise<Pet[]> {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }

    try {
        const response = await fetchWithAuth(`${API_BASE_URL}${API_ENDPOINTS.myPets}`, {
            method: 'GET',
            cache: 'no-store' 
        }, token);

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || result.detail || 'Failed to fetch your pets.');
        }

        return result.data || [];
    } catch (error) {
        if ((error as any).name === 'AbortError') {
            throw new Error('Request to fetch your pets timed out.');
        }
        console.error('Error fetching your pets:', error);
        if (error instanceof Error) {
           throw new Error(error.message);
        }
        throw new Error('An unknown error occurred while fetching your pets.');
    }
}


export async function submitRequest(token: string, formData: FormData) {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }

    try {
        const response = await fetchWithAuth(`${API_BASE_URL}${API_ENDPOINTS.requestSubmit}`, {
            method: 'POST',
            body: formData,
        }, token);
        
        const result = await response.json();

        if (!response.ok) {
            // Handle nested error messages
            const errorMessages = Object.entries(result).map(([key, value]) => {
                if (Array.isArray(value)) {
                    return `${key}: ${value.join(', ')}`;
                }
                return `${key}: ${value}`;
            }).join('; ');
            throw new Error(errorMessages || `Failed to submit request.`);
        }

        return result;
    } catch (error) {
         if ((error as any).name === 'AbortError') {
            throw new Error(`Request timed out.`);
        }
        console.error(`Error submitting request:`, error);
        if (error instanceof Error) {
           throw new Error(error.message);
        }
        throw new Error(`An unknown error occurred while submitting the request.`);
    }
}

export async function getMyPetData(token: string, tab: 'lost' | 'found' | 'adopt' | 'my-adoption-requests'): Promise<any[]> {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }

    const url = new URL(`${API_BASE_URL}${API_ENDPOINTS.myPetData}`);
    url.searchParams.append('tab', tab);

    try {
        const response = await fetchWithAuth(url.toString(), {
            method: 'GET',
            cache: 'no-store' 
        }, token);

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || result.detail || `Failed to fetch ${tab} data.`);
        }

        return result.data || [];
    } catch (error: any) {
        if (error.name === 'AbortError') {
            throw new Error(`Request to fetch ${tab} data timed out.`);
        }
        // Handle session expiration specifically
        if (error.message?.includes('Session expired')) {
            throw new Error('Session expired');
        }
        console.error(`Error fetching ${tab} data:`, error);
        throw new Error(error.message || `An unknown error occurred while fetching ${tab} data.`);
    }
}

export async function getPetRequestFormData(token: string, petId: string): Promise<any> {
  if (!API_BASE_URL) {
    throw new Error('API is not configured. Please contact support.');
  }
  const url = `${API_BASE_URL}${API_ENDPOINTS.petRequestView}${petId}`;

  try {
    const response = await fetchWithAuth(url, {
      method: 'GET',
      cache: 'no-store',
    }, token);

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || result.detail || 'Failed to fetch pet request form data.');
    }
    return result.data;
  } catch (error) {
    if ((error as any).name === 'AbortError') {
      throw new Error('Request for pet request data timed out.');
    }
    console.error('Error fetching pet request data:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unknown error occurred while fetching pet request data.');
  }
}

export async function updatePetRequest(token: string, petId: string, formData: FormData) {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }
    const url = `${API_BASE_URL}${API_ENDPOINTS.petRequestView}${petId}`;

    try {
        const response = await fetchWithAuth(url, {
            method: 'PATCH',
            body: formData,
        }, token);
        
        const result = await response.json();

        if (!response.ok) {
            const errorMessages = Object.entries(result).map(([key, value]) => {
                if (Array.isArray(value)) {
                    return `${key}: ${value.join(', ')}`;
                }
                return `${key}: ${value}`;
            }).join('; ');
            throw new Error(errorMessages || `Failed to update request.`);
        }

        return result;
    } catch (error) {
         if ((error as any).name === 'AbortError') {
            throw new Error(`Update request timed out.`);
        }
        console.error(`Error updating request:`, error);
        if (error instanceof Error) {
           throw new Error(error.message);
        }
        throw new Error(`An unknown error occurred while updating the request.`);
    }
}

export async function deletePetRequest(token: string, petId: string) {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }
    const url = `${API_BASE_URL}${API_ENDPOINTS.petRequestView}${petId}`;

    try {
        const response = await fetchWithAuth(url, {
            method: 'DELETE',
        }, token);

        if (!response.ok && response.status !== 204) {
            const result = await response.json();
            throw new Error(result.message || result.detail || 'Failed to delete pet request.');
        }

        return { message: 'Pet request deleted successfully.' };
    } catch (error) {
         if ((error as any).name === 'AbortError') {
            throw new Error('Delete request timed out.');
        }
        console.error('Error deleting pet request:', error);
        if (error instanceof Error) {
           throw new Error(error.message);
        }
        throw new Error('An unknown error occurred while deleting the request.');
    }
}

export async function createAdoptionRequest(token: string, petId: number, message: string) {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }
    const url = `${API_BASE_URL}${API_ENDPOINTS.petAdoptions}`;

    try {
        const response = await fetchWithAuth(url, {
            method: 'POST',
            body: JSON.stringify({ pet: petId, message: message }),
        }, token);
        
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || 'Failed to create adoption request.');
        }
        return result;
    } catch (error) {
        console.error('Error creating adoption request:', error);
        if (error instanceof Error) throw error;
        throw new Error('An unknown error occurred while creating the adoption request.');
    }
}

export async function updateAdoptionRequest(token: string, requestId: number, message: string) {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }
    const url = `${API_BASE_URL}${API_ENDPOINTS.petAdoptions}${requestId}/`;

    try {
        const response = await fetchWithAuth(url, {
            method: 'PATCH',
            body: JSON.stringify({ message: message }),
        }, token);

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || 'Failed to update adoption request.');
        }
        return result;
    } catch (error) {
        console.error('Error updating adoption request:', error);
        if (error instanceof Error) throw error;
        throw new Error('An unknown error occurred while updating the adoption request.');
    }
}


export async function deleteAdoptionRequest(token: string, requestId: number) {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }
    const url = `${API_BASE_URL}${API_ENDPOINTS.petAdoptions}${requestId}/`;

    try {
        const response = await fetchWithAuth(url, {
            method: 'DELETE',
        }, token);

        if (!response.ok && response.status !== 204) {
             const result = await response.json();
            throw new Error(result.message || result.detail || 'Failed to delete adoption request.');
        }
        return { message: 'Adoption request deleted successfully.' };
    } catch (error) {
        console.error('Error deleting adoption request:', error);
        if (error instanceof Error) throw error;
        throw new Error('An unknown error occurred while deleting the adoption request.');
    }
}
