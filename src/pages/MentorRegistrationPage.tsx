import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api';

const MentorRegistrationPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';
    const name = searchParams.get('name') || 'ผู้ใช้งาน';
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [companies, setCompanies] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        companyId: '', position: '',
    });

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await api.get('/master/companies', { params: { per_page: 100 } });
                setCompanies(res.data.companies || res.data || []);
            } catch {}
        };
        fetchCompanies();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.companyId) {
            setError('กรุณาเลือกสถานประกอบการ');
            return;
        }
        setError('');
        setLoading(true);
        try {
            await api.post('/auth/register/supervisor', null, {
                params: {
                    token,
                    first_name_th: formData.firstName,
                    last_name_th: formData.lastName,
                    email: formData.email,
                    phone: formData.phone || undefined,
                    company_id: Number(formData.companyId),
                    position: formData.position || undefined,
                }
            });
            navigate('/pending-approval');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'เกิดข้อผิดพลาด');
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-[#f0f4f8] flex flex-col items-center justify-center px-4 py-8">
            <div className="mb-8 text-center">
                <span className="text-[#06c755] font-bold text-lg">LINE</span>
                <span className="text-gray-700 font-medium ml-2">{decodeURIComponent(name)}</span>
            </div>
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 w-full max-w-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">ลงทะเบียนพี่เลี้ยง</h1>
                    <p className="text-gray-400 text-sm">กรุณากรอกข้อมูลส่วนตัวเพื่อยื่นขออนุมัติเข้าใช้งานระบบ</p>
                </div>
                {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">ชื่อ</label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="ระบุชื่อจริง" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4472c4] focus:border-transparent text-gray-700 placeholder-gray-400" required />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">นามสกุล</label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="ระบุนามสกุล" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4472c4] focus:border-transparent text-gray-700 placeholder-gray-400" required />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">สถานประกอบการ <span className="text-red-500">*</span></label>
                        <select name="companyId" value={formData.companyId} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4472c4] focus:border-transparent text-gray-700 appearance-none cursor-pointer" required>
                            <option value="">-- เลือกสถานประกอบการ --</option>
                            {companies.map((c: any) => (
                                <option key={c.id} value={c.id}>{c.name_th || c.name_en}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">ตำแหน่ง</label>
                            <input type="text" name="position" value={formData.position} onChange={handleChange} placeholder="เช่น หัวหน้าแผนก IT" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4472c4] focus:border-transparent text-gray-700 placeholder-gray-400" />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">อีเมล</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@gmail.com" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4472c4] focus:border-transparent text-gray-700 placeholder-gray-400" required />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">เบอร์โทร</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="0812345678" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4472c4] focus:border-transparent text-gray-700 placeholder-gray-400" />
                    </div>

                    <div className="pt-4">
                        <button type="submit" disabled={loading} className="w-full bg-[#2d4a7c] hover:bg-[#243d66] disabled:bg-gray-400 text-white font-bold py-4 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl text-lg">
                            {loading ? 'กำลังส่งข้อมูล...' : 'ยืนยันข้อมูล'}
                        </button>
                    </div>
                </form>
                <p className="text-center text-gray-400 text-sm mt-6">ข้อมูลของคุณจะถูกตรวจสอบโดย <span className="text-[#4472c4] font-medium">Admin</span> ก่อนเข้าใช้งานได้</p>
            </div>
        </div>
    );
};

export default MentorRegistrationPage;
