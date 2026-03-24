import { createContext, useContext, type ReactNode } from 'react';
export type UserRole = 'student' | 'teacher' | 'company';
export type UserStatus = 'pending' | 'approved' | 'rejected';
export interface RegisteredUser { id: string; role: UserRole; firstName: string; lastName: string; email: string; status: UserStatus; registeredDate: string; lineDisplayName: string; password: string; studentId?: string; department?: string; company?: string; }
interface RegisteredUsersContextType { users: RegisteredUser[]; addUser: (user: Omit<RegisteredUser, 'id' | 'status' | 'registeredDate'>) => void; updateUserStatus: (id: string, status: UserStatus) => void; resetPassword: (id: string, newPassword: string) => void; getStudents: () => RegisteredUser[]; getTeachers: () => RegisteredUser[]; getCompanies: () => RegisteredUser[]; }
const RegisteredUsersContext = createContext<RegisteredUsersContextType | undefined>(undefined);
export const RegisteredUsersProvider = ({ children }: { children: ReactNode }) => {
    const users: RegisteredUser[] = [];
    const addUser = () => {}; const updateUserStatus = () => {}; const resetPassword = () => {};
    const getStudents = () => [] as RegisteredUser[]; const getTeachers = () => [] as RegisteredUser[]; const getCompanies = () => [] as RegisteredUser[];
    return (<RegisteredUsersContext.Provider value={{ users, addUser, updateUserStatus, resetPassword, getStudents, getTeachers, getCompanies }}>{children}</RegisteredUsersContext.Provider>);
};
export const useRegisteredUsers = () => { const context = useContext(RegisteredUsersContext); if (!context) throw new Error('useRegisteredUsers must be used within a RegisteredUsersProvider'); return context; };
