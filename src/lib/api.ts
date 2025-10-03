'use server';

import API_ENDPOINTS, { API_REQUEST_TIMEOUT } from "./endpoints";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchWithTimeout(url: string, options: RequestInit, timeout = API_REQUEST_TIMEOUT) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
        ...options,
        signal: controller.signal  
    });

    clearTimeout(id);

    return response;
}

export async function fetchWithAuth(url: string, options: RequestInit, token: string) {
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
        // Removed auto-refresh logic. Directly throw session expired error.
        throw new Error('Session expired');
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
