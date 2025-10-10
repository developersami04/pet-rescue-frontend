

'use server';

import { z } from "zod";
import API_ENDPOINTS from "./endpoints";
import { fetchWithAuth, fetchWithTimeout } from "./api";
import type { Pet, Notification, RegisteredUser, UnverifiedUser, AdminPetReport, PetReport, AdoptionRequest } from "./data";
// import { format } from "date-fns";

// Import the backend Host Address from .env file
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Helper functions
function getErrorMessage(result: any, defaultMessage: string): string {
    if (result) {
        if (typeof result === 'string' && result.trim().startsWith('<!doctype html>')) {
            return "The requested resource was not found on this server.";
        }
        if (result.message && typeof result.message === 'string') return result.message;
        if (result.detail && typeof result.detail === 'string') return result.detail;
        if (typeof result === 'object' && result !== null) {
            const messages = Object.values(result).flat();
            if (messages.length > 0) return messages.join(' ');
        }
    }
    return defaultMessage;
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
            throw new Error(getErrorMessage(result, 'Failed to register user.'));
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
            throw new Error(getErrorMessage(result, 'Failed to log in.'));
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
            return { isAuthenticated: false, user: null, error: getErrorMessage(result, 'Token validation failed.') };
        }

        return { isAuthenticated: true, user: result.user, message: result.message, error: null };
    } catch (error: any) {
        console.error('Error checking auth:', error);
        return { isAuthenticated: false, user: null, error: error.message || 'An unknown error occurred.' };
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

export async function updateUserDetails(token: string, userData: Record<string, any>) {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }
    
    const isFormData = userData instanceof FormData;

    const endpoint = userData.current_password ? API_ENDPOINTS.changePassword : API_ENDPOINTS.updateUserDetails;
    const method = userData.current_password ? 'POST' : 'PATCH';
    
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

//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------


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

export async function deletePetRequest(token: string, petId: string) {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }
    const url = `${API_BASE_URL}${API_ENDPOINTS.petRequestView}${petId}/`;

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
            throw new Error(getErrorMessage(result, 'Failed to create adoption request.'));
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
            throw new Error(getErrorMessage(result, 'Failed to update adoption request.'));
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

        if (response.status !== 204) {
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

export async function readNotification(token: string, notificationId: number) {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }
    const url = `${API_BASE_URL}${API_ENDPOINTS.notifications}${notificationId}/`;

    try {
        const response = await fetchWithAuth(url, { method: 'GET' }, token);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(getErrorMessage(result, 'Failed to read notification.'));
        }
        return result.data;
    } catch (error) {
        console.error('Error reading notification:', error);
        if (error instanceof Error) throw error;
        throw new Error('An unknown error occurred.');
    }
}

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

export async function getAdminAdoptionRequests(token: string, status?: 'pending' | 'approved' | 'rejected' | 'recents'): Promise<AdoptionRequest[]> {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }
    const url = new URL(`${API_BASE_URL}${API_ENDPOINTS.adminAdoptionRequests}`);
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
            throw new Error(getErrorMessage(result, 'Failed to fetch adoption requests.'));
        }

        return result.data || [];
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

export async function updateAdoptionRequestStatus(token: string, requestId: number, status: 'approved' | 'rejected') {
    if (!API_BASE_URL) {
        throw new Error('API is not configured. Please contact support.');
    }
    const url = `${API_BASE_URL}${API_ENDPOINTS.adminAdoptionRequests}${requestId}/`;

    try {
        const response = await fetchWithAuth(url, {
            method: 'PATCH',
            body: JSON.stringify({ status: status }),
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
