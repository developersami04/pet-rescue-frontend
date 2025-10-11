

'use server';

import API_ENDPOINTS, { API_REQUEST_TIMEOUT } from "./endpoints";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void; }[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

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
    const headers: Record<string, string> = {};

    // Copy existing headers
    if (options.headers) {
        for (const [key, value] of Object.entries(options.headers)) {
            headers[key] = value;
        }
    }

    // Set Content-Type only if it's not FormData and not already set
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }
    
    headers['Authorization'] = `Bearer ${token}`;

    let response = await fetchWithTimeout(url, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
            .then(newAccessToken => {
                headers['Authorization'] = `Bearer ${newAccessToken}`;
                return fetchWithTimeout(url, { ...options, headers });
            })
            .catch(err => {
                return Promise.reject(err);
            });
        }

        isRefreshing = true;

        console.log("Access token expired, attempting to refresh...");
        try {
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
                console.log("Token refreshed successfully, retrying the original request...");
                headers['Authorization'] = `Bearer ${newAccessToken}`;
                processQueue(null, newAccessToken);
                response = await fetchWithTimeout(url, { ...options, headers });
            } else {
                 throw new Error('Session expired');
            }
        } catch (error) {
            processQueue(error, null);
            console.log("Failed to refresh token. User will be logged out.");
            throw new Error('Session expired');
        } finally {
            isRefreshing = false;
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

        const result = await response.json();

        if (!response.ok || result.status === 'Failed') {
            console.error('Failed to refresh access token:', result.message || 'Invalid refresh token.');
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            window.dispatchEvent(new Event('storage'));
            return null;
        }
        
        const newAccessToken = result.access_token;
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

