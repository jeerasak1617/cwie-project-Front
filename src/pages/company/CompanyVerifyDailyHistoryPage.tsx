import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';

const CompanyVerifyDailyHistoryPage = () => {
    const { studentId } = useParams(); // internship_id
    const [logs, setLogs] = useState<any[]>([]);
    const [studentInfo, setStudentInfo] = useState<any>(null);
    const [activeMonth, setActiveMonth] = useState<number>(new Date().getMonth() + 1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [logRes, studentRes] = await Promise.all([
                    api.get(`/supervisor/daily-logs/${studentId}`, { params: { per_page: 100 } }),
                    api.get(`/supervisor/students/${studentId}`).catch(() => ({ data: null })),
                ]);
                setLogs(logRes.data.logs || []);
                setStudentInfo(studentRes.data);
            } catch (err) { console.error(err); }
        };
        fetchData();
    }, [studentId]);

    const filteredLogs = logs.filter(l => new Date(l.log_date).getMonth() + 1 === activeMonth);
    const availableMonths = [...new Set(logs.map(l => new Date(l.log_date).getMonth() + 1))].sort();
    if (availableMonths.length === 0) availableMonths.push(activeMonth);

    const thaiMonths = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];

    const formatDate = (d: string) => new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
    const getDayName = (d: string) => ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'][new Date(d).getDay()];

    const studentName = studentInfo?.student?.full_name || `นักศึกษา #${studentId}`;

    return (
        <div className="flex flex-col h-full">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">ประวัติบันทึกประจำวัน</h1>
                <p className="text-gray-400">ตรวจสอบบันทึกรายวันของนักศึกษา: <span className="text-gray-700 font-bold">{studentName}</span></p>
            </div>

            <div className="flex gap-8 border-b border-gray-100 mb-8 overflow-x-auto">
                {availableMonths.map(m => (
                    <button key={m} onClick={() => setActiveMonth(m)}
                        className={`pb-4 px-2 text-lg font-bold transition-colors relative whitespace-nowrap ${activeMonth === m ? 'text-[#4472c4]' : 'text-gray-400 hover:text-gray-600'}`}>
                        {thaiMonths[m - 1]}
                        {activeMonth === m && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#4472c4] rounded-t-full"></div>}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse bg-[#f8fafc] rounded-2xl overflow-hidden">
                    <thead>
                        <tr className="text-left text-gray-600 font-bold border-b border-gray-200">
                            <th className="py-6 pl-8 w-[25%]">วันที่</th>
                            <th className="py-6 w-[60%]">กิจกรรม</th>
                            <th className="py-6 w-[15%]">ชั่วโมง</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {filteredLogs.length === 0 ? (
                            <tr><td colSpan={3} className="py-8 text-center text-gray-500">ไม่พบข้อมูล</td></tr>
                        ) : filteredLogs.map(row => (
                            <tr key={row.id} className="hover:bg-gray-50">
                                <td className="py-6 pl-8"><div className="font-bold text-gray-800">{formatDate(row.log_date)}</div><div className="text-sm text-gray-500">{getDayName(row.log_date)}</div></td>
                                <td className="py-6 text-gray-800 pr-4">{row.activities || '-'}</td>
                                <td className="py-6 text-gray-600">{row.hours_spent ?? '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CompanyVerifyDailyHistoryPage;
