import { useState, useEffect } from 'react';
import { Search, Eye, X, AlertTriangle, RotateCcw, Clock, FileText, Users, Building2, ChevronRight, Ban, CheckCircle2, BookOpen } from 'lucide-react';
import api from '../../api';

const AdminInternshipPage = () => {
    const [internships, setInternships] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    // Detail modal
    const [selectedDetail, setSelectedDetail] = useState<any>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    // Cancel modal
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelTarget, setCancelTarget] = useState<any>(null);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelling, setCancelling] = useState(false);

    const fetchInternships = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/internships');
            setInternships(data.internships || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchInternships(); }, []);

    const handleViewDetail = async (internshipId: number) => {
        setLoadingDetail(true);
        try {
            const { data } = await api.get(`/admin/internships/${internshipId}`);
            setSelectedDetail(data);
        } catch (err: any) {
            alert(err.response?.data?.detail || 'ไม่สามารถดูรายละเอียดได้');
        } finally { setLoadingDetail(false); }
    };

    const handleCancel = async () => {
        if (!cancelTarget || !cancelReason.trim()) return;
        setCancelling(true);
        try {
            await api.post(`/admin/internships/${cancelTarget.id}/cancel`, { reason: cancelReason.trim() });
            setShowCancelModal(false);
            setCancelReason('');
            setCancelTarget(null);
            setSelectedDetail(null);
            await fetchInternships();
        } catch (err: any) {
            alert(err.response?.data?.detail || 'ไม่สามารถยกเลิกได้');
        } finally { setCancelling(false); }
    };

    const handleRestore = async (internshipId: number) => {
        if (!confirm('ต้องการคืนสถานะการฝึกงานใช่หรือไม่?')) return;
        try {
            await api.post(`/admin/internships/${internshipId}/restore`);
            setSelectedDetail(null);
            await fetchInternships();
        } catch (err: any) {
            alert(err.response?.data?.detail || 'ไม่สามารถคืนสถานะได้');
        }
    };

    const isCancelled = (item: any) => {
        return item.internship_code?.includes('cancelled') ||
               item.student_name?.includes('ยกเลิก') ||
               false;
    };

    const filtered = internships.filter(i => {
        const text = `${i.student_name} ${i.student_code} ${i.company_name} ${i.internship_code}`.toLowerCase();
        return text.includes(searchTerm.toLowerCase());
    });

    const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }) : '-';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">จัดการการฝึกงาน</h1>
                    <p className="text-slate-400 text-sm mt-1">ดูรายละเอียดนักศึกษา และยกเลิกการฝึกงานได้</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-blue-50 text-[#032B68] px-5 py-2.5 rounded-xl text-sm font-bold border border-blue-100">
                        ทั้งหมด {internships.length} คน
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm p-4">
                <div className="relative max-w-md">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input type="text" placeholder="ค้นหาชื่อ, รหัสนักศึกษา, บริษัท..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4472c4]/30 text-sm" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50/40">
                                <th className="text-left px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase">นักศึกษา</th>
                                <th className="text-left px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase">บริษัท</th>
                                <th className="text-center px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase">ระยะเวลา</th>
                                <th className="text-center px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase">ปฐมนิเทศ</th>
                                <th className="text-center px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase">ปัจฉิมนิเทศ</th>
                                <th className="text-center px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan={6} className="py-12 text-center text-slate-400">กำลังโหลด...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={6} className="py-12 text-center text-slate-400">ไม่พบข้อมูล</td></tr>
                            ) : filtered.map(item => (
                                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-[#4472c4] to-[#032B68] rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md">
                                                {(item.student_name || '?')[0]}
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-slate-700 block">{item.student_name}</span>
                                                <span className="text-[11px] text-slate-400">{item.student_code}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{item.company_name || '-'}</td>
                                    <td className="px-6 py-4 text-center text-xs text-slate-500">{formatDate(item.start_date)} - {formatDate(item.end_date)}</td>
                                    <td className="px-6 py-4 text-center">
                                        {item.orientation_attended ? <CheckCircle2 size={18} className="text-green-500 mx-auto" /> : <span className="text-slate-300">—</span>}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {item.debriefing_attended ? <CheckCircle2 size={18} className="text-green-500 mx-auto" /> : <span className="text-slate-300">—</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <button onClick={() => handleViewDetail(item.id)} className="p-2 text-slate-300 hover:text-[#4472c4] hover:bg-blue-50 rounded-xl transition-colors" title="ดูรายละเอียด">
                                                <Eye size={17} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ===== Detail Modal ===== */}
            {selectedDetail && (
                <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedDetail(null)}>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#032B68] to-[#4472c4] px-8 py-6 text-white flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold">ข้อมูลการฝึกงาน</h2>
                                <p className="text-white/70 text-sm mt-1">{selectedDetail.internship?.internship_code || ''}</p>
                            </div>
                            <button onClick={() => setSelectedDetail(null)} className="p-2 hover:bg-white/20 rounded-xl"><X size={20} /></button>
                        </div>

                        <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-8 space-y-6">
                            {loadingDetail ? (
                                <div className="text-center py-12 text-slate-400">กำลังโหลด...</div>
                            ) : (
                                <>
                                    {/* ถ้ายกเลิกแล้ว แสดง banner */}
                                    {selectedDetail.internship?.cancellation_reason && (
                                        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
                                            <AlertTriangle className="text-red-500 mt-0.5 flex-shrink-0" size={20} />
                                            <div>
                                                <p className="font-bold text-red-700">การฝึกงานถูกยกเลิก</p>
                                                <p className="text-red-600 text-sm mt-1">เหตุผล: {selectedDetail.internship.cancellation_reason}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* นักศึกษา */}
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 flex items-center gap-2"><Users size={16} /> ข้อมูลนักศึกษา</h3>
                                        <div className="bg-slate-50 rounded-2xl p-5 grid grid-cols-2 gap-4">
                                            <div><label className="text-[11px] text-slate-400 font-bold uppercase">ชื่อ-สกุล</label><p className="text-slate-800 font-bold">{selectedDetail.student?.full_name || '-'}</p></div>
                                            <div><label className="text-[11px] text-slate-400 font-bold uppercase">รหัสนักศึกษา</label><p className="text-slate-800 font-bold">{selectedDetail.student?.student_code || '-'}</p></div>
                                            <div><label className="text-[11px] text-slate-400 font-bold uppercase">อีเมล</label><p className="text-slate-600 text-sm">{selectedDetail.student?.email || '-'}</p></div>
                                            <div><label className="text-[11px] text-slate-400 font-bold uppercase">เบอร์โทร</label><p className="text-slate-600 text-sm">{selectedDetail.student?.phone || '-'}</p></div>
                                            {selectedDetail.student?.gpa && <div><label className="text-[11px] text-slate-400 font-bold uppercase">GPA</label><p className="text-slate-800 font-bold">{selectedDetail.student.gpa}</p></div>}
                                        </div>
                                    </div>

                                    {/* การฝึกงาน */}
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 flex items-center gap-2"><Building2 size={16} /> ข้อมูลการฝึกงาน</h3>
                                        <div className="bg-slate-50 rounded-2xl p-5 grid grid-cols-2 gap-4">
                                            <div><label className="text-[11px] text-slate-400 font-bold uppercase">บริษัท</label><p className="text-slate-800 font-bold">{selectedDetail.company?.name_th || '-'}</p></div>
                                            <div><label className="text-[11px] text-slate-400 font-bold uppercase">ตำแหน่ง</label><p className="text-slate-800">{selectedDetail.internship?.job_title || '-'}</p></div>
                                            <div><label className="text-[11px] text-slate-400 font-bold uppercase">วันเริ่ม</label><p className="text-slate-600 text-sm">{selectedDetail.internship?.start_date ? new Date(selectedDetail.internship.start_date).toLocaleDateString('th-TH') : '-'}</p></div>
                                            <div><label className="text-[11px] text-slate-400 font-bold uppercase">วันสิ้นสุด</label><p className="text-slate-600 text-sm">{selectedDetail.internship?.end_date ? new Date(selectedDetail.internship.end_date).toLocaleDateString('th-TH') : '-'}</p></div>
                                            <div><label className="text-[11px] text-slate-400 font-bold uppercase">ชั่วโมงสะสม</label><p className="text-slate-800 font-bold">{selectedDetail.internship?.completed_hours || 0} / {selectedDetail.internship?.required_hours || 0} ชม.</p></div>
                                            <div><label className="text-[11px] text-slate-400 font-bold uppercase">ภาคเรียน</label><p className="text-slate-600 text-sm">{selectedDetail.internship?.semester || '-'}</p></div>
                                        </div>
                                    </div>

                                    {/* อาจารย์ + พี่เลี้ยง */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-emerald-50 rounded-2xl p-4">
                                            <label className="text-[11px] text-emerald-600 font-bold uppercase flex items-center gap-1"><BookOpen size={12} /> อาจารย์นิเทศ</label>
                                            <p className="text-slate-800 font-bold mt-1">{selectedDetail.advisor?.full_name || 'ยังไม่มี'}</p>
                                        </div>
                                        <div className="bg-amber-50 rounded-2xl p-4">
                                            <label className="text-[11px] text-amber-600 font-bold uppercase flex items-center gap-1"><Building2 size={12} /> พี่เลี้ยง</label>
                                            <p className="text-slate-800 font-bold mt-1">{selectedDetail.supervisor?.full_name || 'ยังไม่มี'}</p>
                                        </div>
                                    </div>

                                    {/* สรุปข้อมูล */}
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 flex items-center gap-2"><FileText size={16} /> สรุปข้อมูล</h3>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { label: 'วันเข้างาน', value: selectedDetail.summary?.total_attendance_days || 0, color: 'bg-blue-50 text-blue-700' },
                                                { label: 'บันทึกรายวัน', value: selectedDetail.summary?.total_daily_logs || 0, color: 'bg-green-50 text-green-700' },
                                                { label: 'ประเมิน', value: selectedDetail.summary?.total_evaluations || 0, color: 'bg-orange-50 text-orange-700' },
                                            ].map((s, i) => (
                                                <div key={i} className={`${s.color} rounded-2xl p-4 text-center`}>
                                                    <p className="text-2xl font-bold">{s.value}</p>
                                                    <p className="text-[11px] font-bold mt-1">{s.label}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                        <button onClick={() => { setCancelTarget(selectedDetail.internship); setShowCancelModal(true); }}
                                            className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95">
                                            <Ban size={18} /> ยกเลิกการฝึกงาน
                                        </button>
                                        <button onClick={() => setSelectedDetail(null)} className="px-6 py-3 bg-slate-100 text-slate-500 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                            ปิด
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ===== Cancel Confirmation Modal ===== */}
            {showCancelModal && cancelTarget && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={() => setShowCancelModal(false)}>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="bg-gradient-to-r from-red-500 to-rose-600 px-8 py-6 text-white">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-white/20 rounded-2xl"><AlertTriangle size={24} /></div>
                                <div>
                                    <h2 className="text-lg font-bold">ยืนยันการยกเลิกการฝึกงาน</h2>
                                    <p className="text-white/70 text-sm mt-1">การดำเนินการนี้สามารถย้อนกลับได้</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 space-y-5">
                            <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                                <p className="text-red-700 text-sm font-medium">
                                    นักศึกษาจะไม่สามารถลงเวลา บันทึกรายวัน หรือบันทึกประสบการณ์ได้จนกว่าจะคืนสถานะ
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-slate-900 font-bold block text-sm">เหตุผลในการยกเลิก <span className="text-red-500">*</span></label>
                                <textarea
                                    value={cancelReason}
                                    onChange={e => setCancelReason(e.target.value)}
                                    rows={3}
                                    placeholder="เช่น นักศึกษาไม่มาฝึกงานติดต่อกัน 7 วัน"
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-red-400 resize-none text-sm"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button onClick={() => { setShowCancelModal(false); setCancelReason(''); }}
                                    className="flex-1 py-3 bg-slate-100 text-slate-500 font-bold rounded-xl hover:bg-slate-200">
                                    ยกเลิก
                                </button>
                                <button onClick={handleCancel} disabled={cancelling || !cancelReason.trim()}
                                    className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                                    <Ban size={18} />
                                    {cancelling ? 'กำลังยกเลิก...' : 'ยืนยันยกเลิก'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminInternshipPage;
