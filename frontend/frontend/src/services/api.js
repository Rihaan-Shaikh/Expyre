const API_BASE_URL = 'http://localhost:8000';

export const api = {
  /**
   * Generate a new temporary email address
   */
  async generateEmail() {
    try {
      const response = await fetch(`${API_BASE_URL}/generate-email`);
      if (!response.ok) throw new Error('Failed to generate email');
      const data = await response.json();

      // The backend returns { email, expires_in_minutes }
      // We need to calculate the actual expiresAt date locally or fetch it from read_temp_email
      // Let's get the full record to be sure about the timestamp
      return await this.getEmailDetails(data.email);
    } catch (error) {
      console.error('API Error (generateEmail):', error);
      throw error;
    }
  },

  /**
   * Get details for a specific email (created_at, expires_at, etc.)
   */
  async getEmailDetails(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/temp-email/${email}`);
      if (!response.ok) throw new Error('Failed to fetch email details');
      return await response.json();
    } catch (error) {
      console.error('API Error (getEmailDetails):', error);
      throw error;
    }
  },

  /**
   * Fetch inbox messages for an email
   */
  async getInbox(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/inbox/${email}`);
      if (!response.ok) throw new Error('Failed to fetch inbox');
      const data = await response.json();
      return data.messages || [];
    } catch (error) {
      console.error('API Error (getInbox):', error);
      throw error;
    }
  }
};
