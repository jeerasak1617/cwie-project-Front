import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';

interface DailyLogRecord {
    id: number;
    log_date: string;
    activities: string;
    problems: string | null;
    hours_spent: number | null;
    supervisor_comment: string | null;
    advisor_comment: string | null;
    status_id: number | null;
}

const DailyLogHistoryPage = () => {
    const [logs, setLogs] = useState<DailyLogRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => { loadLogs(); }, [page]);

    const loadLogs = async () => {
        setLoading(true);
        try {
            const res = await api.get('/student/daily-logs', { params: { page, per_page: 20 } });
            setLogs(res.data.logs || []);
            setTotal(res.data.total || 0);
        } catch {} finally { setLoading(false); }
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('th-TH', { weekday: 'short', day: 'numeric', month: 'short', year: '2-digit' });
    };

    return (
        <div className="flex items-center justify-center">
            <div className="bg-white rounded-[2.5rem] p-6 md:p-12 w-full max-w-[1600px] shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/daily-log" className="text-[#4472c4] hover:bg-blue-50 p-2 rounded-full"><ArrowLeft size={24} /></Link>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">ประวัติบันทึกประจำวัน</h1>
                    <span className="text-gray-400 text-sm">({total} รายการ)</span>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-gray-400">กำลังโหลด...</div>
                ) : logs.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">ยังไม่มีบันทึก</div>
                ) : (
                    <div className="space-y-4">
                        {logs.map((log) => (
                            <div key={log.id} className="bg-[#f8fafc] rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-[#4472c4] font-bold">{formatDate(log.log_date)}</span>
                                    {log.hours_spent && <span className="text-gray-500 text-sm">{log.hours_spent} ชม.</span>}
                                </div>
                                <div className="mb-3">
                                    <p className="text-gray-800 font-medium mb-1">กิจกรรม:</p>
                                    <p className="text-gray-600 text-sm whitespace-pre-wrap">{log.activities}</p>
                                </div>
                                {log.problems && (
                                    <div className="mb-3">
                                        <p className="text-gray-800 font-medium mb-1">ปัญหา:</p>
                                        <p className="text-gray-600 text-sm whitespace-pre-wrap">{log.problems}</p>
                                    </div>
                                )}
                                {log.supervisor_comment && (
                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                        <p className="text-orange-600 font-medium text-sm">ความเห็นพี่เลี้ยง: {log.supervisor_comment}</p>
                                    </div>
                                )}
                                {log.advisor_comment && (
                                    <div className="mt-2">
                                        <p className="text-blue-600 font-medium text-sm">ความเห็นอาจารย์: {log.advisor_comment}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {total > 20 && (
                    <div className="flex justify-center gap-4 mt-8">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-6 py-2 rounded-full border border-gray-300 disabled:opacity-50">ก่อนหน้า</button>
                        <span className="py-2 text-gray-500">หน้า {page}</span>
                        <button onClick={() => setPage(p => p + 1)} disabled={logs.length < 20} className="px-6 py-2 rounded-full border border-gray-300 disabled:opacity-50">ถัดไป</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailyLogHistoryPage;
