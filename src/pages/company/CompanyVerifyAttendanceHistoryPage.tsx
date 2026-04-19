import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';

const CompanyVerifyAttendanceHistoryPage = () => {
    const { studentId } = useParams(); // internship_id
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await api.get(`/supervisor/attendance/${studentId}`);
                setRecords(data.records || []);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchData();
    }, [studentId]);

    const formatDate = (d: string) => new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
    const getDayName = (d: string) => ['อา','จ','อ','พ','พฤ','ศ','ส'][new Date(d).getDay()];

    const summary = {
        total: records.length,
        totalHours: records.reduce((sum, r) => sum + (r.hours_worked || 0), 0),
    };

    if (loading) return <div className="flex justify-center items-center h-64 text-gray-500">กำลังโหลด...</div>;

    return (
        <div className="flex flex-col h-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">ประวัติการเข้างาน</h1>
                <p className="text-gray-400">{summary.total} วัน • {summary.totalHours.toFixed(1)} ชม.</p>
            </div>

            <div className="flex-1 overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse bg-[#f8fafc] rounded-2xl overflow-hidden">
                    <thead>
                        <tr className="text-left text-gray-600 font-bold border-b border-gray-200">
                            <th className="py-5 pl-6">วันที่</th>
                            <th className="py-5">เข้า</th>
                            <th className="py-5">ออก</th>
                            <th className="py-5">ชั่วโมง</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {records.length === 0 ? (
                            <tr><td colSpan={4} className="py-8 text-center text-gray-400">ไม่มีข้อมูล</td></tr>
                        ) : records.map(r => (
                            <tr key={r.id} className="hover:bg-gray-50">
                                <td className="py-5 pl-6"><span className="font-bold">{formatDate(r.date)}</span> <span className="text-gray-400 text-sm">({getDayName(r.date)})</span></td>
                                <td className="py-5 text-gray-700">{r.check_in_time || '-'}</td>
                                <td className="py-5 text-gray-700">{r.check_out_time || '-'}</td>
                                <td className="py-5 font-medium">{r.hours_worked?.toFixed(1) || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CompanyVerifyAttendanceHistoryPage;
