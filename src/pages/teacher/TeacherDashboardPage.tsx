import { useState, useEffect } from 'react';
import { User, Building2, FileText, CheckCircle2 } from 'lucide-react';
import api from '../../api';

const TeacherDashboardPage = () => {
    const [dashboard, setDashboard] = useState<any>(null);
    const [students, setStudents] = useState<any[]>([]);
    const [visitSchedules, setVisitSchedules] = useState<any[]>([]);
    const [evaluations, setEvaluations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dashRes, studRes, schedRes, evalRes] = await Promise.all([
                    api.get('/advisor/dashboard'),
                    api.get('/advisor/students'),
                    api.get('/advisor/visit-schedules'),
                    api.get('/advisor/evaluations'),
                ]);
                setDashboard(dashRes.data);
                setStudents(studRes.data.students || []);
                setVisitSchedules(schedRes.data.schedules || []);
                setEvaluations(evalRes.data.evaluations || []);
            } catch (err) {
                console.error('Failed to fetch dashboard:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const evaluatedCount = evaluations.length;
    const notEvaluatedCount = students.length - evaluatedCount;

    const stats = [
        { label: "จำนวนนักศึกษา", value: dashboard?.total_students ?? '-', icon: User, color: "bg-[#032B68] text-white" },
        { label: "อยู่ระหว่างฝึก", value: students.length, icon: Building2, color: "bg-[#FBC02D] text-white" },
        { label: "ยังไม่ประเมิน", value: notEvaluatedCount, icon: FileText, color: "bg-[#FBC02D] text-white" },
        { label: "ประเมินครบแล้ว", value: evaluatedCount, icon: CheckCircle2, color: "bg-[#4472c4] text-white" },
    ];

    // Build activities from visit schedules — นับครั้งอัตโนมัติต่อนักศึกษา (สูงสุด 3 ครั้ง)
    const activities = students.map((s) => {
        const studentSchedules = visitSchedules
            .filter(v => v.internship_id === s.internship_id)
            .sort((a: any, b: any) => {
                const dateA = a.scheduled_date ? new Date(a.scheduled_date).getTime() : 0;
                const dateB = b.scheduled_date ? new Date(b.scheduled_date).getTime() : 0;
                return dateA - dateB;
            })
            .slice(0, 3); // จำกัด 3 ครั้งต่อนักศึกษา

        return {
            studentId: s.student_code,
            name: s.full_name,
            events: studentSchedules.map((v: any, idx: number) => ({
                title: `นิเทศ ครั้งที่ ${idx + 1}`,
                date: v.scheduled_date ? new Date(v.scheduled_date).toLocaleDateString('th-TH') : '-',
            })),
        };
    }).filter(a => a.events.length > 0);

    // Pending tasks: students not yet evaluated
    const evaluatedInternshipIds = new Set(evaluations.map((e: any) => e.internship_id));
    const pendingTasks = students
        .filter(s => !evaluatedInternshipIds.has(s.internship_id))
        .map(s => ({
            title: `ยังไม่ได้ประเมินการนิเทศน์นักศึกษา ${s.full_name}`,
            deadline: s.end_date ? `โปรดทำการประเมินก่อนวันที่ ${new Date(s.end_date).toLocaleDateString('th-TH')}` : '',
        }));

    if (loading) {
        return <div className="flex justify-center items-center h-64 text-gray-500">กำลังโหลดข้อมูล...</div>;
    }

    // Calendar Data (current month)
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset = firstDay === 0 ? 6 : firstDay - 1; // Mon=0
    const calendarDays: { day: number | null; active?: boolean }[] = [];
    for (let i = 0; i < offset; i++) calendarDays.push({ day: null });
    for (let d = 1; d <= daysInMonth; d++) {
        calendarDays.push({ day: d, active: d === now.getDate() });
    }

    const monthNames = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-3xl shadow-sm p-4 flex items-center justify-between border border-gray-100">
                        <div className={`p-3 rounded-full ${stat.icon === User || stat.icon === CheckCircle2 ? 'bg-[#032B68]' : 'bg-[#FBC02D]'} text-white`}>
                            <stat.icon size={32} />
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600 font-medium mb-1">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activity Notifications */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800">แจ้งเตือนกิจกรรม</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {activities.length === 0 && (
                            <div className="p-6 text-center text-gray-400">ยังไม่มีตารางนิเทศ</div>
                        )}
                        {activities.map((activity, index) => (
                            <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                                <h3 className="font-bold text-gray-800 mb-2">
                                    {activity.studentId} {activity.name}
                                </h3>
                                <div className="space-y-1">
                                    {activity.events.map((event, idx) => (
                                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-sm text-gray-600">
                                            <span className="font-medium min-w-[120px]">{event.title}</span>
                                            <span className="text-gray-500">{event.date}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Calendar */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">ปฏิทินกิจกรรม</h2>
                            <h2 className="text-xl font-bold text-gray-800">{monthNames[month]} {year + 543}</h2>
                        </div>

                        <div className="grid grid-cols-7 text-center mb-4">
                            {['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'].map(day => (
                                <div key={day} className="text-gray-500 font-medium py-2">{day}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-2 text-center">
                            {calendarDays.map((d, index) => (
                                <div
                                    key={index}
                                    className={`aspect-square flex items-center justify-center rounded-full text-lg font-medium
                                        ${d.active ? 'bg-[#4472c4] text-white shadow-md' : 'text-gray-700 hover:bg-gray-50'}
                                        ${!d.day ? 'invisible' : ''}`}
                                >
                                    {d.day}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pending Tasks */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800">แจ้งเตือนเอกสาร/ประเมินค้างทำ</h2>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {pendingTasks.length === 0 && (
                                <div className="p-6 text-center text-gray-400">ไม่มีรายการค้าง</div>
                            )}
                            {pendingTasks.map((task, index) => (
                                <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                                    <p className="font-bold text-gray-800 mb-1">{task.title}</p>
                                    <p className="text-sm font-bold text-gray-800">{task.deadline}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboardPage;
