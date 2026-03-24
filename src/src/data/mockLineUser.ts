// Mock LINE User Data
// In production, this would come from LINE Login API response

export interface LineUser {
    lineUserId: string;
    displayName: string;
    pictureUrl?: string;
    email?: string;
}

// Mock user data - simulates LINE Login response
export const mockLineUser: LineUser = {
    lineUserId: 'U1234567890abcdef',
    displayName: 'คุณ จิรศักดิ์',
    pictureUrl: 'https://profile.line-scdn.net/placeholder',
    email: 'jirasak@example.com',
};

// Mock API function to simulate LINE Login
export const mockLineLogin = (): Promise<LineUser> => {
    return new Promise((resolve) => {
        // Simulate network delay
        setTimeout(() => {
            resolve(mockLineUser);
        }, 500);
    });
};

// Function to get current LINE user (mock)
export const getCurrentLineUser = (): LineUser | null => {
    // In production, this would check session/localStorage
    return mockLineUser;
};
