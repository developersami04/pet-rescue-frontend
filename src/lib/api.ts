

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

// Token refresh logic
let isRefreshing = false;
let failedQueue: { resolve: (value?: any) => void; reject: (reason?: any) => void; }[] = [];

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

async function refreshAccessToken() {
    isRefreshing = true;
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        isRefreshing = false;
        throw new Error('Session expired');
    }

    try {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.refreshToken}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (!response.ok) {
            throw new Error('Session expired');
        }

        const data = await response.json();
        const newAccessToken = data.access_token;
        localStorage.setItem('authToken', newAccessToken);
        processQueue(null, newAccessToken);
        return newAccessToken;
    } catch (error) {
        processQueue(error, null);
        // Clear session if refresh fails
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        window.dispatchEvent(new Event('storage'));
        throw error;
    } finally {
        isRefreshing = false;
    }
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
            }).then(newToken => {
                 headers['Authorization'] = `Bearer ${newToken}`;
                 return fetchWithTimeout(url, { ...options, headers });
            });
        }

        try {
            const newAccessToken = await refreshAccessToken();
            headers['Authorization'] = `Bearer ${newAccessToken}`;
            response = await fetchWithTimeout(url, { ...options, headers });
        } catch (error) {
            throw new Error('Session expired');
        }
    }

    return response;
}
