import { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import api from '../../api';

interface Student {
    internship_id: number;
    student_id: number;
    student_code: string;
    full_name: string;
    company_id: number | null;
    completed_hours: number;
    required_hours: number;
    status_id: number | null;
    start_date: string | null;
    end_date: string | null;
    // Computed in frontend
    hasEvaluation?: boolean;
    visitCount?: number;
}

const StudentManagementPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studRes, evalRes, visitRes] = await Promise.all([
                    api.get('/advisor/students'),
                    api.get('/advisor/evaluations'),
                    api.get('/advisor/visit-reports'),
                ]);

                const evaluatedSet = new Set((evalRes.data.evaluations || []).map((e: any) => e.internship_id));
                const visitCounts: Record<number, number> = {};
                (visitRes.data.reports || []).forEach((v: any) => {
                    visitCounts[v.internship_id] = (visitCounts[v.internship_id] || 0) + 1;
                });

                const enriched = (studRes.data.students || []).map((s: any) => ({
                    ...s,
                    hasEvaluation: evaluatedSet.has(s.internship_id),
                    visitCount: visitCounts[s.internship_id] || 0,
                }));

                setStudents(enriched);
            } catch (err) {
                console.error('Failed to fetch students:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filtered = students.filter(s =>
        s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.student_code.includes(searchTerm)
    );

    const notSupervised = students.filter(s => s.visitCount === 0).length;

    if (loading) {
        return <div className="flex justify-center items-center h-64 text-gray-500">กำลังโหลดข้อมูล...</div>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white rounded-[3rem] p-6 md:p-12 w-full max-w-[1600px] shadow-2xl relative flex flex-col min-h-[900px]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">จัดการนักศึกษา</h1>
                        <p className="text-gray-500 text-lg">เลือกชื่อนักศึกษาเพื่อเข้าสู่หน้าบันทึกการนิเทศผลรายบุคคล</p>
                    </div>
                    <div className="bg-blue-50 text-[#032B68] px-8 py-3 rounded-2xl text-base font-bold shadow-sm border border-blue-100 flex items-center gap-2">
                        <span>ทั้งหมด {students.length} คน</span>
                        <div className="w-1 h-1 bg-gray-300 rounded-full mx-2"></div>
                        <span>ยังไม่นิเทศ <span className="text-red-500">{notSupervised} คน</span></span>
                    </div>
                </div>

                <div className="bg-[#f8fafc] rounded-3xl p-6 md:p-8 mb-8 md:mb-10">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="relative flex-1 w-full">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-6 w-6 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 text-lg shadow-sm"
                                placeholder="ค้นหาชื่อนักศึกษา หรือ รหัสนักศึกษา"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="relative min-w-[240px] w-full md:w-auto">
                            <button className="w-full flex items-center justify-between px-6 py-4 border border-gray-200 rounded-2xl bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 font-bold text-lg shadow-sm">
                                สถานะทั้งหมด
                                <ChevronDown className="h-5 w-5 text-gray-400 ml-2" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {filtered.length === 0 && (
                        <div className="text-center py-12 text-gray-400">ไม่พบนักศึกษา</div>
                    )}
                    {filtered.map((student) => {
                        const hasVisit = (student.visitCount ?? 0) > 0;
                        const hasEval = student.hasEvaluation;
                        return (
                            <div key={student.internship_id} className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] transition-all duration-300 border border-gray-100 p-8 cursor-pointer group">
                                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-2">
                                            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#032B68] transition-colors">
                                                {student.student_code} {student.full_name}
                                            </h3>
                                        </div>
                                        <div className="text-base text-gray-600 space-y-1 font-medium">
                                            <p>ชั่วโมงสะสม: {student.completed_hours}/{student.required_hours} ชม.</p>
                                            {student.start_date && <p className="text-gray-500">เริ่ม: {new Date(student.start_date).toLocaleDateString('th-TH')} - {student.end_date ? new Date(student.end_date).toLocaleDateString('th-TH') : '-'}</p>}
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-8 w-full xl:w-auto">
                                        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                                            <div className="flex items-center gap-6 text-base font-bold">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-3 h-3 rounded-full ${hasVisit ? 'bg-green-500' : 'bg-gray-200'}`} />
                                                    <span className={hasVisit ? 'text-[#032B68]' : 'text-gray-400'}>นิเทศ</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-3 h-3 rounded-full ${hasVisit ? 'bg-green-500' : 'bg-gray-200'}`} />
                                                    <span className={hasVisit ? 'text-[#032B68]' : 'text-gray-400'}>ลายเซ็น</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-3 h-3 rounded-full ${hasEval ? 'bg-green-500' : 'bg-gray-200'}`} />
                                                    <span className={hasEval ? 'text-[#032B68]' : 'text-gray-400'}>ประเมิน</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-500 text-right">
                                                {student.visitCount === 0 && "ยังไม่ได้เริ่มการนิเทศครั้งแรก"}
                                                {student.visitCount! > 0 && student.visitCount! < 3 && `นิเทศครั้งที่ ${student.visitCount} รอนิเทศอีก ${3 - student.visitCount!} ครั้ง`}
                                                {student.visitCount! >= 3 && "ครบการนิเทศ 3 ครั้ง"}
                                            </p>
                                        </div>

                                        <div className="flex flex-row gap-3 w-full md:w-auto">
                                            <button
                                                onClick={() => window.location.href = `/teacher/supervision/${student.internship_id}`}
                                                className="flex-1 md:flex-none px-6 py-2.5 bg-[#FFC107] hover:bg-[#FFD54F] text-white text-sm font-bold rounded-xl shadow-sm transition-transform active:scale-95 min-w-[90px]"
                                            >
                                                นิเทศ
                                            </button>
                                            <button
                                                onClick={() => window.location.href = `/teacher/verify/${student.internship_id}/daily`}
                                                className="flex-1 md:flex-none px-6 py-2.5 bg-[#4472C4] hover:bg-[#5C8AE6] text-white text-sm font-bold rounded-xl shadow-sm transition-transform active:scale-95 min-w-[90px]"
                                            >
                                                ลายเซ็น
                                            </button>
                                            <button
                                                onClick={() => window.location.href = `/teacher/evaluation/${student.internship_id}`}
                                                className="flex-1 md:flex-none px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-[#4472C4] text-sm font-bold rounded-xl shadow-sm transition-transform active:scale-95 min-w-[90px]"
                                            >
                                                ประเมิน
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default StudentManagementPage;
