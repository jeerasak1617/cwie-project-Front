import { useState, useEffect } from 'react';
import { User, PenTool, CheckCircle2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import api from '../../api';

interface DailyLogRecord {
    id: number;
    log_date: string;
    activities: string;
    hours_spent: number | null;
    supervisor_comment: string | null;
    advisor_comment: string | null;
    status_id: number | null;
}

const TeacherVerifyDailyHistoryPage = () => {
    const { studentId } = useParams(); // This is internship_id
    const [logs, setLogs] = useState<DailyLogRecord[]>([]);
    const [studentInfo, setStudentInfo] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSigned, setIsSigned] = useState(false);
    const [activeMonth, setActiveMonth] = useState<number>(new Date().getMonth() + 1);
    const [activeYear] = useState<number>(new Date().getFullYear());

    const thaiMonths = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
    const shortMonths = thaiMonths.map(m => m);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const { data } = await api.get(`/advisor/students/${studentId}`);
                setStudentInfo(data);
            } catch (err) {
                console.error('Failed to fetch student:', err);
            }
        };
        fetchStudent();
    }, [studentId]);

    useEffect(() => {
        const fetchLogs = async () => {
            setIsLoading(true);
            try {
                const { data } = await api.get(`/advisor/daily-logs/${studentId}`, {
                    params: { per_page: 100 }
                });
                setLogs(data.logs || []);
            } catch (err) {
                console.error('Failed to fetch logs:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLogs();
    }, [studentId]);

    // Filter logs by active month
    const filteredLogs = logs.filter(l => {
        const d = new Date(l.log_date);
        return d.getMonth() + 1 === activeMonth && d.getFullYear() === activeYear;
    });

    // Get unique months from logs for tabs
    const availableMonths = [...new Set(logs.map(l => new Date(l.log_date).getMonth() + 1))].sort();
    if (availableMonths.length === 0) availableMonths.push(activeMonth);

    const getDayName = (dateStr: string) => {
        const days = ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'];
        return days[new Date(dateStr).getDay()];
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
    };

    const studentName = studentInfo?.student?.full_name || `นักศึกษา #${studentId}`;
    const studentCode = studentInfo?.student?.student_code || '';

    return (
        <div className="flex flex-col h-full">
            {/* Header Row */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">ประวัติบันทึกประจำวันการฝึกวิชาชีพ</h1>
                    <p className="text-gray-400">แสดงข้อมูลการลงเวลาปฏิบัติงานของนักศึกษา: <span className="text-gray-600 font-bold">{studentName}</span> {studentCode && `(รหัส: ${studentCode})`}</p>
                </div>

                <div className="flex gap-4">
                    {/* Mentor Signature (Read Only) */}
                    <div className="border border-gray-200 rounded-3xl p-5 min-w-[200px] flex gap-3 shadow-md bg-gray-50 opacity-80">
                        <div className="bg-blue-100 p-2.5 rounded-full text-blue-600 h-fit">
                            <User size={24} />
                        </div>
                        <div className="flex-1 min-h-[60px]">
                            <p className="font-bold text-gray-800 text-sm mb-2">ลายเซ็นพี่เลี้ยง</p>
                            <span className="text-xs text-gray-400">ยังไม่มีลายเซ็น</span>
                        </div>
                    </div>

                    {/* Teacher Signature (Actionable) */}
                    <button
                        onClick={() => setIsSigned(!isSigned)}
                        className={`border rounded-3xl p-5 min-w-[200px] flex gap-3 shadow-md transition-all active:scale-95 text-left
                            ${isSigned ? 'bg-green-50 border-green-200 ring-2 ring-green-500/20' : 'bg-white border-gray-200 hover:border-[#4472c4] hover:shadow-lg'}`}
                    >
                        <div className={`p-2.5 rounded-full h-fit transition-colors ${isSigned ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-500'}`}>
                            {isSigned ? <CheckCircle2 size={24} /> : <PenTool size={24} />}
                        </div>
                        <div className="flex-1 min-h-[60px]">
                            <p className="font-bold text-gray-800 text-sm mb-2">อาจารย์นิเทศ</p>
                            {isSigned ? (
                                <div className="animate-in fade-in duration-300">
                                    <p className="text-xs font-bold text-green-600">ลงลายเซ็นแล้ว</p>
                                    <p className="text-[10px] text-green-600/70">{new Date().toLocaleDateString('th-TH')}</p>
                                </div>
                            ) : (
                                <p className="text-xs text-[#4472c4] font-medium">คลิกเพื่อลงลายเซ็น</p>
                            )}
                        </div>
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-gray-100 mb-8 overflow-x-auto">
                {availableMonths.map((m) => (
                    <button
                        key={m}
                        onClick={() => setActiveMonth(m)}
                        className={`pb-4 px-2 text-lg font-bold transition-colors relative whitespace-nowrap ${activeMonth === m ? 'text-[#4472c4]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        {shortMonths[m - 1]}
                        {activeMonth === m && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#4472c4] rounded-t-full"></div>}
                    </button>
                ))}
            </div>

            {/* Content Table */}
            <div className="flex-1 overflow-x-auto">
                <table className="w-full min-w-[1000px] border-collapse bg-[#f8fafc] rounded-2xl overflow-hidden">
                    <thead>
                        <tr className="text-left text-gray-600 font-bold border-b border-gray-200 bg-transparent">
                            <th className="py-6 pl-8 w-[20%]">วันที่บันทึก</th>
                            <th className="py-6 w-[40%]">กิจกรรมประจำวัน</th>
                            <th className="py-6 w-[10%]">ชั่วโมง</th>
                            <th className="py-6 w-[15%]">comment พี่เลี้ยง</th>
                            <th className="py-6 w-[15%]">สถานะ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {isLoading ? (
                            <tr><td colSpan={5} className="py-8 text-center text-gray-500">กำลังโหลดข้อมูล...</td></tr>
                        ) : filteredLogs.length > 0 ? (
                            filteredLogs.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-6 pl-8 align-top">
                                        <div className="font-bold text-gray-800">{formatDate(row.log_date)}</div>
                                        <div className="text-sm text-gray-500 mt-1">{getDayName(row.log_date)}</div>
                                    </td>
                                    <td className="py-6 text-gray-800 align-top pr-4">{row.activities || '-'}</td>
                                    <td className="py-6 text-gray-600 font-medium align-top">{row.hours_spent ?? '-'}</td>
                                    <td className="py-6 text-gray-500 align-top text-sm">{row.supervisor_comment || '-'}</td>
                                    <td className="py-6 align-top">
                                        {row.advisor_comment ? (
                                            <span className="text-sm font-bold text-green-600">ตรวจแล้ว</span>
                                        ) : (
                                            <span className="text-sm font-bold text-orange-500">รอตรวจ</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={5} className="py-8 text-center text-gray-500">ไม่พบข้อมูลบันทึกในเดือนนี้</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeacherVerifyDailyHistoryPage;
