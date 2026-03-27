import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
    children: React.ReactNode;
    roles?: string[]; // role ที่อนุญาตให้เข้า เช่น ['admin'] หรือ ['student', 'advisor']
}

const PrivateRoute = ({ children, roles }: PrivateRouteProps) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    // รอโหลด auth state ก่อน
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#4472c4] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">กำลังตรวจสอบสิทธิ์...</p>
                </div>
            </div>
        );
    }

    // ยังไม่ login → ไปหน้า login พร้อมจำ path ที่จะกลับมา
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // ถ้าระบุ roles → ตรวจสอบว่า user มี role ที่อนุญาตไหม
    if (roles && roles.length > 0 && user?.sys_role) {
        if (!roles.includes(user.sys_role)) {
            // role ไม่ตรง → redirect ไปหน้าหลักของ role นั้น
            const roleRedirect: Record<string, string> = {
                admin: '/admin',
                advisor: '/teacher',
                supervisor: '/company',
                student: '/',
            };
            const redirectTo = roleRedirect[user.sys_role] || '/';
            return <Navigate to={redirectTo} replace />;
        }
    }

    return <>{children}</>;
};

export default PrivateRoute;
