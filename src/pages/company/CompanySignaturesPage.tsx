import { useState, useEffect } from 'react';
import { Search, UserPlus, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import api from '../../api';

const CompanySignaturesPage = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // Modal state
    const [showAddModal, setShowAddModal] = useState(false);
    const [unassigned, setUnassigned] = useState<any[]>([]);
    const [loadingUnassigned, setLoadingUnassigned] = useState(false);
    const [assigning, setAssigning] = useState<number | null>(null);

    const fetchStudents = async () => {
        try {
            const res = await api.get('/supervisor/students');
            setStudents(res.data.students || []);
        } catch {}
        finally { setLoading(false); }
    };

    useEffect(() => { fetchStudents(); }, []);

    const fetchUnassigned = async () => {
        setLoadingUnassigned(true);
        try {
            const { data } = await api.get('/supervisor/unassigned-students');
            setUnassigned(data.students || []);
        } catch {}
        finally { setLoadingUnassigned(false); }
    };

    const handleOpenAddModal = () => {
        setShowAddModal(true);
        fetchUnassigned();
    };

    const handleAssign = async (internshipId: number) => {
        setAssigning(internshipId);
        try {
            await api.post('/supervisor/assign-student', null, { params: { internship_id: internshipId } });
            await fetchUnassigned();
            await fetchStudents();
        } catch (err: any) {
            alert(err.response?.data?.detail || 'ไม่สามารถเพิ่มนักศึกษาได้');
        } finally { setAssigning(null); }
    };

    const filtered = students.filter((s: any) =>
        (s.full_name || '').includes(searchTerm) ||
        (s.student_code || '').includes(searchTerm)
    );

    return (
        <div className="p-4 md:p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-[#032B68]">ลงนาม / ตรวจสอบ</h1>
                <button
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#5DC139] hover:bg-[#4ea82e] text-white font-bold rounded-xl shadow-md transition-all active:scale-95"
                >
                    <UserPlus size={18} />
                    เพิ่มนักศึกษา
                </button>
            </div>

            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="ค้นหานักศึกษา..." className="w-full pl-12 pr-4 py-3 bg-white rounded-full border border-gray-200 focus:outline-none focus:border-[#4472c4]" />
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-400">กำลังโหลด...</div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    {students.length === 0 ? 'ยังไม่มีนักศึกษา กดปุ่ม "เพิ่มนักศึกษา" เพื่อเลือกนักศึกษาที่ฝึกในบริษัทเดียวกัน' : 'ไม่พบนักศึกษาที่ค้นหา'}
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map((s: any) => (
                        <NavLink key={s.internship_id} to={`/company/signatures/${s.internship_id}`} className="block bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
                            <p className="font-bold text-gray-800 text-lg">{s.student_code} {s.full_name}</p>
                            <p className="text-gray-500 text-sm mt-1">
                                {s.completed_hours}/{s.required_hours} ชม.
                                {s.start_date && ` • เริ่ม ${new Date(s.start_date).toLocaleDateString('th-TH')}`}
                                {' • '}คลิกเพื่อตรวจบันทึก / ประสบการณ์ / เข้างาน
                            </p>
                        </NavLink>
                    ))}
                </div>
            )}

            {/* ===== Modal เพิ่มนักศึกษา ===== */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="bg-gradient-to-r from-[#4472c4] to-[#032B68] px-8 py-6 text-white flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold">เพิ่มนักศึกษาที่ดูแล</h2>
                                <p className="text-white/70 text-sm mt-1">แสดงเฉพาะนักศึกษาที่ฝึกในบริษัทเดียวกัน</p>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/20 rounded-xl">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            {loadingUnassigned ? (
                                <div className="text-center py-12 text-gray-400">กำลังโหลดรายชื่อ...</div>
                            ) : unassigned.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <UserPlus size={28} className="text-green-500" />
                                    </div>
                                    <p className="text-gray-500 font-medium">ไม่มีนักศึกษาที่รอเพิ่ม</p>
                                    <p className="text-gray-400 text-sm mt-1">นักศึกษาในบริษัทนี้มีพี่เลี้ยงดูแลครบแล้ว</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {unassigned.map((s: any) => (
                                        <div key={s.internship_id} className="flex items-center justify-between p-5 bg-gray-50 hover:bg-blue-50/50 rounded-2xl border border-gray-100 transition-colors">
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-lg">{s.student_code} {s.full_name}</h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {s.email || '-'}
                                                    {s.start_date && ` • เริ่ม ${new Date(s.start_date).toLocaleDateString('th-TH')}`}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleAssign(s.internship_id)}
                                                disabled={assigning === s.internship_id}
                                                className="px-5 py-2.5 bg-[#4472c4] hover:bg-[#365fa3] text-white font-bold rounded-xl shadow-sm transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                                            >
                                                <UserPlus size={16} />
                                                {assigning === s.internship_id ? 'กำลังเพิ่ม...' : 'เลือก'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanySignaturesPage;
