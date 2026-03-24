import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import api from '../../api';

const CompanySignaturesPage = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/supervisor/students').then(res => setStudents(res.data.students || [])).catch(() => {}).finally(() => setLoading(false));
    }, []);

    const filtered = students.filter((s: any) => (s.student_name || '').includes(searchTerm));

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold text-[#032B68] mb-8">ลงนาม / ตรวจสอบ</h1>
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="ค้นหานักศึกษา..." className="w-full pl-12 pr-4 py-3 bg-white rounded-full border border-gray-200 focus:outline-none focus:border-[#4472c4]" />
            </div>
            {loading ? <div className="text-center py-12 text-gray-400">กำลังโหลด...</div> : filtered.length === 0 ? <div className="text-center py-12 text-gray-400">ไม่มีนักศึกษา</div> : (
                <div className="space-y-4">
                    {filtered.map((s: any) => (
                        <NavLink key={s.internship_id} to={`/company/signatures/${s.internship_id}`} className="block bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
                            <p className="font-bold text-gray-800 text-lg">{s.student_name || `นักศึกษา #${s.internship_id}`}</p>
                            <p className="text-gray-500 text-sm mt-1">คลิกเพื่อตรวจบันทึก / ประสบการณ์ / เข้างาน</p>
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CompanySignaturesPage;
