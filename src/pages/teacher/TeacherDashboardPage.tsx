import { useState, useEffect } from 'react';
import { User, Building2, FileText, CheckCircle2 } from 'lucide-react';
import api from '../../api';

const TeacherDashboardPage = () => {
    const [dashboard, setDashboard] = useState({ total_students: 0, pending_logs: 0, pending_leaves: 0, completed_evaluations: 0 });
    const [students, setStudents] = useState<any[]>([]);

    useEffect(() => {
        api.get('/advisor/dashboard').then(res => setDashboard(res.data)).catch(() => {});
        api.get('/advisor/students').then(res => setStudents(res.data.students || [])).catch(() => {});
    }, []);

    const stats = [
        { label: "จำนวนนักศึกษา", value: dashboard.total_students, icon: User, color: "bg-[#032B68] text-white" },
        { label: "บันทึกรอตรวจ", value: dashboard.pending_logs, icon: FileText, color: "bg-[#FBC02D] text-white" },
        { label: "คำขอลารออนุมัติ", value: dashboard.pending_leaves, icon: Building2, color: "bg-[#FBC02D] text-white" },
        { label: "ประเมินแล้ว", value: dashboard.completed_evaluations, icon: CheckCircle2, color: "bg-[#4472c4] text-white" },
    ];

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold text-[#032B68] mb-8">แดชบอร์ดอาจารย์นิเทศก์</h1>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((s, i) => (
                    <div key={i} className={`${s.color} rounded-2xl p-5 shadow-md`}>
                        <s.icon size={28} className="mb-3 opacity-80" />
                        <p className="text-3xl font-bold">{s.value}</p>
                        <p className="text-sm opacity-80 mt-1">{s.label}</p>
                    </div>
                ))}
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">นักศึกษาที่ดูแล</h2>
                {students.length === 0 ? <p className="text-gray-400">ยังไม่มีนักศึกษา</p> : (
                    <div className="space-y-3">
                        {students.map((s: any, i: number) => (
                            <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="font-bold text-gray-800">{s.student_name || `นักศึกษา #${s.internship_id}`}</p>
                                    <p className="text-sm text-gray-500">{s.company_name || ''}</p>
                                </div>
                                <span className="text-sm text-[#4472c4] font-bold">{s.status || 'กำลังฝึก'}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherDashboardPage;
