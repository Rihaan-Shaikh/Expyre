const BASE_URL = "https://expyre.onrender.com";

/**
 * Generate a new temporary email address
 */
export async function generateEmail() {
    try {
        const response = await fetch(`${BASE_URL}/generate-email`);
        if (!response.ok) {
            throw new Error(`Failed to generate email: ${response.statusText}`);
        }
        const data = await response.json();

        // Fetch full details to get expires_at formatted correctly for the UI
        const details = await getEmailDetails(data.email);
        return details;
    } catch (error) {
        console.error("API Error (generateEmail):", error);
        throw error;
    }
}

/**
 * Get details for a specific email
 */
export async function getEmailDetails(email) {
    try {
        const response = await fetch(`${BASE_URL}/temp-email/${email}`);
        if (!response.ok) {
            throw new Error("Failed to fetch email details");
        }
        return await response.json();
    } catch (error) {
        console.error("API Error (getEmailDetails):", error)
        throw error;
    }
}

/**
 * Fetch inbox messages for an email
 */
export async function getInbox(email) {
    try {
        const response = await fetch(`${BASE_URL}/inbox/${email}`);
        if (!response.ok) {
            throw new Error("Failed to fetch inbox");
        }
        const data = await response.json();
        return data.messages || [];
    } catch (error) {
        console.error("API Error (getInbox):", error);
        throw error;
    }
}
