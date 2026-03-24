import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const LineCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        const role = searchParams.get('role');

        if (token && role) {
            // LINE Login สำเร็จ → บันทึก token แล้ว redirect ตาม role
            localStorage.setItem('token', token);
            
            switch (role) {
                case 'admin': navigate('/admin'); break;
                case 'advisor': navigate('/teacher'); break;
                case 'supervisor': navigate('/company'); break;
                case 'student': navigate('/time-attendance'); break;
                default: navigate('/');
            }
        } else {
            // ไม่มี token → กลับไปหน้า login
            navigate('/login?error=line_error');
        }
    }, [searchParams, navigate]);

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
