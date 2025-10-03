'use server';

import { z } from "zod";
import API_ENDPOINTS from "../endpoints";
import { fetchWithAuth, fetchWithTimeout } from "../api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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


export async function checkUserAuth(token: string) {
    if (!API_BASE_URL) {
        return { isAuthenticated: false, user: null, error: 'API not configured.' };
    }
    
    try {
        const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.userCheck}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        const result = await response.json();
        
        if (!response.ok) {
            return { isAuthenticated: false, user: null, error: result.detail || 'Token validation failed.' };
        }

        return { isAuthenticated: true, user: result.user, message: result.message, error: null };
    } catch (error) {
        console.error('Error checking auth:', error);
        return { isAuthenticated: false, user: null, error: 'An unknown error occurred.' };
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