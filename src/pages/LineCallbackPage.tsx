import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LineCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginWithToken } = useAuth();

    useEffect(() => {
        const handleCallback = async () => {
            // รับ token จาก LINE callback (backend redirect กลับมาพร้อม line_token)
            const lineToken = searchParams.get('line_token');
            const role = searchParams.get('role');
            const error = searchParams.get('error');

            if (error) {
                navigate('/login?error=' + error);
                return;
            }

            if (lineToken) {
                try {
                    // ใช้ token login ผ่าน AuthContext
                    const { user } = await loginWithToken(lineToken);
                    const userRole = user.sys_role || role;

                    switch (userRole) {
                        case 'admin': navigate('/admin'); break;
                        case 'advisor': navigate('/teacher'); break;
                        case 'supervisor': navigate('/company'); break;
                        case 'student': navigate('/time-attendance'); break;
                        default: navigate('/');
                    }
                } catch {
                    navigate('/login?error=line_error');
                }
            } else {
                navigate('/login?error=line_error');
            }
        };

        handleCallback();
    }, [searchParams, navigate, loginWithToken]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-[#06c755] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-xl font-bold text-gray-700">กำลังเข้าสู่ระบบ...</p>
                <p className="text-gray-400 mt-2">กรุณารอสักครู่</p>
            </div>
        </div>
    );
};

export default LineCallbackPage;
