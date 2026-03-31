import { useState, useEffect } from 'react';
import { Clock, Edit3, ArrowRight, X, Save } from 'lucide-react';
import api from '../../api';

const SupervisionHistoryPage = () => {
    const [schedules, setSchedules] = useState<any[]>([]);
    const [reports, setReports] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Edit modal state
    const [editingItem, setEditingItem] = useState<any>(null);
    const [editDate, setEditDate] = useState('');
    const [editTime, setEditTime] = useState('');
    const [editNotes, setEditNotes] = useState('');
    const [saving, setSaving] = useState(false);

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

    useEffect(() => { fetchData(); }, []);

    // Build student name lookup
    const studentMap: Record<number, string> = {};
    students.forEach(s => { studentMap[s.internship_id] = s.full_name; });

    // Combine schedules into history with visit numbers
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
            if (visitNum > 3) return null;

            return {
                id: s.id,
                date: s.scheduled_date ? new Date(s.scheduled_date).toLocaleDateString('th-TH') : '-',
                rawDate: s.scheduled_date || '',
                time: s.scheduled_time || '-',
                student: studentMap[s.internship_id] || `Internship #${s.internship_id}`,
                internship_id: s.internship_id,
                canEdit: true,
                visitNumber: visitNum,
                notes: s.notes || '',
            };
        })
        .filter(Boolean)
        .reverse();

    const handleOpenEdit = (item: any) => {
        setEditingItem(item);
        setEditDate(item.rawDate || '');
        setEditTime(item.time === '-' ? '' : item.time);
        setEditNotes(item.notes || '');
    };

    const handleSaveEdit = async () => {
        if (!editingItem) return;
        setSaving(true);
        try {
            await api.put(`/advisor/visit-schedules/${editingItem.id}`, null, {
                params: {
                    scheduled_date: editDate || undefined,
                    scheduled_time: editTime || undefined,
                    notes: editNotes || undefined,
                }
            });
            setEditingItem(null);
            await fetchData();
        } catch (err: any) {
            alert(err.response?.data?.detail || 'ไม่สามารถแก้ไขได้');
        } finally {
            setSaving(false);
        }
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
                    {historyData.map((item: any) => (
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
                                    <button
                                        onClick={() => handleOpenEdit(item)}
                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-50 text-orange-600 hover:bg-orange-100 hover:text-orange-700 transition-colors"
                                        title="แก้ไข"
                                    >
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

            {/* ===== Modal แก้ไขวันนิเทศ ===== */}
            {editingItem && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditingItem(null)}>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="bg-gradient-to-r from-[#4472c4] to-[#032B68] px-8 py-6 text-white flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold">แก้ไขวันนิเทศ</h2>
                                <p className="text-white/70 text-sm mt-1">{editingItem.student} — ครั้งที่ {editingItem.visitNumber}</p>
                            </div>
                            <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-white/20 rounded-xl">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-gray-900 font-bold block text-sm">วันที่นิเทศ</label>
                                <input
                                    type="date"
                                    value={editDate}
                                    onChange={e => setEditDate(e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#4472c4]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-gray-900 font-bold block text-sm">เวลานิเทศ</label>
                                <input
                                    type="time"
                                    value={editTime}
                                    onChange={e => setEditTime(e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#4472c4]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-gray-900 font-bold block text-sm">หมายเหตุ</label>
                                <textarea
                                    value={editNotes}
                                    onChange={e => setEditNotes(e.target.value)}
                                    rows={3}
                                    placeholder="เช่น นัดช่วงเช้า"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#4472c4] resize-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setEditingItem(null)}
                                    className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    disabled={saving}
                                    className="flex-1 py-3 bg-[#4472c4] hover:bg-[#365fa3] text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <Save size={18} />
                                    {saving ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupervisionHistoryPage;
