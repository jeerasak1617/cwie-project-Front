import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import heroImage from '../assets/hero-1.jpg';
import logoUniversity from '../assets/logo-university.png';
import api from '../api';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { loginAdmin } = useAuth();

    // เช็ค URL params สำหรับ error จาก LINE
    const params = new URLSearchParams(window.location.search);
    const lineError = params.get('error');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { user } = await loginAdmin(username, password);
            switch (user.sys_role) {
                case 'admin': navigate('/admin'); break;
                case 'advisor': navigate('/teacher'); break;
                case 'supervisor': navigate('/company'); break;
                case 'student': navigate('/time-attendance'); break;
                default: navigate('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || 'เข้าสู่ระบบไม่สำเร็จ');
        } finally { setLoading(false); }
    };

    const handleLineLogin = async () => {
        try {
            const res = await api.get('/auth/line/login');
            // Redirect ไปหน้า LINE Login
            window.location.href = res.data.login_url;
        } catch {
            setError('ไม่สามารถเชื่อมต่อ LINE Login ได้');
        }
    };

    return (
        <div className="min-h-screen flex">
            <div className="w-full xl:w-[35%] flex flex-col items-center justify-center bg-white px-8 py-12">
                <div className="w-full max-w-md">
                    <div className="flex justify-center mb-6">
                        <img src={logoUniversity} alt="มหาวิทยาลัยราชภัฏจันทรเกษม" className="w-44 h-44 object-contain" />
                    </div>
                    <div className="text-center mb-8">
                        <h1 className="text-xl font-bold text-[#2d5016] mb-1">ระบบฝึกประสบการณ์วิชาชีพ</h1>
                        <h2 className="text-xl font-bold text-[#2d5016]">และสหกิจศึกษา</h2>
                    </div>

                    {(error || lineError) && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                            {error || (lineError === 'line_cancelled' ? 'ยกเลิกการเข้าสู่ระบบด้วย LINE' : 'เกิดข้อผิดพลาดจาก LINE')}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User className="h-5 w-5 text-gray-400" /></div>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="รหัสประจำตัว" className="w-full pl-12 pr-4 py-4 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4472c4] focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400" />
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="รหัสผ่าน" className="w-full pl-12 pr-4 py-4 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4472c4] focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400" />
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-[#4472c4] hover:bg-[#3561b3] disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 text-lg">
                            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
                        <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500">หรือ</span></div>
                    </div>

                    <button onClick={handleLineLogin} className="w-full flex items-center justify-center gap-3 bg-[#06c755] hover:bg-[#05b34c] text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.105.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                        </svg>
                        <span>ล็อคอินด้วย LINE</span>
                    </button>
                </div>
            </div>
            <div className="hidden xl:block xl:w-[65%] relative">
                <img src={heroImage} alt="มหาวิทยาลัยราชภัฏจันทรเกษม" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/10"></div>
            </div>
        </div>
    );
};

export default LoginPage;
