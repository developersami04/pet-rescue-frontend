
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

    const response = await fetchWithTimeout(url, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        console.error("Authentication error: The access token is invalid or has expired.");
        // We will no longer attempt to refresh the token here.
        // The error will be propagated to be handled by the calling function.
        // This often involves logging the user out.
        throw new Error('Session expired');
    }

    return response;
}
