
'use server';

import { z } from "zod";
import API_ENDPOINTS, { API_REQUEST_TIMEOUT } from "./endpoints";
import { Pet } from "./data";
import { format } from "date-fns";

type PetType = {
  id: number;
  name: string;
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

async function fetchWithAuth(url: string, options: RequestInit, token: string) {
    const headers = { ...options.headers };
    if (!(options.body instanceof FormData)) {
        (headers as Record<string, string>)['Content-Type'] = 'application/json';
    }
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;


    let response = await fetchWithTimeout(url, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        console.log("Access token expired, attempting to refresh...");
        const newAccessToken = await refreshAccessToken();

        if (newAccessToken) {
            console.log("Token refreshed successfully, retrying the original request...");
            (headers as Record<string, string>)['Authorization'] = `Bearer ${newAccessToken}`;
            response = await fetchWithTimeout(url, {
                ...options,
                headers,
            });
        } else {
            console.log("Failed to refresh token. User will be logged out.");
             // This custom error will be caught by callers to handle logout
            throw new Error('Session expired');
        }
    }

    return response;
}


export async function refreshAccessToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken || !API_BASE_URL) {
        return null;
    }

    try {
        const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.refreshToken}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!response.ok) {
            console.error('Failed to refresh access token');
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            window.dispatchEvent(new Event('storage'));
            return null;
        }

        const data = await response.json();
        const newAccessToken = data.access;
        localStorage.setItem('authToken', newAccessToken);
        window.dispatchEvent(new Event('storage'));
        
        return newAccessToken;
    } catch (error) {
        console.error('Error during token refresh:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        window.dispatchEvent(new Event('storage'));
        return null;
    }
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
  lastName: z.string().optional(),
  username: z.string().min(3, 'Username must be at least 3 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  phone_no: z.string().min(10, 'Please enter a valid phone number.'),
  gender: z.enum(['Male', 'Female', 'Other', 'Prefer Not To Say']),
  address: z.string().min(1, 'Address is required.'),
  city: z.string().optional(),
  state: z.string().optional(),
  pin_code: z.coerce.number().optional().nullable(),
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
        last_name: userData.lastName || "",
        profile_image: null,
        phone_no: userData.phone_no,
        gender: userData.gender,
        pin_code: userData.pin_code,
        address: userData.address,
        city: userData.city || "",
        state: userData.state || ""
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
            if (result.message && Array.isArray(result.message) && result.message.length > 0) {
                 throw new Error(result.message.join(' '));
            }
            throw new Error(result.detail || 'Failed to register user.');
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
        const response = await fetchWithAuth(`${API_BASE_URL}${API_ENDPOINTS.userDetails}`, {
            method: 'GET',
        }, token);

        const result = await response.json();

        if (!response.ok) {
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

export async function updateUserDetails(token: string, userData: Record<string, any> | FormData) {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }
    
    const isPasswordChange = userData instanceof FormData ? false : userData.hasOwnProperty('current_password');
    const endpoint = isPasswordChange ? API_ENDPOINTS.changePassword : API_ENDPOINTS.updateUserDetails;
    const method = isPasswordChange ? 'POST' : 'PATCH';
    
    const body = userData instanceof FormData ? userData : JSON.stringify(userData);

    try {
        const response = await fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
            method: method,
            body: body,
        }, token);
        
        const result = await response.json();

        if (!response.ok) {
            // Flatten errors if they are in a nested object
            if (typeof result === 'object' && result !== null) {
                const errorMessages = Object.values(result).flat().join(' ');
                if (errorMessages) {
                    throw new Error(errorMessages);
                }
            }
            throw new Error(result.message || result.detail || 'Failed to update user details.');
        }

        return result;
    } catch (error) {
        if ((error as any).name === 'AbortError') {
            throw new Error('User details update request timed out.');
        }
        console.error('Error updating user details:', error);
        if (error instanceof Error) {
           throw new Error(error.message);
        }
        throw new Error('An unknown error occurred while updating user details.');
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
