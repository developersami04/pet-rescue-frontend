
'use server';

import { z } from "zod";
import API_ENDPOINTS, { API_REQUEST_TIMEOUT } from "./endpoints";

type PetType = {
  id: number;
  type: string;
};

const API_BASE_URL = process.env.API_BASE_URL;

async function fetchWithTimeout(url: string, options: RequestInit, timeout = API_REQUEST_TIMEOUT) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
        ...options,
        signal: controller.signal  
    });

    clearTimeout(id);

    return response;
}

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


const registerUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  username: z.string().min(3, 'Username must be at least 3 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  phone_no: z.string().optional(),
  gender: z.enum(['Male', 'Female']),
});


export async function registerUser(userData: z.infer<typeof registerUserSchema>) {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }

    const payload = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        first_name: userData.firstName,
        last_name: userData.lastName,
        profile_image: null,
        phone_no: userData.phone_no,
        gender: userData.gender,
        pin_code: null,
        address: "",
    };

    try {
        const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.register}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || result.detail || 'Failed to register user.');
        }

        return result;
    } catch (error) {
        if ((error as any).name === 'AbortError') {
            throw new Error('Registration timed out. Please try again.');
        }
        console.error('Error registering user:', error);
        if (error instanceof Error) {
           throw new Error(error.message);
        }
        throw new Error('An unknown error occurred during registration.');
    }
}

const loginUserSchema = z.object({
  username: z.string().min(1, 'Username is required.'),
  password: z.string().min(1, 'Password is required.'),
});

export async function loginUser(credentials: z.infer<typeof loginUserSchema>) {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }

    try {
        const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.login}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || result.detail || 'Failed to log in.');
        }

        return result;
    } catch (error) {
        if ((error as any).name === 'AbortError') {
            throw new Error('Login request timed out. Please try again.');
        }
        console.error('Error logging in:', error);
        if (error instanceof Error) {
           throw new Error(error.message);
        }
        throw new Error('An unknown error occurred during login.');
    }
}

export async function getUserDetails(token: string) {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }

    try {
        const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.userDetails}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const result = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Session expired. Please log in again.');
            }
            throw new Error(result.message || result.detail || 'Failed to fetch user details.');
        }

        return result;
    } catch (error) {
        if ((error as any).name === 'AbortError') {
            throw new Error('Request for user details timed out.');
        }
        console.error('Error fetching user details:', error);
        if (error instanceof Error) {
           throw new Error(error.message);
        }
        throw new Error('An unknown error occurred while fetching user details.');
    }
}

export async function getAllPets(token: string) {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }

    try {
        const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.allPets}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            cache: 'no-store' 
        });

        const result = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Session expired. Please log in again.');
            }
            throw new Error(result.message || result.detail || 'Failed to fetch pets.');
        }

        return result;
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

export async function getMyPets(token: string) {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }

    try {
        const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.myPets}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            cache: 'no-store' 
        });

        const result = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Session expired. Please log in again.');
            }
            throw new Error(result.message || result.detail || 'Failed to fetch your pets.');
        }

        return result;
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


export async function submitRequest(token: string, requestType: string, payload: any) {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }

    let requestBody: any = {
        request_type: requestType,
    };

    if (requestType === 'pet') {
        requestBody.pet = payload;
    } else if (requestType === 'pet-medical-history') {
        requestBody.pet_medical_history = payload;
    } else if (requestType === 'pet-report') {
        requestBody.pet_report = payload;
    } else {
        throw new Error('Invalid request type specified.');
    }

    try {
        const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.requestSubmit}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(requestBody),
        });
        
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || result.detail || `Failed to submit ${requestType} request.`);
        }

        return result;
    } catch (error) {
         if ((error as any).name === 'AbortError') {
            throw new Error(`Request for ${requestType} timed out.`);
        }
        console.error(`Error submitting ${requestType}:`, error);
        if (error instanceof Error) {
           throw new Error(error.message);
        }
        throw new Error(`An unknown error occurred while submitting the ${requestType} request.`);
    }
}
