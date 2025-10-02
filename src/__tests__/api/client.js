// Mock fetch globally before any imports
global.fetch = jest.fn();

// Mock the config module before importing anything
jest.mock('../../config/environment', () => ({
  apiUrl: 'http://localhost:8000/api/v1',
}));

describe('API Client', () => {
  // Import ApiClient class directly and create instance for testing
  let ApiClient;
  let testClient;

  beforeAll(() => {
    // Dynamically import the module after mocks are set
    const clientModule = require('../../api/client');
    // Get the class from the module
    ApiClient = clientModule.default.constructor;
    testClient = new ApiClient('http://localhost:8000/api/v1');
  });

  beforeEach(() => {
    global.fetch.mockClear();
    jest.clearAllMocks();
  });

  describe('request method', () => {
    it('makes a successful GET request', async () => {
      const mockData = { id: 1, name: 'Test' };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockData)),
      });

      const result = await testClient.get('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/test',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockData);
    });

    it('makes a successful POST request', async () => {
      const mockData = { success: true };
      const postData = { email: 'test@example.com', password: 'password123' };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockData)),
      });

      const result = await testClient.post('/auth/register', postData);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/auth/register',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(postData),
        })
      );
      expect(result).toEqual(mockData);
    });

    it('throws user-friendly error for invalid email from server', async () => {
      const errorResponse = {
        detail: [{ msg: "This is not a valid email address, it must have an @-sign." }]
      };
      
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: () => Promise.resolve(JSON.stringify(errorResponse)),
      });

      await expect(testClient.post('/auth/register', {}))
        .rejects
        .toThrow("The email address you entered is not valid. Please ensure it includes an '@' symbol and a domain (e.g., user@example.com).");
    });

    it('throws user-friendly error for string detail from server', async () => {
      const errorResponse = {
        detail: "Some specific error occurred on the server."
      };
      
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: () => Promise.resolve(JSON.stringify(errorResponse)),
      });

      await expect(testClient.post('/auth/register', {}))
        .rejects
        .toThrow("Registration failed due to an issue with the provided data. Please try again.");
    });

    it('throws error with raw response when server returns non-JSON', async () => {
      const rawErrorText = "Internal Server Error - Not JSON";
      
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: () => Promise.resolve(rawErrorText),
      });

      await expect(testClient.post('/auth/register', {}))
        .rejects
        .toThrow('Could not understand the server\'s error message. The raw response for our developers is: ' + rawErrorText);
    });

    it('throws network error when fetch fails', async () => {
      global.fetch.mockRejectedValueOnce(new Error("Network request failed"));

      await expect(testClient.post('/auth/register', {}))
        .rejects
        .toThrow('Could not connect to the server. Please check your network connection.');
    });

    it('throws error when success response is not valid JSON', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve("Not valid JSON"),
      });

      await expect(testClient.get('/test'))
        .rejects
        .toThrow('Received an invalid data format from the server.');
    });
  });

  describe('helper methods', () => {
    it('PUT request works correctly', async () => {
      const mockData = { success: true };
      const putData = { name: 'Updated Name' };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockData)),
      });

      const result = await testClient.put('/users/1', putData);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/users/1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(putData),
        })
      );
      expect(result).toEqual(mockData);
    });

    it('DELETE request works correctly', async () => {
      const mockData = { success: true };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockData)),
      });

      const result = await testClient.delete('/users/1');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/users/1',
        expect.objectContaining({
          method: 'DELETE',
        })
      );
      expect(result).toEqual(mockData);
    });
  });
});
