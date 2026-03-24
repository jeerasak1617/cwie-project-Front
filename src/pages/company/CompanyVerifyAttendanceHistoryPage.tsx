import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';

const CompanyVerifyAttendanceHistoryPage = () => {
    const { studentId } = useParams();
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => { loadRecords(); }, [studentId]);

    const loadRecords = async () => {
        setLoading(true);
        try { const res = await api.get(`/supervisor/attendance/${studentId}`); setRecords(res.data.records || []); } catch {} finally { setLoading(false); }
    };

    const handleApprove = async (recordId: number) => {
        try { await api.post(`/supervisor/attendance/${recordId}/approve`); setMessage('อนุมัติสำเร็จ'); loadRecords(); setTimeout(() => setMessage(''), 2000); } catch {}
    };

    const handleBatchApprove = async () => {
        const pendingIds = records.filter(r => r.status_id === null || r.status_id === 0).map(r => r.id);
        if (pendingIds.length === 0) return;
        try { await api.post('/supervisor/attendance/batch-approve', null, { params: { record_ids: pendingIds.join(',') } }); setMessage(`อนุมัติ ${pendingIds.length} รายการสำเร็จ`); loadRecords(); setTimeout(() => setMessage(''), 2000); } catch {}
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString('th-TH', { weekday: 'short', day: 'numeric', month: 'short' });

    return (
        <div className="p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[#032B68]">ตรวจสอบการเข้างาน</h1>
                <button onClick={handleBatchApprove} className="px-4 py-2 bg-[#5cc945] text-white rounded-full font-bold text-sm hover:bg-[#4db83a]">อนุมัติทั้งหมด</button>
            </div>
            {message && <div className="mb-4 p-3 rounded-xl text-center font-bold bg-green-50 text-green-600">{message}</div>}
            {loading ? <div className="text-center py-12 text-gray-400">กำลังโหลด...</div> : records.length === 0 ? <div className="text-center py-12 text-gray-400">ยังไม่มีข้อมูล</div> : (
                <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
                    <table className="w-full">
                        <thead><tr className="border-b-2 border-gray-100">
                            <th className="text-left py-3 px-4 text-gray-500 font-bold">วันที่</th>
                            <th className="text-center py-3 px-4 text-gray-500 font-bold">เข้า</th>
                            <th className="text-center py-3 px-4 text-gray-500 font-bold">ออก</th>
                            <th className="text-center py-3 px-4 text-gray-500 font-bold">ชม.</th>
                            <th className="text-center py-3 px-4 text-gray-500 font-bold">สถานะ</th>
                            <th className="text-center py-3 px-4 text-gray-500 font-bold">จัดการ</th>
                        </tr></thead>
                        <tbody>
                            {records.map((r: any) => (
                                <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                    <td className="py-3 px-4 font-medium text-gray-700">{formatDate(r.date)}</td>
                                    <td className="py-3 px-4 text-center font-mono">{r.check_in_time || '-'}</td>
                                    <td className="py-3 px-4 text-center font-mono">{r.check_out_time || '-'}</td>
                                    <td className="py-3 px-4 text-center">{r.hours_worked || '-'}</td>
                                    <td className="py-3 px-4 text-center">
                                        {r.status_id ? <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600">อนุมัติ</span> : <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-50 text-yellow-600">รอ</span>}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        {!r.status_id && <button onClick={() => handleApprove(r.id)} className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold hover:bg-green-100">อนุมัติ</button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CompanyVerifyAttendanceHistoryPage;
