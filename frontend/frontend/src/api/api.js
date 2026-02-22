const BASE_URL = "https://expyre.onrender.com";

// Timeout wrapper for fetch — Render free tier can take 30+ seconds to cold start
function fetchWithTimeout(url, options = {}, timeoutMs = 45000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    return fetch(url, { ...options, signal: controller.signal })
        .then((response) => {
            clearTimeout(timeoutId);
            return response;
        })
        .catch((error) => {
            clearTimeout(timeoutId);
            if (error.name === "AbortError") {
                throw new Error("Request timed out — the backend may be waking up. Please try again.");
            }
            throw error;
        });
}

/**
 * Generate a new temporary email address.
 * Returns the full email details including expires_at.
 */
export async function generateEmail() {
    try {
        const response = await fetchWithTimeout(`${BASE_URL}/generate-email`);
        if (!response.ok) {
            throw new Error(`Failed to generate email: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();

        if (!data.email) {
            throw new Error("Invalid response: missing email field");
        }

        // The /generate-email endpoint returns { email, expires_in_minutes, expires_at }
        // Also fetch the full record from /temp-email/ to ensure we have accurate timestamps
        const details = await getEmailDetails(data.email);

        // If the temp-email lookup succeeded and has the data, use it
        if (details && details.exists && !details.expired) {
            return details;
        }

        // Fallback: use the original response data
        return {
            exists: true,
            email: data.email,
            expires_at: data.expires_at,
            expired: false,
        };
    } catch (error) {
        console.error("API Error (generateEmail):", error);
        throw error;
    }
}

/**
 * Get details for a specific email (created_at, expires_at, etc.)
 */
export async function getEmailDetails(email) {
    try {
        const response = await fetchWithTimeout(`${BASE_URL}/temp-email/${encodeURIComponent(email)}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch email details: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("API Error (getEmailDetails):", error);
        throw error;
    }
}

/**
 * Fetch inbox messages for an email
 */
export async function getInbox(email) {
    try {
        const response = await fetchWithTimeout(`${BASE_URL}/inbox/${encodeURIComponent(email)}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch inbox: ${response.status}`);
        }
        const data = await response.json();
        return data.messages || [];
    } catch (error) {
        console.error("API Error (getInbox):", error);
        throw error;
    }
}
