import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';

const CompanyVerifyDailyHistoryPage = () => {
    const { studentId } = useParams();
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [reviewingId, setReviewingId] = useState<number | null>(null);

    useEffect(() => { loadLogs(); }, [studentId]);

    const loadLogs = async () => {
        setLoading(true);
        try { const res = await api.get(`/supervisor/daily-logs/${studentId}`); setLogs(res.data.logs || []); } catch {} finally { setLoading(false); }
    };

    const handleReview = async (logId: number) => {
        if (!comment.trim()) return;
        try { await api.post(`/supervisor/daily-logs/${logId}/review`, null, { params: { comment: comment.trim() } }); setComment(''); setReviewingId(null); loadLogs(); } catch {}
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString('th-TH', { weekday: 'short', day: 'numeric', month: 'short' });

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-2xl font-bold text-[#032B68] mb-6">ตรวจบันทึกประจำวัน</h1>
            {loading ? <div className="text-center py-12 text-gray-400">กำลังโหลด...</div> : logs.length === 0 ? <div className="text-center py-12 text-gray-400">ยังไม่มีบันทึก</div> : (
                <div className="space-y-4">
                    {logs.map((log: any) => (
                        <div key={log.id} className="bg-white rounded-2xl p-6 shadow-md">
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-[#4472c4] font-bold">{formatDate(log.log_date)}</span>
                                {log.supervisor_comment ? <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600">ตรวจแล้ว</span> : <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-50 text-yellow-600">รอตรวจ</span>}
                            </div>
                            <p className="text-gray-700 mb-2"><strong>กิจกรรม:</strong> {log.activities}</p>
                            {log.problems && <p className="text-gray-600 text-sm"><strong>ปัญหา:</strong> {log.problems}</p>}
                            {log.supervisor_comment && <p className="text-orange-600 text-sm mt-2"><strong>ความเห็น:</strong> {log.supervisor_comment}</p>}
                            {!log.supervisor_comment && (
                                reviewingId === log.id ? (
                                    <div className="mt-3 flex gap-2">
                                        <input value={comment} onChange={e => setComment(e.target.value)} placeholder="ความเห็น..." className="flex-1 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:border-[#4472c4]" />
                                        <button onClick={() => handleReview(log.id)} className="px-4 py-2 bg-[#5cc945] text-white rounded-full font-bold text-sm">บันทึก</button>
                                        <button onClick={() => setReviewingId(null)} className="px-4 py-2 bg-gray-200 text-gray-600 rounded-full font-bold text-sm">ยกเลิก</button>
                                    </div>
                                ) : <button onClick={() => setReviewingId(log.id)} className="mt-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-sm font-bold hover:bg-orange-100">ตรวจ + ให้ความเห็น</button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CompanyVerifyDailyHistoryPage;
