import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api';

const CompanyEvaluationPage = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [evaluations, setEvaluations] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get('/supervisor/students'),
            api.get('/supervisor/evaluations'),
        ]).then(([sRes, eRes]) => {
            setStudents(sRes.data.students || []);
            setEvaluations(eRes.data.evaluations || []);
        }).catch(() => {}).finally(() => setLoading(false));
    }, []);

    const getEvalStatus = (internshipId: number) => evaluations.some((e: any) => e.internship_id === internshipId);
    const filtered = students.filter((s: any) => (s.student_name || '').includes(searchTerm));

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold text-[#032B68] mb-8">ประเมินนักศึกษา</h1>
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="ค้นหานักศึกษา..." className="w-full pl-12 pr-4 py-3 bg-white rounded-full border border-gray-200 focus:outline-none focus:border-[#4472c4]" />
            </div>
            {loading ? <div className="text-center py-12 text-gray-400">กำลังโหลด...</div> : (
                <div className="space-y-4">
                    {filtered.map((s: any) => {
                        const evaluated = getEvalStatus(s.internship_id);
                        return (
                            <div key={s.internship_id} className="bg-white rounded-2xl p-6 shadow-md flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-gray-800">{s.student_name || `นักศึกษา #${s.internship_id}`}</p>
                                    {evaluated ? <span className="text-green-600 text-sm font-bold">ประเมินแล้ว</span> : <span className="text-yellow-600 text-sm font-bold">ยังไม่ได้ประเมิน</span>}
                                </div>
                                <Link to={`/company/evaluation/${s.internship_id}`} className={`px-4 py-2 rounded-full font-bold text-sm ${evaluated ? 'bg-gray-100 text-gray-600' : 'bg-[#4472c4] text-white hover:bg-[#3561b3]'}`}>
                                    {evaluated ? 'ดูผลประเมิน' : 'ประเมิน'}
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CompanyEvaluationPage;
