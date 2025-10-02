import config from '../config/environment';

/**
 * API Client for backend communication
 * Provides a clean, modular interface for all API calls
 */
class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  /**
   * Make a generic API request
   * @param {string} endpoint - API endpoint (without base URL)
   * @param {Object} options - Fetch options (method, headers, body, etc.)
   * @returns {Promise<Object>} Response data
   * @throws {Error} API error with user-friendly message
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const responseText = await response.text();

      if (!response.ok) {
        // Handle HTTP errors
        console.error('API request failed. Status:', response.status);
        console.error('Raw server response:', responseText);
        
        try {
          const errorJson = JSON.parse(responseText);
          throw this._createUserFriendlyError(errorJson, response.status);
        } catch (parseError) {
          if (parseError.userFriendly) {
            // Re-throw our custom error
            throw parseError;
          }
          // JSON parse failed
          console.error('Failed to parse server error response JSON:', parseError);
          const error = new Error('Could not understand the server\'s error message. The raw response for our developers is: ' + responseText);
          error.userFriendly = true;
          throw error;
        }
      }

      // Success - parse and return the response
      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse success response JSON:', parseError);
        throw new Error('Received an invalid data format from the server.');
      }
    } catch (error) {
      // Handle network errors and other exceptions
      if (error.userFriendly) {
        // Already a user-friendly error, re-throw it
        throw error;
      }
      
      console.error('API request error:', error);
      
      if (error.message && error.message.toLowerCase().includes('network request failed')) {
        throw new Error('Could not connect to the server. Please check your network connection.');
      }
      
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }

  /**
   * Create a user-friendly error from server response
   * @private
   */
  _createUserFriendlyError(errorJson, statusCode) {
    let message = 'An error occurred. Please try again.';
    
    if (errorJson.detail) {
      if (Array.isArray(errorJson.detail) && errorJson.detail.length > 0) {
        const firstError = errorJson.detail[0];
        if (firstError && typeof firstError.msg === 'string') {
          const serverMsg = firstError.msg;
          console.log('Server error detail:', serverMsg);
          
          // Map common server errors to user-friendly messages
          if (serverMsg.toLowerCase().includes('not a valid email address') && 
              serverMsg.toLowerCase().includes('@-sign')) {
            message = 'The email address you entered is not valid. Please ensure it includes an \'@\' symbol and a domain (e.g., user@example.com).';
          } else {
            message = 'There was an issue with the information provided. Please review your details.';
          }
        }
      } else if (typeof errorJson.detail === 'string') {
        console.log('Server error detail string:', errorJson.detail);
        message = 'Registration failed due to an issue with the provided data. Please try again.';
      }
    }
    
    const error = new Error(message);
    error.userFriendly = true;
    error.statusCode = statusCode;
    return error;
  }

  /**
   * POST request helper
   */
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * GET request helper
   */
  async get(endpoint) {
    return this.request(endpoint, {
      method: 'GET',
    });
  }

  /**
   * PUT request helper
   */
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request helper
   */
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient(config.apiUrl);

export default apiClient;
