import { useState, useEffect } from 'react';
import { User, Building2, FileText, CheckCircle2 } from 'lucide-react';
import api from '../../api';

const CompanyDashboardPage = () => {
    const [dashboard, setDashboard] = useState<any>(null);
    const [students, setStudents] = useState<any[]>([]);
    const [evaluations, setEvaluations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dashRes, studRes, evalRes] = await Promise.all([
                    api.get('/supervisor/dashboard'),
                    api.get('/supervisor/students'),
                    api.get('/supervisor/evaluations'),
                ]);
                setDashboard(dashRes.data);
                setStudents(studRes.data.students || []);
                setEvaluations(evalRes.data.evaluations || []);
            } catch (err) {
                console.error('Failed to fetch:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const evaluatedSet = new Set(evaluations.map((e: any) => e.internship_id));
    const evaluatedCount = evaluations.length;
    const notEvaluated = students.filter(s => !evaluatedSet.has(s.internship_id));

    const stats = [
        { label: "จำนวนนักศึกษา", value: dashboard?.total_students ?? '-', icon: User, color: "bg-[#032B68]" },
        { label: "อยู่ระหว่างฝึก", value: students.length, icon: Building2, color: "bg-[#FBC02D]" },
        { label: "ยังไม่ประเมิน", value: notEvaluated.length, icon: FileText, color: "bg-[#FBC02D]" },
        { label: "ประเมินครบแล้ว", value: evaluatedCount, icon: CheckCircle2, color: "bg-[#4472c4]" },
    ];

    const pendingTasks = notEvaluated.map(s => ({
        title: `ยังไม่ได้ประเมิน ${s.full_name}`,
        deadline: s.end_date ? `โปรดทำการประเมินก่อนวันที่ ${new Date(s.end_date).toLocaleDateString('th-TH')}` : '',
    }));

    if (loading) {
        return <div className="flex justify-center items-center h-64 text-gray-500">กำลังโหลดข้อมูล...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-3xl shadow-sm p-4 flex items-center justify-between border border-gray-100">
                        <div className={`p-3 rounded-full ${stat.color} text-white`}><stat.icon size={32} /></div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600 font-medium mb-1">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activities */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100"><h2 className="text-xl font-bold text-gray-800">นักศึกษาที่ดูแล</h2></div>
                    <div className="divide-y divide-gray-100">
                        {students.length === 0 && <div className="p-6 text-center text-gray-400">ไม่มีนักศึกษา</div>}
                        {students.map((s, i) => (
                            <div key={i} className="p-6 hover:bg-gray-50 transition-colors">
                                <h3 className="font-bold text-gray-800">{s.student_code} {s.full_name}</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {evaluatedSet.has(s.internship_id) ? '✅ ประเมินแล้ว' : '⏳ ยังไม่ได้ประเมิน'}
                                    {' • '}{s.completed_hours}/{s.required_hours} ชม.
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pending */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100"><h2 className="text-xl font-bold text-gray-800">แจ้งเตือนประเมินค้าง</h2></div>
                    <div className="divide-y divide-gray-100">
                        {pendingTasks.length === 0 && <div className="p-6 text-center text-gray-400">ไม่มีรายการค้าง</div>}
                        {pendingTasks.map((task, i) => (
                            <div key={i} className="p-6 hover:bg-gray-50 transition-colors">
                                <p className="font-bold text-gray-800 mb-1">{task.title}</p>
                                <p className="text-sm text-gray-500">{task.deadline}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDashboardPage;
