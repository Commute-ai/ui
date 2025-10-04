// Mock implementation of your ApiClient
class MockApiClient {
    async get(endpoint) {
        // Return mock data based on endpoint
        if (endpoint.includes("/users")) {
            return { data: [{ id: 1, name: "Test User" }] };
        }
        return { data: null };
    }

    async post(endpoint, data) {
        if (endpoint.includes("/login")) {
            return {
                data: {
                    token: "mock-token",
                    user: { id: 1, username: data.username },
                },
            };
        }
        return { data: null };
    }

    async put(endpoint, data) {
        if (endpoint.include("/ping")) {
            return { data: { ...data, pong: true } };
        }
        return { data: { ...data, id: 1 } };
    }

    async delete(endpoint) {
        if (endpoint.include("/ping")) {
            return { data: { pong: true } };
        }
        return { data: { success: true } };
    }
}

const apiClient = new MockApiClient();

export default apiClient;
