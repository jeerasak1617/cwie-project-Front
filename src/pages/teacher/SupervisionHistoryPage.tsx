import { useState, useEffect } from 'react';
import { Video, MapPin, Clock, Edit3, ArrowRight } from 'lucide-react';
import api from '../../api';

const SupervisionHistoryPage = () => {
    const [schedules, setSchedules] = useState<any[]>([]);
    const [reports, setReports] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [schedRes, reportRes, studRes] = await Promise.all([
                    api.get('/advisor/visit-schedules'),
                    api.get('/advisor/visit-reports'),
                    api.get('/advisor/students'),
                ]);
                setSchedules(schedRes.data.schedules || []);
                setReports(reportRes.data.reports || []);
                setStudents(studRes.data.students || []);
            } catch (err) {
                console.error('Failed to fetch:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Build student name lookup
    const studentMap: Record<number, string> = {};
    students.forEach(s => { studentMap[s.internship_id] = s.full_name; });

    // Combine schedules and reports into a history list
    // นับครั้งที่นิเทศต่อนักศึกษาอัตโนมัติ (เรียงตามวันที่ สูงสุด 3 ครั้งต่อนักศึกษา)
    const sortedSchedules = [...schedules].sort((a, b) => {
        const dateA = a.scheduled_date ? new Date(a.scheduled_date).getTime() : 0;
        const dateB = b.scheduled_date ? new Date(b.scheduled_date).getTime() : 0;
        return dateA - dateB;
    });

    const visitCountPerStudent: Record<number, number> = {};
    const historyData = sortedSchedules
        .map(s => {
            const internId = s.internship_id;
            if (!visitCountPerStudent[internId]) visitCountPerStudent[internId] = 0;
            visitCountPerStudent[internId]++;
            const visitNum = visitCountPerStudent[internId];

            // จำกัด 3 ครั้งต่อนักศึกษา
            if (visitNum > 3) return null;

            return {
                id: s.id,
                date: s.scheduled_date ? new Date(s.scheduled_date).toLocaleDateString('th-TH') : '-',
                time: s.scheduled_time || '-',
                format: 'ออนไลน์',
                student: studentMap[s.internship_id] || `Internship #${s.internship_id}`,
                internship_id: s.internship_id,
                canEdit: s.status_id !== 3,
                visitNumber: visitNum,
            };
        })
        .filter(Boolean)
        .reverse(); // แสดงล่าสุดก่อน

    const getFormatBadge = (format: string) => {
        if (format === 'ออนไลน์') {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                    <Video size={14} /> {format}
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600 border border-green-100">
                <MapPin size={14} /> {format}
            </span>
        );
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64 text-gray-500">กำลังโหลดข้อมูล...</div>;
    }

    return (
        <div className="flex items-center justify-center py-8 px-4">
            <div className="bg-white rounded-[2rem] p-8 md:p-12 w-full max-w-6xl shadow-xl shadow-blue-900/5 border border-white/50 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 pb-6 border-b border-gray-100 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">ประวัติการนิเทศ</h1>
                        <p className="text-gray-500 font-medium">รายการนัดหมายและบันทึกการนิเทศทั้งหมด ({historyData.length} รายการ)</p>
                    </div>
                </div>

                <div className="hidden md:grid grid-cols-12 gap-6 px-6 mb-4 text-gray-400 font-medium text-sm">
                    <div className="col-span-3">วัน - เวลา</div>
                    <div className="col-span-2 text-center">ครั้งที่</div>
                    <div className="col-span-4">ชื่อนักศึกษา</div>
                    <div className="col-span-3 text-right">ดำเนินการ</div>
                </div>

                <div className="space-y-4">
                    {historyData.length === 0 && (
                        <div className="text-center py-12 text-gray-400">ยังไม่มีประวัติการนิเทศ</div>
                    )}
                    {historyData.map((item) => (
                        <div key={item.id} className="group relative grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 bg-white border border-gray-100 rounded-2xl md:rounded-full items-center transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/5 hover:border-blue-100 hover:-translate-y-0.5">
                            <div className="col-span-1 md:col-span-3 flex items-center gap-3">
                                <div className="flex flex-row items-center gap-3">
                                    <span className="font-bold text-gray-900">{item.date}</span>
                                    <div className="flex items-center gap-1 text-sm text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded-md">
                                        <Clock size={12} /> {item.time} น.
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-1 md:col-span-2 flex md:justify-center">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                                    ครั้งที่ {item.visitNumber}
                                </span>
                            </div>
                            <div className="col-span-1 md:col-span-4 font-bold text-gray-800 text-lg md:text-base">
                                {item.student}
                            </div>
                            <div className="col-span-1 md:col-span-3 flex justify-end gap-2 mt-2 md:mt-0 opacity-80 group-hover:opacity-100 transition-opacity">
                                {item.canEdit && (
                                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-50 text-orange-600 hover:bg-orange-100 hover:text-orange-700 transition-colors" title="แก้ไข">
                                        <Edit3 size={18} />
                                    </button>
                                )}
                                <button
                                    onClick={() => window.location.href = `/teacher/supervision/${item.internship_id}`}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                    title="ดูรายละเอียด"
                                >
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SupervisionHistoryPage;
