import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../api';

interface AttendanceRecord {
    id: number;
    date: string;
    check_in_time: string | null;
    check_out_time: string | null;
    hours_worked: number | null;
    late_minutes: number | null;
    status_id: number | null;
}

const HistoryPage = () => {
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [leaves, setLeaves] = useState<any[]>([]);
    const [offsites, setOffsites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => { loadRecords(); loadLeaveAndOffsite(); }, [selectedMonth, selectedYear]);

    const loadRecords = async () => {
        setLoading(true);
        try {
            const res = await api.get('/student/attendance', { params: { month: selectedMonth, year: selectedYear } });
            setRecords(res.data.records || []);
        } catch {} finally { setLoading(false); }
    };

    const loadLeaveAndOffsite = async () => {
        try {
            const [leaveRes, offsiteRes] = await Promise.all([
                api.get('/student/leave-requests').catch(() => ({ data: { requests: [] } })),
                api.get('/student/off-site-requests').catch(() => ({ data: { requests: [] } })),
            ]);
            setLeaves(leaveRes.data.requests || []);
            setOffsites(offsiteRes.data.requests || []);
        } catch {}
    };

    const getDayName = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('th-TH', { weekday: 'short' });
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
    };

    const getStatus = (r: AttendanceRecord) => {
        if (!r.check_in_time) return { label: 'ขาด', color: 'text-red-500 bg-red-50' };
        if (r.late_minutes && r.late_minutes > 0) return { label: 'มาสาย', color: 'text-yellow-600 bg-yellow-50' };
        return { label: 'ปกติ', color: 'text-green-600 bg-green-50' };
    };

    const months = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];

    return (
        <div className="flex items-center justify-center">
            <div className="bg-white rounded-[2.5rem] p-6 md:p-12 w-full max-w-7xl shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/time-attendance" className="text-[#4472c4] hover:bg-blue-50 p-2 rounded-full"><ArrowLeft size={24} /></Link>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">ประวัติการเข้างาน</h1>
                </div>

                <div className="flex gap-4 mb-8">
                    <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} className="bg-blue-50 text-blue-900 font-bold py-2 px-4 rounded-full border-none">
                        {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                    </select>
                    <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="bg-blue-50 text-blue-900 font-bold py-2 px-4 rounded-full border-none">
                        {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y + 543}</option>)}
                    </select>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-gray-400">กำลังโหลด...</div>
                ) : records.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">ไม่มีข้อมูลเดือนนี้</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-100">
                                    <th className="text-left py-4 px-4 text-gray-500 font-bold">วันที่</th>
                                    <th className="text-left py-4 px-4 text-gray-500 font-bold">วัน</th>
                                    <th className="text-center py-4 px-4 text-gray-500 font-bold">เข้า</th>
                                    <th className="text-center py-4 px-4 text-gray-500 font-bold">ออก</th>
                                    <th className="text-center py-4 px-4 text-gray-500 font-bold">ชั่วโมง</th>
                                    <th className="text-center py-4 px-4 text-gray-500 font-bold">สถานะ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((r) => {
                                    const status = getStatus(r);
                                    return (
                                        <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                            <td className="py-4 px-4 font-medium text-gray-700">{formatDate(r.date)}</td>
                                            <td className="py-4 px-4 text-gray-500">{getDayName(r.date)}</td>
                                            <td className="py-4 px-4 text-center font-mono text-gray-700">{r.check_in_time || '-'}</td>
                                            <td className="py-4 px-4 text-center font-mono text-gray-700">{r.check_out_time || '-'}</td>
                                            <td className="py-4 px-4 text-center font-mono text-gray-700">{r.hours_worked ? `${r.hours_worked} ชม.` : '-'}</td>
                                            <td className="py-4 px-4 text-center"><span className={`px-3 py-1 rounded-full text-sm font-bold ${status.color}`}>{status.label}</span></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ประวัติการลา */}
                {leaves.length > 0 && (
                    <div className="mt-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">ประวัติการลา ({leaves.length} รายการ)</h2>
                        <div className="space-y-3">
                            {leaves.map((l: any, i: number) => (
                                <div key={i} className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center border border-gray-100">
                                    <div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold mr-2 ${l.leave_type_id === 1 ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>{l.leave_type_id === 1 ? 'ลากิจ' : 'ลาป่วย'}</span>
                                        <span className="text-gray-700 font-medium">{l.start_date ? new Date(l.start_date).toLocaleDateString('th-TH') : '-'} — {l.end_date ? new Date(l.end_date).toLocaleDateString('th-TH') : '-'}</span>
                                        {l.reason && <p className="text-sm text-gray-500 mt-1">เหตุผล: {l.reason}</p>}
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${l.status === 'approved' ? 'bg-green-100 text-green-700' : l.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{l.status === 'approved' ? 'อนุมัติ' : l.status === 'rejected' ? 'ไม่อนุมัติ' : 'รอตรวจ'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ประวัติปฏิบัติงานนอกสถานที่ */}
                {offsites.length > 0 && (
                    <div className="mt-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">ประวัติปฏิบัติงานนอกสถานที่ ({offsites.length} รายการ)</h2>
                        <div className="space-y-3">
                            {offsites.map((o: any, i: number) => (
                                <div key={i} className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center border border-gray-100">
                                    <div>
                                        <span className="text-gray-700 font-medium">{o.off_site_date ? new Date(o.off_site_date).toLocaleDateString('th-TH') : '-'}</span>
                                        <p className="text-sm text-gray-500">สถานที่: {o.destination || '-'} | เหตุผล: {o.purpose || '-'}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${o.status === 'approved' ? 'bg-green-100 text-green-700' : o.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{o.status === 'approved' ? 'อนุมัติ' : o.status === 'rejected' ? 'ไม่อนุมัติ' : 'รอตรวจ'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;
