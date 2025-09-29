
'use server';

import { z } from "zod";

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


const registerUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  username: z.string().min(3, 'Username must be at least 3 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  phone_no: z.string().optional(),
  gender: z.enum(['Male', 'Female']).optional(),
});


export async function registerUser(userData: z.infer<typeof registerUserSchema>) {
    if (!API_BASE_URL) {
        throw new Error('API_BASE_URL is not defined in the environment variables.');
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
        const response = await fetch(`${API_BASE_URL}/api/user-auth/register`, {
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
        throw new Error('API_BASE_URL is not defined in the environment variables.');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/user-auth/login`, {
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
        console.error('Error logging in:', error);
        if (error instanceof Error) {
           throw new Error(error.message);
        }
        throw new Error('An unknown error occurred during login.');
    }
}

export async function getUserDetails(token: string) {
    if (!API_BASE_URL) {
        throw new Error('API_BASE_URL is not defined in the environment variables.');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/user-auth/user-details`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const result = await response.json();

        if (!response.ok) {
            // If the token is invalid or expired, the server might return a 401
            if (response.status === 401) {
                 // Here you could also trigger a token refresh logic
                throw new Error('Session expired. Please log in again.');
            }
            throw new Error(result.message || result.detail || 'Failed to fetch user details.');
        }

        return result;
    } catch (error) {
        console.error('Error fetching user details:', error);
        if (error instanceof Error) {
           throw new Error(error.message);
        }
        throw new Error('An unknown error occurred while fetching user details.');
    }
}

export async function getAllPets(token: string) {
    if (!API_BASE_URL) {
        throw new Error('API_BASE_URL is not defined in the environment variables.');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/pet-data/pets/`, {
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
        console.error('Error fetching pets:', error);
        if (error instanceof Error) {
           throw new Error(error.message);
        }
        throw new Error('An unknown error occurred while fetching pets.');
    }
}
