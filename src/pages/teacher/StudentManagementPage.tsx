import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api';

const StudentManagementPage = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/advisor/students').then(res => setStudents(res.data.students || [])).catch(() => {}).finally(() => setLoading(false));
    }, []);

    const filtered = students.filter((s: any) => {
        const name = s.student_name || '';
        return name.includes(searchTerm) || String(s.internship_id).includes(searchTerm);
    });

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold text-[#032B68] mb-8">จัดการนักศึกษา</h1>
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="ค้นหานักศึกษา..." className="w-full pl-12 pr-4 py-3 bg-white rounded-full border border-gray-200 focus:outline-none focus:border-[#4472c4]" />
            </div>
            {loading ? <div className="text-center py-12 text-gray-400">กำลังโหลด...</div> : filtered.length === 0 ? <div className="text-center py-12 text-gray-400">ไม่มีนักศึกษา</div> : (
                <div className="space-y-4">
                    {filtered.map((s: any) => (
                        <div key={s.internship_id} className="bg-white rounded-2xl p-6 shadow-md flex justify-between items-center">
                            <div>
                                <p className="font-bold text-gray-800 text-lg">{s.student_name || `นักศึกษา #${s.internship_id}`}</p>
                                <p className="text-gray-500 text-sm">{s.company_name || '-'}</p>
                            </div>
                            <div className="flex gap-2">
                                <Link to={`/teacher/verify/${s.internship_id}/daily`} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-bold hover:bg-blue-100">ตรวจบันทึก</Link>
                                <Link to={`/teacher/verify/${s.internship_id}/experience`} className="px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-sm font-bold hover:bg-purple-100">ตรวจประสบการณ์</Link>
                                <Link to={`/teacher/evaluation/${s.internship_id}`} className="px-4 py-2 bg-green-50 text-green-600 rounded-full text-sm font-bold hover:bg-green-100">ประเมิน</Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentManagementPage;
