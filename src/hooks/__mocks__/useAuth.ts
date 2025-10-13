import type { AuthContextType } from "@/context/AuthContext";

const mockUseAuth = jest.fn<AuthContextType, []>();

mockUseAuth.mockReturnValue({
    user: null,
    isLoaded: true,
    isSignedIn: false,
    signIn: jest.fn().mockResolvedValue(undefined),
    signUp: jest.fn().mockResolvedValue(undefined),
    signOut: jest.fn().mockResolvedValue(undefined),
    getToken: jest.fn().mockResolvedValue(null),
});

export const useAuth = mockUseAuth;
