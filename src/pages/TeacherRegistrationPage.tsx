import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLineAuth } from '../contexts/LineAuthContext';
import api from '../api';

interface Department {
    id: number;
    name_th: string;
    name_en?: string;
}

const TeacherRegistrationPage = () => {
    const navigate = useNavigate();
    const { lineUser } = useLineAuth();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || localStorage.getItem('reg_token') || '';

    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        departmentId: '',
        email: '',
    });

    const lineUserName = lineUser?.displayName || searchParams.get('name') || 'ผู้ใช้งาน';

    // ดึงรายชื่อสาขาจาก API
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const { data } = await api.get('/master/departments');
                setDepartments(data || []);
            } catch (err) {
                console.error('Failed to fetch departments:', err);
                // Fallback ถ้า API ยังไม่พร้อม
                setDepartments([
                    { id: 1, name_th: 'วิทยาการคอมพิวเตอร์และปัญญาประดิษฐ์' },
                    { id: 2, name_th: 'เทคโนโลยีสารสนเทศ' },
                    { id: 3, name_th: 'วิศวกรรมซอฟต์แวร์' },
                ]);
            }
        };
        fetchDepartments();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.departmentId) {
            alert('กรุณาเลือกสาขา');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/register/advisor', null, {
                params: {
                    token: token,
                    first_name_th: formData.firstName,
                    last_name_th: formData.lastName,
                    email: formData.email,
                    department_id: Number(formData.departmentId),
                }
            });
            // ลบ reg_token ออก
            localStorage.removeItem('reg_token');
            navigate('/pending-approval');
        } catch (err: any) {
            const msg = err.response?.data?.detail || 'ลงทะเบียนไม่สำเร็จ กรุณาลองใหม่';
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f0f4f8] flex flex-col items-center justify-center px-4 py-8">
            {/* LINE User Header */}
            <div className="mb-8 text-center">
                <span className="text-[#06c755] font-bold text-lg">LINE</span>
                <span className="text-gray-700 font-medium ml-2">{lineUserName}</span>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 w-full max-w-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                        ลงทะเบียนอาจารย์
                    </h1>
                    <p className="text-gray-400 text-sm">
                        กรุณากรอกข้อมูลส่วนตัวเพื่อยื่นขออนุมัติเข้าใช้งานระบบ
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Row 1: ชื่อ + นามสกุล */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">ชื่อ</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="ระบุชื่อจริง"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4472c4] focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">นามสกุล</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="ระบุนามสกุล"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4472c4] focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                                required
                            />
                        </div>
                    </div>

                    {/* Row 2: สาขา (Dropdown) + อีเมล */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">สาขา</label>
                            <select
                                name="departmentId"
                                value={formData.departmentId}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4472c4] focus:border-transparent transition-all duration-200 text-gray-700 appearance-none cursor-pointer"
                                required
                            >
                                <option value="" disabled>เลือกสาขา</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name_th}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">อีเมล</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@chandra.ac.th"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4472c4] focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                                required
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#2d4a7c] hover:bg-[#243d66] text-white font-bold py-4 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'กำลังลงทะเบียน...' : 'ยืนยันข้อมูล'}
                        </button>
                    </div>
                </form>

                <p className="text-center text-gray-400 text-sm mt-6">
                    ข้อมูลของคุณจะถูกตรวจสอบโดย <span className="text-[#4472c4] font-medium">Admin</span> ก่อนเข้าใช้งานได้
                </p>
            </div>
        </div>
    );
};

export default TeacherRegistrationPage;
