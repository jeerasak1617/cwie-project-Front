import { useState, useEffect } from 'react';
import { PenTool, CheckCircle2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import api from '../../api';

const CompanyVerifyAttendanceHistoryPage = () => {
    const { studentId } = useParams(); // internship_id
    const [records, setRecords] = useState<any[]>([]);
    const [isSigned, setIsSigned] = useState(false);
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

    const handleApprove = async (recordId: number) => {
        try {
            await api.post(`/supervisor/attendance/${recordId}/approve`);
            setRecords(prev => prev.map(r => r.id === recordId ? { ...r, status_id: 2 } : r));
        } catch (err: any) {
            alert(err.response?.data?.detail || 'ไม่สามารถอนุมัติได้');
        }
    };

    const handleBatchApprove = async () => {
        const pending = records.filter(r => r.status_id !== 2).map(r => r.id);
        if (pending.length === 0) return;
        try {
            await api.post('/supervisor/attendance/batch-approve', { record_ids: pending });
            setRecords(prev => prev.map(r => ({ ...r, status_id: 2 })));
            alert(`อนุมัติ ${pending.length} รายการสำเร็จ`);
        } catch (err: any) {
            alert(err.response?.data?.detail || 'ไม่สามารถอนุมัติได้');
        }
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
    const getDayName = (d: string) => ['อา','จ','อ','พ','พฤ','ศ','ส'][new Date(d).getDay()];

    const summary = {
        total: records.length,
        approved: records.filter(r => r.status_id === 2).length,
        totalHours: records.reduce((sum, r) => sum + (r.hours_worked || 0), 0),
    };

    if (loading) return <div className="flex justify-center items-center h-64 text-gray-500">กำลังโหลด...</div>;

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">ประวัติการเข้างาน</h1>
                    <p className="text-gray-400">Internship #{studentId} • {summary.total} วัน • {summary.totalHours.toFixed(1)} ชม.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleBatchApprove} className="px-6 py-3 bg-[#4472c4] text-white font-bold rounded-xl hover:bg-[#365fa3] transition-colors">
                        อนุมัติทั้งหมด ({summary.total - summary.approved})
                    </button>
                    <button onClick={() => setIsSigned(!isSigned)}
                        className={`border rounded-2xl px-5 py-3 flex gap-2 items-center transition-all ${isSigned ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                        {isSigned ? <CheckCircle2 size={18} className="text-green-600" /> : <PenTool size={18} className="text-orange-500" />}
                        <span className="font-bold text-sm">{isSigned ? 'ลงนามแล้ว' : 'ลงลายเซ็น'}</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse bg-[#f8fafc] rounded-2xl overflow-hidden">
                    <thead>
                        <tr className="text-left text-gray-600 font-bold border-b border-gray-200">
                            <th className="py-5 pl-6">วันที่</th>
                            <th className="py-5">เข้า</th>
                            <th className="py-5">ออก</th>
                            <th className="py-5">ชั่วโมง</th>
                            <th className="py-5">สาย (นาที)</th>
                            <th className="py-5">สถานะ</th>
                            <th className="py-5 text-center">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {records.length === 0 ? (
                            <tr><td colSpan={7} className="py-8 text-center text-gray-400">ไม่มีข้อมูล</td></tr>
                        ) : records.map(r => (
                            <tr key={r.id} className="hover:bg-gray-50">
                                <td className="py-5 pl-6"><span className="font-bold">{formatDate(r.date)}</span> <span className="text-gray-400 text-sm">({getDayName(r.date)})</span></td>
                                <td className="py-5 text-gray-700">{r.check_in_time || '-'}</td>
                                <td className="py-5 text-gray-700">{r.check_out_time || '-'}</td>
                                <td className="py-5 font-medium">{r.hours_worked?.toFixed(1) || '-'}</td>
                                <td className="py-5">{r.late_minutes ? <span className="text-red-500 font-bold">{r.late_minutes}</span> : <span className="text-gray-400">0</span>}</td>
                                <td className="py-5">{r.status_id === 2 ? <span className="text-green-600 font-bold text-sm">อนุมัติ</span> : <span className="text-orange-500 font-bold text-sm">รอ</span>}</td>
                                <td className="py-5 text-center">
                                    {r.status_id !== 2 && (
                                        <button onClick={() => handleApprove(r.id)} className="px-4 py-1.5 bg-green-50 text-green-700 font-bold text-xs rounded-lg hover:bg-green-100">อนุมัติ</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CompanyVerifyAttendanceHistoryPage;
