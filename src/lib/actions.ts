

'use server';

import { z } from "zod";
import API_ENDPOINTS from "./endpoints";
import { fetchWithAuth, fetchWithTimeout } from "./api";
import type { Pet, Notification, RegisteredUser, UnverifiedUser, AdminPetReport, PetReport, AdoptionRequest, FavoritePet, UserStory, HomeUserStory, MyAdoptionRequest } from "./data";

// Import the backend Host Address from .env file
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Parses an error response from the API to generate a user-friendly error message.
 * It intelligently extracts details from various possible error formats.
 * @param result - The JSON response body from a failed API call.
 * @param defaultMessage - A fallback message if no specific error can be found.
 * @returns A string containing the formatted error message.
 */
function getErrorMessage(result: any, defaultMessage: string): string {
    if (result) {
        // Handle plain text errors or HTML error pages
        if (typeof result === 'string') {
            if (result.trim().startsWith('<!doctype html>')) {
                return "The server returned an unexpected error page. Please try again later.";
            }
            return result;
        }

        // Handle standard Django Rest Framework error formats and others
        if (result.detail && typeof result.detail === 'string') return result.detail;
        if (result.message && typeof result.message === 'string') return result.message;
        if (result.error && typeof result.error === 'string') return result.error;

        // Handle validation errors (e.g., {"field": ["error message"]})
        if (typeof result === 'object' && !Array.isArray(result) && Object.keys(result).length > 0) {
            const messages = Object.entries(result).map(([key, value]) => {
                const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                if (Array.isArray(value)) {
                    return `${formattedKey}: ${value.join(' ')}`;
                }
                return `${formattedKey}: ${value}`;
            });
            if (messages.length > 0) return messages.join(' ');
        }
    }
    // Fallback to the default message if no specific error can be extracted
    return defaultMessage;
}


// =================================================================================
// AUTHENTICATION & USER ACTIONS
// =================================================================================

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

/**
 * Registers a new user with the provided details.
 * @param userData - The user's registration data, conforming to the schema.
 * @returns An object indicating success or failure, with data or an error message.
 */
export async function registerUser(userData: z.infer<typeof registerUserSchema>) {
    if (!API_BASE_URL) {
        return { success: false, error: 'API is not configured. Please contact support.', status: 500 };
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
            return { success: false, error: getErrorMessage(result, 'Failed to register user.'), status: response.status };
        }

        return { success: true, ...result };
    } catch (error) {
        if ((error as any).name === 'AbortError') {
            return { success: false, error: 'Registration timed out. Please try again.', status: 408 };
        }
        console.error('Error registering user:', error);
        if (error instanceof Error) {
           return { success: false, error: error.message, status: 500 };
        }
        return { success: false, error: 'An unknown error occurred during registration.', status: 500 };
    }
}

const loginUserSchema = z.object({
  username: z.string().min(1, 'Username is required.'),
  password: z.string().min(1, 'Password is required.'),
});

/**
 * Authenticates a user with username and password.
 * @param credentials - The user's login credentials.
 * @returns An object containing tokens and user data on success, or an error.
 */
export async function loginUser(credentials: z.infer<typeof loginUserSchema>) {
    if (!API_BASE_URL) {
        return { success: false, error: 'API is not configured. Please contact support.', status: 500 };
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
            return { success: false, error: getErrorMessage(result, 'Failed to log in.'), status: response.status };
        }

        return { success: true, ...result };
    } catch (error) {
        if ((error as any).name === 'AbortError') {
            return { success: false, error: 'Login request timed out. Please try again.', status: 408 };
        }
        console.error('Error logging in:', error);
        if (error instanceof Error) {
           return { success: false, error: error.message, status: 500 };
        }
        return { success: false, error: 'An unknown error occurred during login.', status: 500 };
    }
}

/**
 * Verifies a refresh token to authenticate a user and get a new access token.
 * @param refreshToken - The user's refresh token.
 * @returns An object with authentication status, user data, and a new access token.
 */
export async function checkUserAuth(refreshToken: string) {
    if (!API_BASE_URL) {
        return { isAuthenticated: false, user: null, error: 'API not configured.', newAccessToken: null };
    }
    
    try {
        const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.userCheck}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken })
        });

        const result = await response.json();
        
        if (!response.ok || result.status !== 'Successful') {
            return { isAuthenticated: false, user: null, error: getErrorMessage(result, 'Token validation failed.'), newAccessToken: null };
        }

        return { 
            isAuthenticated: true, 
            user: result.data, 
            message: result.message, 
            error: null,
            newAccessToken: result.access_token 
        };
    } catch (error: any) {
        console.error('Error checking auth:', error);
        return { isAuthenticated: false, user: null, error: error.message || 'An unknown error occurred.', newAccessToken: null };
    }
}

/**
 * Fetches the details for the currently authenticated user.
 * @param token - The user's access token.
 * @returns The user's detailed profile data.
 */
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
            throw new Error(getErrorMessage(result, 'Failed to fetch user details.'));
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

/**
 * Fetches the public details for any user by their ID.
 * @param token - The user's access token.
 * @param userId - The ID of the user to view.
 * @returns The user's public profile data.
 */
export async function viewUserDetails(token: string, userId: number) {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }

    try {
        const response = await fetchWithAuth(`${API_BASE_URL}${API_ENDPOINTS.viewUserDetails}${userId}`, {
            method: 'GET',
        }, token);

        const result = await response.json();

        if (!response.ok) {
            throw new Error(getErrorMessage(result, 'Failed to fetch user details.'));
        }

        return result.data;
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


/**
 * Updates the details of the currently authenticated user.
 * Can handle both JSON data and FormData for file uploads.
 * @param token - The user's access token.
 * @param userData - The data to update, as a JSON object or FormData.
 * @returns The result of the update operation.
 */
export async function updateUserDetails(token: string, userData: Record<string, any> | FormData) {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }
    
    const isFormData = userData instanceof FormData;
    const isChangingPassword = isFormData ? userData.has('current_password') : 'current_password' in userData;

    const endpoint = isChangingPassword ? API_ENDPOINTS.changePassword : API_ENDPOINTS.updateUserDetails;
    const method = isChangingPassword ? 'POST' : 'PATCH';
    
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
            method: method,
            body: isFormData ? userData : JSON.stringify(userData),
        }, token);
        
        const result = await response.json();

        if (!response.ok) {
            throw new Error(getErrorMessage(result, 'Failed to update user details.'));
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

/**
 * Sends a verification OTP to the user's registered email address.
 * @param token - The user's access token.
 * @returns A confirmation message.
 */
export async function sendVerificationEmail(token: string) {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }

    try {
        const response = await fetchWithAuth(`${API_BASE_URL}${API_ENDPOINTS.sendVerificationEmail}`, {
            method: 'GET',
        }, token);

        const result = await response.json();

        if (!response.ok) {
            throw new Error(getErrorMessage(result, 'Failed to send verification email.'));
        }

        return result;
    } catch (error) {
        if ((error as any).name === 'AbortError') {
            throw new Error('Request to send verification email timed out.');
        }
        console.error('Error sending verification email:', error);
        if (error instanceof Error) {
           throw new Error(error.message);
        }
        throw new Error('An unknown error occurred while sending the verification email.');
    }
}

/**
 * Verifies an email address using a one-time password (OTP).
 * @param token - The user's access token.
 * @param otp - The 6-digit OTP sent to the user's email.
 * @returns A success message on successful verification.
 */
export async function verifyOtp(token: string, otp: string) {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }

    try {
        const response = await fetchWithAuth(`${API_BASE_URL}${API_ENDPOINTS.verifyEmail}`, {
            method: 'POST',
            body: JSON.stringify({ otp: otp }),
        }, token);

        const result = await response.json();

        if (!response.ok) {
            throw new Error(getErrorMessage(result, 'Failed to verify OTP.'));
        }

        return result;
    } catch (error) {
        if ((error as any).name === 'AbortError') {
            throw new Error('Request to verify OTP timed out.');
        }
        console.error('Error verifying OTP:', error);
        if (error instanceof Error) {
           throw new Error(error.message);
        }
        throw new Error('An unknown error occurred during OTP verification.');
    }
}

/**
 * Deactivates a user's account. This is a soft delete.
 * Requires the user's current password for confirmation.
 * @param token - The user's access token.
 * @param password - The user's current password.
 * @returns A success message.
 */
export async function deactivateAccount(token: string, password: string) {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }

    try {
        const response = await fetchWithAuth(`${API_BASE_URL}${API_ENDPOINTS.deleteAccount}`, {
            method: 'DELETE',
            body: JSON.stringify({ password }),
        }, token);
        
        if (!response.ok) {
            const result = await response.json();
            throw new Error(getErrorMessage(result, 'Failed to deactivate account.'));
        }

        return { message: 'Account deactivated successfully.' };
    } catch (error) {
        if ((error as any).name === 'AbortError') {
            throw new Error('Account deactivation request timed out.');
        }
        console.error('Error deactivating account:', error);
        if (error instanceof Error) {
           throw new Error(error.message);
        }
        throw new Error('An unknown error occurred while deactivating the account.');
    }
}

/**
 * Requests a password reset code to be sent to the specified email.
 * @param email - The user's email address.
 * @returns A success message.
 */
export async function requestPasswordReset(email: string) {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }

    try {
        const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.requestPasswordReset}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        
        const result = await response.json();

        if (!response.ok) {
            throw new Error(getErrorMessage(result, 'Failed to request password reset.'));
        }

        return result;
    } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error('An unknown error occurred.');
    }
}

/**
 * Confirms a password reset using the OTP and a new password.
 * @param otp - The 6-digit OTP.
 * @param password - The new password.
 * @param confirm_password - The confirmation of the new password.
 * @param email - The user's email.
 * @returns A success message.
 */
export async function confirmPasswordReset(otp: string, password: string, confirm_password: string, email: string) {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }

    try {
        const response = await fetchWithTimeout(`${API_BASE_URL}${API_ENDPOINTS.confirmPasswordReset}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ otp, password, confirm_password, email }),
        });
        
        const result = await response.json();

        if (!response.ok) {
            throw new Error(getErrorMessage(result, 'Failed to confirm password reset.'));
        }

        return result;
    } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error('An unknown error occurred.');
    }
}

// =================================================================================
// PET & REPORT ACTIONS
// =================================================================================

type PetType = {
  id: number;
  name: string;
};

/**
 * Fetches the list of all available pet types (e.g., Dog, Cat).
 * @returns An array of pet types, or null on failure.
 */
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

/**
 * Fetches a list of all pets, with an option to filter by type.
 * @param token - The user's access token.
 * @param type - (Optional) The pet type to filter by (e.g., "Dog").
 * @returns An array of Pet objects.
 */
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
            throw new Error(getErrorMessage(result, 'Failed to fetch pets.'));
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

/**
 * Fetches the full profile of a single pet by its ID.
 * @param token - The user's access token.
 * @param petId - The ID of the pet to fetch.
 * @returns A single Pet object with all details.
 */
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
            throw new Error(getErrorMessage(result, 'Failed to fetch pet details.'));
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

/**
 * Fetches all pets owned by the currently authenticated user.
 * @param token - The user's access token.
 * @returns An array of Pet objects.
 */
export async function getMyPets(token: string): Promise<Pet[] | null> {
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
            throw new Error(getErrorMessage(result, 'Failed to fetch your pets.'));
        }

        return result.data || [];
    } catch (error: any) {
        if (error.name === 'AbortError' || error.message?.includes('Session expired')) {
            throw error;
        }
        console.error('Error fetching your pets:', error);
        return null;
    }
}

/**
 * Submits a new pet request, including pet details, medical history, and report info.
 * @param token - The user's access token.
 * @param formData - The complete pet data as a FormData object.
 * @returns A success message.
 */
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
            throw new Error(getErrorMessage(result, 'Failed to submit request.'));
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

/**
 * Fetches various types of data related to the authenticated user's pets.
 * @param token - The user's access token.
 * @param tab - The category of data to fetch (e.g., 'lost', 'my-adoption-requests').
 * @returns An array of data corresponding to the tab.
 */
export async function getMyPetData(token: string, tab: 'lost' | 'found' | 'adopt' | 'my-adoption-requests' | 'adoption-requests-received'): Promise<any[] | null> {
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
            throw new Error(getErrorMessage(result, `Failed to fetch ${tab} data.`));
        }

        return result.data || [];
    } catch (error: any) {
        if (error.name === 'AbortError' || error.message?.includes('Session expired')) {
            throw error;
        }
        console.error(`Error fetching ${tab} data:`, error);
        return null;
    }
}

/**
 * Fetches pre-filled data for updating a pet's request form.
 * @param token - The user's access token.
 * @param petId - The ID of the pet to fetch data for.
 * @returns Pre-filled form data for the specified pet.
 */
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
      throw new Error(getErrorMessage(result, 'Failed to fetch pet request form data.'));
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

/**
 * Updates an existing pet request with new data.
 * @param token - The user's access token.
 * @param petId - The ID of the pet request to update.
 * @param formData - The updated data as a FormData object.
 * @returns A success message.
 */
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
            throw new Error(getErrorMessage(result, 'Failed to update request.'));
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

/**
 * Deletes a pet request.
 * @param token - The user's access token.
 * @param petId - The ID of the pet request to delete.
 * @returns A success message.
 */
export async function deletePetRequest(token: string, petId: string) {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }
    const url = `${API_BASE_URL}${API_ENDPOINTS.petRequestView}${petId}`;

    try {
        const response = await fetchWithAuth(url, {
            method: 'DELETE',
        }, token);

        if (response.status !== 204) {
            const result = await response.json();
            throw new Error(getErrorMessage(result, 'Failed to delete pet request.'));
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

/**
 * Creates a new adoption request for a pet.
 * @param token - The user's access token.
 * @param petId - The ID of the pet to adopt.
 * @param message - A message to the pet owner.
 * @returns The created adoption request object.
 */
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
            throw new Error(getErrorMessage(result, 'Failed to create adoption request. You may have already sent a request for this pet.'));
        }
        return result;
    } catch (error) {
        console.error('Error creating adoption request:', error);
        if (error instanceof Error) throw error;
        throw new Error('An unknown error occurred while creating the adoption request.');
    }
}

/**
 * Updates the message of an existing adoption request.
 * @param token - The user's access token.
 * @param requestId - The ID of the adoption request to update.
 * @param message - The new message.
 * @returns The updated adoption request object.
 */
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
            throw new Error(getErrorMessage(result, 'Failed to update adoption request.'));
        }
        return result;
    } catch (error) {
        console.error('Error updating adoption request:', error);
        if (error instanceof Error) throw error;
        throw new Error('An unknown error occurred while updating the adoption request.');
    }
}

/**
 * Deletes a user's own adoption request.
 * @param token - The user's access token.
 * @param requestId - The ID of the adoption request to delete.
 * @returns A success message.
 */
export async function deleteAdoptionRequest(token: string, requestId: number) {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }
    const url = `${API_BASE_URL}${API_ENDPOINTS.petAdoptions}${requestId}`;

    try {
        const response = await fetchWithAuth(url, {
            method: 'DELETE',
        }, token);

        if (![200, 204].includes(response.status)) {
            const result = await response.json();
            throw new Error(getErrorMessage(result, 'Failed to delete adoption request.'));
        }

        return { message: 'Adoption request deleted successfully.' };
    } catch (error) {
        console.error('Error deleting adoption request:', error);
        if (error instanceof Error) throw error;
        throw new Error('An unknown error occurred while deleting the adoption request.');
    }
}

/**
 * Updates the status of a received adoption request (approved or rejected).
 * @param token - The user's access token.
 * @param requestId - The ID of the request to update.
 * @param status - The new status ('accepted' or 'rejected').
 * @returns The updated adoption request object.
 */
export async function updateReceivedAdoptionRequestStatus(token: string, requestId: number, status: 'accepted' | 'rejected') {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }
    const url = `${API_BASE_URL}${API_ENDPOINTS.updateUserAdoptionRequest}${requestId}`;

    try {
        const response = await fetchWithAuth(url, {
            method: 'POST',
            body: JSON.stringify({ status }),
        }, token);
        
        if (!response.ok) {
            const result = await response.json();
            if (response.status === 404) {
                 throw new Error(getErrorMessage(result, `Request not found.`));
            } else if (response.status === 400) {
                 throw new Error(getErrorMessage(result, `This request may have already been processed.`));
            } else if (response.status === 403) {
                 throw new Error(getErrorMessage(result, `You do not have permission to perform this action.`));
            }
            throw new Error(getErrorMessage(result, `Failed to update request to ${status}.`));
        }

        return await response.json();
    } catch (error) {
        if ((error as any).name === 'AbortError') {
            throw new Error('Adoption request status update timed out.');
        }
        console.error('Error updating adoption request status:', error);
        if (error instanceof Error) {
           throw new Error(error.message);
        }
        throw new Error(`An unknown error occurred while updating the request status.`);
    }
}


// =================================================================================
// NOTIFICATION ACTIONS
// =================================================================================

/**
 * Fetches notifications for the authenticated user, with optional filters.
 * @param token - The user's access token.
 * @param filters - (Optional) Filters for pet status or read status.
 * @returns An array of Notification objects.
 */
export async function getNotifications(
  token: string,
  filters: { pet_status?: string; read_status?: string } = {}
): Promise<Notification[]> {
  if (!API_BASE_URL) {
    throw new Error('API is not configured. Please contact support.');
  }

  const url = new URL(`${API_BASE_URL}${API_ENDPOINTS.notifications}`);
  if (filters.pet_status && filters.pet_status !== 'all') {
    url.searchParams.append('pet_status', filters.pet_status);
  }
  if (filters.read_status && filters.read_status !== 'all') {
    url.searchParams.append('read_status', filters.read_status);
  }

  try {
    const response = await fetchWithAuth(url.toString(), {
      method: 'GET',
      cache: 'no-store',
    }, token);

    const result = await response.json();
    if (!response.ok) {
      throw new Error(getErrorMessage(result, 'Failed to fetch notifications.'));
    }
    
    // Transform the nested data into the flat Notification structure
    const transformedData = result.data.map((item: any): Notification => ({
        id: item.id,
        message: item.content, // Map content to message
        created_at: item.created_at,
        is_read: item.is_read,
        pet_id: item.pet,
        pet_name: item.pet_name,
        pet_image: item.pet_data?.pet_image || null,
        pet_status: item.pet_data?.pet_status || 'adoptable',
    }));

    return transformedData || [];
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Request for notifications timed out.');
    }
    if (error.message?.includes('Session expired')) {
      throw new Error('Session expired');
    }
    console.error('Error fetching notifications:', error);
    throw new Error(error.message || 'An unknown error occurred while fetching notifications.');
  }
}

/**
 * Marks a specific notification as read.
 * @param token - The user's access token.
 * @param notificationId - The ID of the notification to mark as read.
 * @returns The updated notification data or a success message.
 */
export async function readNotification(token: string, notificationId: number) {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }
    const url = `${API_BASE_URL}${API_ENDPOINTS.notifications}${notificationId}/`;

    try {
        const response = await fetchWithAuth(url, { method: 'PATCH' }, token);
        
        if (!response.ok) {
            const result = await response.json();
            throw new Error(getErrorMessage(result, 'Failed to read notification.'));
        }
        
        // For PATCH, success might be a 200 with data or 204 with no data.
        try {
            const result = await response.json();
            return result.data;
        } catch (e) {
            // Handle 204 No Content case
            return { message: 'Notification marked as read.' };
        }

    } catch (error) {
        console.error('Error reading notification:', error);
        if (error instanceof Error) throw error;
        throw new Error('An unknown error occurred.');
    }
}

/**
 * Deletes a specific notification.
 * @param token - The user's access token.
 * @param notificationId - The ID of the notification to delete.
 * @returns A success message.
 */
export async function deleteNotification(token: string, notificationId: number) {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }
    const url = `${API_BASE_URL}${API_ENDPOINTS.notifications}${notificationId}/`;

    try {
        const response = await fetchWithAuth(url, { method: 'DELETE' }, token);
        if (!response.ok && response.status !== 204) {
            const result = await response.json();
            throw new Error(getErrorMessage(result, 'Failed to delete notification.'));
        }
        return { message: 'Notification deleted successfully.' };
    } catch (error) {
        console.error('Error deleting notification:', error);
        if (error instanceof Error) throw error;
        throw new Error('An unknown error occurred.');
    }
}

// =================================================================================
// ADMIN ACTIONS
// =================================================================================

/**
 * Fetches all key metrics for the admin dashboard.
 * @param token - The admin's access token.
 * @returns An object containing metrics for users, pets, reports, and adoptions.
 */
export async function getAdminDashboardMetrics(token: string) {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }

    try {
        const response = await fetchWithAuth(`${API_BASE_URL}${API_ENDPOINTS.adminDashboardMetrics}`, {
            method: 'GET',
            cache: 'no-store'
        }, token);

        const result = await response.json();

        if (!response.ok) {
            throw new Error(getErrorMessage(result, 'Failed to fetch admin dashboard metrics.'));
        }

        return result.data;
    } catch (error) {
        if ((error as any).name === 'AbortError') {
            throw new Error('Request for admin dashboard metrics timed out.');
        }
        console.error('Error fetching admin dashboard metrics:', error);
        if (error instanceof Error) {
           throw new Error(error.message);
        }
        throw new Error('An unknown error occurred while fetching admin dashboard metrics.');
    }
}

/**
 * Fetches a list of all registered users for the admin panel.
 * @param token - The admin's access token.
 * @returns An array of RegisteredUser objects.
 */
export async function getRegisteredUsers(token: string): Promise<RegisteredUser[]> {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }

    try {
        const response = await fetchWithAuth(`${API_BASE_URL}${API_ENDPOINTS.registeredUsers}`, {
            method: 'GET',
            cache: 'no-store'
        }, token);

        const result = await response.json();

        if (!response.ok) {
            throw new Error(getErrorMessage(result, 'Failed to fetch registered users.'));
        }

        return result.data || [];
    } catch (error) {
        if ((error as any).name === 'AbortError') {
            throw new Error('Request for registered users timed out.');
        }
        console.error('Error fetching registered users:', error);
        if (error instanceof Error) {
           throw new Error(error.message);
        }
        throw new Error('An unknown error occurred while fetching registered users.');
    }
}

/**
 * Fetches a list of all unverified users.
 * @param token - The admin's access token.
 * @returns An array of UnverifiedUser objects.
 */
export async function getUnverifiedUsers(token: string): Promise<UnverifiedUser[]> {
  if (!API_BASE_URL) {
    throw new Error('API is not configured. Please contact support.');
  }

  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}${API_ENDPOINTS.registeredUsers}`,
      {
        method: 'GET',
        cache: 'no-store',
      },
      token
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        getErrorMessage(result, 'Failed to fetch unverified users.')
      );
    }

    const allUsers: RegisteredUser[] = result.data || [];
    const unverifiedUsers: UnverifiedUser[] = allUsers
        .filter(user => !user.is_verified)
        .map(({ id, profile_image, username, email, first_name, last_name, date_joined }) => ({
             id, profile_image, username, email, first_name, last_name, date_joined
        }));
    
    return unverifiedUsers;
  } catch (error) {
    if ((error as any).name === 'AbortError') {
      throw new Error('Request for unverified users timed out.');
    }
    console.error('Error fetching unverified users:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unknown error occurred while fetching unverified users.');
  }
}

/**
 * Updates the status of a user (verified, active, or staff).
 * @param token - The admin's access token.
 * @param userId - The ID of the user to update.
 * @param field - The status field to update.
 * @param value - The new boolean value for the status.
 * @returns The updated user object.
 */
export async function updateUserStatus(token: string, userId: number, field: 'is_verified' | 'is_active' | 'is_staff', value: boolean) {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }

    try {
        const response = await fetchWithAuth(`${API_BASE_URL}${API_ENDPOINTS.registeredUsers}${userId}/`, {
            method: 'PATCH',
            body: JSON.stringify({ [field]: value }),
        }, token);
        
        const result = await response.json();

        if (!response.ok) {
            throw new Error(getErrorMessage(result, 'Failed to update user status.'));
        }

        return result;
    } catch (error) {
        if ((error as any).name === 'AbortError') {
            throw new Error('User status update request timed out.');
        }
        console.error('Error updating user status:', error);
        if (error instanceof Error) {
           throw new Error(error.message);
        }
        throw new Error('An unknown error occurred while updating user status.');
    }
}

/**
 * Fetches pet reports for the admin panel, with optional status filtering.
 * @param token - The admin's access token.
 * @param status - (Optional) Filter reports by status.
 * @returns An array of AdminPetReport objects.
 */
export async function getAdminPetReports(token: string, status?: 'pending' | 'approved' | 'rejected' | 'last50'): Promise<AdminPetReport[]> {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }
    const url = new URL(`${API_BASE_URL}${API_ENDPOINTS.adminPetReports}`);
    if (status) {
        url.searchParams.append('status', status);
    }

    try {
        const response = await fetchWithAuth(url.toString(), {
            method: 'GET',
            cache: 'no-store'
        }, token);

        const result = await response.json();

        if (!response.ok) {
            throw new Error(getErrorMessage(result, 'Failed to fetch pet reports.'));
        }

        return result.data || [];
    } catch (error) {
        if ((error as any).name === 'AbortError') {
            throw new Error('Request for pet reports timed out.');
        }
        console.error('Error fetching pet reports:', error);
        if (error instanceof Error) {
           throw new Error(error.message);
        }
        throw new Error('An unknown error occurred while fetching pet reports.');
    }
}

/**
 * Updates the status of a pet report (approved, rejected, or resolved).
 * @param token - The admin's access token.
 * @param reportId - The ID of the report to update.
 * @param status - The new status for the report.
 * @returns The updated report object.
 */
export async function updatePetReportStatus(token: string, reportId: number, status: 'approved' | 'rejected' | 'resolved') {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }
    const url = `${API_BASE_URL}${API_ENDPOINTS.adminPetReports}${reportId}/`;

    try {
        const response = await fetchWithAuth(url, {
            method: 'PATCH',
            body: JSON.stringify({ report_status: status }),
        }, token);
        
        const result = await response.json();

        if (!response.ok) {
            throw new Error(getErrorMessage(result, `Failed to update report to ${status}.`));
        }

        return result;
    } catch (error) {
        if ((error as any).name === 'AbortError') {
            throw new Error('Report status update request timed out.');
        }
        console.error('Error updating report status:', error);
        if (error instanceof Error) {
           throw new Error(error.message);
        }
        throw new Error(`An unknown error occurred while updating the report status.`);
    }
}

/**
 * Fetches all pet reports of a specific status for general users.
 * @param token - The user's access token.
 * @param status - The status to filter reports by ('lost', 'found', 'adopt').
 * @returns An array of PetReport objects.
 */
export async function getPetReports(token: string, status: 'lost' | 'found' | 'adopt'): Promise<PetReport[]> {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }
    const url = new URL(`${API_BASE_URL}${API_ENDPOINTS.petReports}`);
    url.searchParams.append('pet_status', status);

    try {
        const response = await fetchWithAuth(url.toString(), {
            method: 'GET',
            cache: 'no-store'
        }, token);

        const result = await response.json();

        if (!response.ok) {
            throw new Error(getErrorMessage(result, 'Failed to fetch pet reports.'));
        }

        return result.data || [];
    } catch (error) {
        if ((error as any).name === 'AbortError') {
            throw new Error('Request for pet reports timed out.');
        }
        console.error('Error fetching pet reports:', error);
        if (error instanceof Error) {
           throw new Error(error.message);
        }
        throw new Error('An unknown error occurred while fetching pet reports.');
    }
}

/**
 * Fetches adoption requests for the admin panel, with optional status filtering.
 * @param token - The admin's access token.
 * @param status - (Optional) Filter requests by status ('pending', 'recents', 'rejected').
 * @returns An array of AdoptionRequest objects.
 */
export async function getAdminAdoptionRequests(token: string, status?: 'pending' | 'recents' | 'rejected'): Promise<AdoptionRequest[]> {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }
    const url = new URL(`${API_BASE_URL}${API_ENDPOINTS.adminAdoptionRequests}`);
    if (status) {
        url.searchParams.append('report_status', status);
    }

    try {
        const response = await fetchWithAuth(url.toString(), {
            method: 'GET',
            cache: 'no-store'
        }, token);

        const result = await response.json();

        if (!response.ok) {
            throw new Error(getErrorMessage(result, 'Failed to fetch adoption requests.'));
        }
        
        // Transform the data to match the AdoptionRequest type
        const transformedData: AdoptionRequest[] = result.data.map((item: any) => ({
            id: item.id,
            pet: item.pet,
            pet_name: item.pet_name,
            pet_image: item.pet_image,
            message: item.message,
            status: item.status,
            report_status: item.report_status,
            requester_id: item.requester_id,
            requester_profile_image: item.requester_profile_image,
            requester_name: item.requester_username, // Map from requester_username
            owner_id: item.owner_id,
            owner_name: item.owner_username, // Map from owner_username
            created_at: item.created_at,
        }));

        return transformedData;
    } catch (error) {
        if ((error as any).name === 'AbortError') {
            throw new Error('Request for adoption requests timed out.');
        }
        console.error('Error fetching adoption requests:', error);
        if (error instanceof Error) {
           throw new Error(error.message);
        }
        throw new Error('An unknown error occurred while fetching adoption requests.');
    }
}

/**
 * Updates the status of an adoption request (approved or rejected) by an admin.
 * @param token - The admin's access token.
 * @param requestId - The ID of the request to update.
 * @param status - The new status.
 * @param message - (Optional) A notification message for the user.
 * @returns The updated adoption request object.
 */
export async function updateAdoptionRequestStatus(token: string, requestId: number, status: 'approved' | 'rejected', message?: string) {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }
    const url = `${API_BASE_URL}${API_ENDPOINTS.adminAdoptionRequests}${requestId}/`;

    try {
        const response = await fetchWithAuth(url, {
            method: 'PATCH',
            body: JSON.stringify({ report_status: status, message: message }),
        }, token);
        
        const result = await response.json();

        if (!response.ok) {
            throw new Error(getErrorMessage(result, `Failed to update request to ${status}.`));
        }

        return result;
    } catch (error) {
        if ((error as any).name === 'AbortError') {
            throw new Error('Adoption request status update timed out.');
        }
        console.error('Error updating adoption request status:', error);
        if (error instanceof Error) {
           throw new Error(error.message);
        }
        throw new Error(`An unknown error occurred while updating the request status.`);
    }
}

/**
 * Deletes an adoption request from the admin panel.
 * @param token - The admin's access token.
 * @param requestId - The ID of the request to delete.
 * @returns A success message.
 */
export async function deleteAdminAdoptionRequest(token: string, requestId: number) {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }
    const url = `${API_BASE_URL}${API_ENDPOINTS.adminAdoptionRequests}${requestId}/`;

    try {
        const response = await fetchWithAuth(url, { method: 'DELETE' }, token);
        if (!response.ok && response.status !== 204) {
            const result = await response.json();
            throw new Error(getErrorMessage(result, 'Failed to delete adoption request.'));
        }
        return { message: 'Adoption request deleted successfully.' };
    } catch (error) {
        console.error('Error deleting adoption request:', error);
        if (error instanceof Error) throw error;
        throw new Error('An unknown error occurred.');
    }
}

// =================================================================================
// FAVORITES & STORIES ACTIONS
// =================================================================================

/**
 * Fetches the list of favorite pets for the authenticated user.
 * @param token - The user's access token.
 * @returns An array of FavoritePet objects.
 */
export async function getFavoritePets(token: string): Promise<FavoritePet[]> {
    if (!API_BASE_URL) throw new Error('API not configured.');
    const url = `${API_BASE_URL}${API_ENDPOINTS.favouritePets}`;
    try {
        const response = await fetchWithAuth(url, { method: 'GET', cache: 'no-store' }, token);
        const result = await response.json();
        if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to fetch favorite pets.'));
        return result.data || [];
    } catch (error) {
        console.error('Error fetching favorite pets:', error);
        if (error instanceof Error) throw error;
        throw new Error('An unknown error occurred while fetching favorites.');
    }
}

/**
 * Adds a pet to the user's favorites.
 * @param token - The user's access token.
 * @param petId - The ID of the pet to add.
 * @returns The new favorite pet object.
 */
export async function addFavoritePet(token: string, petId: number) {
    if (!API_BASE_URL) throw new Error('API not configured.');
    const url = `${API_BASE_URL}${API_ENDPOINTS.favouritePets}`;
    try {
        const response = await fetchWithAuth(url, {
            method: 'POST',
            body: JSON.stringify({ pet_id: petId }),
        }, token);
        const result = await response.json();
        if (!response.ok) throw new Error(getErrorMessage(result, 'Failed to add to favorites.'));
        return result;
    } catch (error) {
        console.error('Error adding favorite:', error);
        if (error instanceof Error) throw error;
        throw new Error('An unknown error occurred.');
    }
}

/**
 * Removes a pet from the user's favorites.
 * @param token - The user's access token.
 * @param petId - The ID of the pet to remove.
 * @returns A success message.
 */
export async function removeFavoritePet(token: string, petId: number) {
    if (!API_BASE_URL) throw new Error('API not configured.');
    const url = `${API_BASE_URL}${API_ENDPOINTS.favouritePets}`;
    try {
        const response = await fetchWithAuth(url, {
            method: 'DELETE',
            body: JSON.stringify({ pet_id: petId }),
        }, token);
         if (response.status !== 204 && !response.ok) {
            const result = await response.json();
            throw new Error(getErrorMessage(result, 'Failed to remove from favorites.'));
        }
        return { message: 'Removed from favorites' };
    } catch (error) {
        console.error('Error removing favorite:', error);
        if (error instanceof Error) throw error;
        throw new Error('An unknown error occurred.');
    }
}

/**
 * Fetches all user-submitted stories.
 * @param token - The user's access token.
 * @returns An array of UserStory objects.
 */
export async function getUserStories(token: string): Promise<UserStory[]> {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }
    const url = `${API_BASE_URL}${API_ENDPOINTS.userStories}`;

    try {
        const response = await fetchWithAuth(url, {
            method: 'GET',
            cache: 'no-store'
        }, token);

        const result = await response.json();

        if (!response.ok) {
            throw new Error(getErrorMessage(result, 'Failed to fetch user stories.'));
        }
        
        return result.data || [];
    } catch (error) {
        if ((error as any).name === 'AbortError') {
            throw new Error('Request for user stories timed out.');
        }
        console.error('Error fetching user stories:', error);
        if (error instanceof Error) {
           throw new Error(error.message);
        }
        throw new Error('An unknown error occurred while fetching user stories.');
    }
}

/**
 * Fetches a selection of user stories for the public landing page.
 * @returns An array of HomeUserStory objects.
 */
export async function getHomeUserStories(): Promise<HomeUserStory[]> {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }
    const url = `${API_BASE_URL}${API_ENDPOINTS.homeUserStories}`;

    try {
        const response = await fetchWithTimeout(url, {
            method: 'GET',
            cache: 'no-store'
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(getErrorMessage(result, 'Failed to fetch home user stories.'));
        }
        
        return result.data || [];
    } catch (error) {
        if ((error as any).name === 'AbortError') {
            throw new Error('Request for home user stories timed out.');
        }
        console.error('Error fetching home user stories:', error);
        if (error instanceof Error) {
           throw new Error(error.message);
        }
        throw new Error('An unknown error occurred while fetching home user stories.');
    }
}

/**
 * Creates a new user story.
 * @param token - The user's access token.
 * @param petId - (Optional) The ID of the pet the story is about.
 * @param title - The title of the story.
 * @param content - The content of the story.
 * @returns The newly created story object.
 */
export async function createUserStory(token: string, petId: number | null | undefined, title: string, content: string) {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }
    const url = `${API_BASE_URL}${API_ENDPOINTS.userStories}`;

    try {
        const response = await fetchWithAuth(url, {
            method: 'POST',
            body: JSON.stringify({ pet: petId, title, content }),
        }, token);

        const result = await response.json();
        if (!response.ok) {
            throw new Error(getErrorMessage(result, 'Failed to create user story.'));
        }
        return result;
    } catch (error) {
        console.error('Error creating user story:', error);
        if (error instanceof Error) throw error;
        throw new Error('An unknown error occurred while creating the user story.');
    }
}

/**
 * Searches for pets based on a query string.
 * @param token - The user's access token.
 * @param query - The search term.
 * @returns An array of simplified Pet objects matching the search.
 */
export async function searchPets(token: string, query: string): Promise<Pet[]> {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }
    const url = new URL(`${API_BASE_URL}${API_ENDPOINTS.searchQuery}`);
    url.searchParams.append('query', query);

    try {
        const response = await fetchWithAuth(url.toString(), {
            method: 'GET',
            cache: 'no-store'
        }, token);

        const result = await response.json();

        if (!response.ok) {
            throw new Error(getErrorMessage(result, 'Failed to search for pets.'));
        }

        // The search API returns a simplified pet object. We need to map it to the full Pet type.
        const transformedData: Pet[] = result.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            pet_image: item.pet_image,
            type_name: item.pet_type,
            // Add default values for fields not present in the search response
            description: null,
            gender: 'Unknown',
            age: null,
            weight: null,
            breed: null,
            color: null,
            is_vaccinated: false,
            is_diseased: false,
            address: null,
            city: null,
            pincode: null,
            state: null,
            created_by: 0,
            created_at: '',
            modified_by: null,
            modified_at: '',
            medical_history: null,
            adoption_requests: [],
            pet_report: null,
        }));

        return transformedData;
    } catch (error) {
        if ((error as any).name === 'AbortError') {
            throw new Error('Search request timed out.');
        }
        console.error('Error searching for pets:', error);
        if (error instanceof Error) {
           throw new Error(error.message);
        }
        throw new Error('An unknown error occurred while searching for pets.');
    }
}


    
