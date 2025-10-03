'use server';

import API_ENDPOINTS from "../endpoints";
import { fetchWithAuth } from "../api";
import type { Notification } from "../data";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
      throw new Error(result.message || result.detail || 'Failed to fetch notifications.');
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
            throw new Error(result.message || 'Failed to read notification.');
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
            throw new Error(result.message || 'Failed to delete notification.');
        }
        return { message: 'Notification deleted successfully.' };
    } catch (error) {
        console.error('Error deleting notification:', error);
        if (error instanceof Error) throw error;
        throw new Error('An unknown error occurred.');
    }
}
