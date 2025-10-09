export class ApiError extends Error {
    public code: string;
    public statusCode: number | null;

    constructor(
        message: string,
        code: string,
        statusCode: number | null = null
    ) {
        super(message);
        this.name = "ApiError";
        this.code = code;
        this.statusCode = statusCode;
    }
}

const mockApiClient = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
    request: jest.fn(),
};

export default mockApiClient;
