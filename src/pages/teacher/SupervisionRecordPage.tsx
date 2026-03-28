import { useState, useEffect } from 'react';
import { User, FileText, Calendar, Clock } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AutoResizeTextarea from '../../components/ui/AutoResizeTextarea';
import api from '../../api';

const SupervisionRecordPage = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [studentData, setStudentData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [existingReports, setExistingReports] = useState<any[]>([]);
    const [selectedVisit, setSelectedVisit] = useState(1);

    const [formData, setFormData] = useState({
        work_observed: '', student_performance: '',
        issues_found: '', solutions_suggested: '', recommendations: '',
    });

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const { data } = await api.get(`/advisor/students/${studentId}`);
                setStudentData(data);

                // โหลด reports ที่บันทึกไปแล้ว
                try {
                    const reportRes = await api.get(`/advisor/visit-reports/${studentId}`);
                    const reports = reportRes.data.reports || [];
                    setExistingReports(reports);

                    // หาครั้งที่ยังไม่ได้บันทึก
                    const completedVisits = reports.map((r: any) => r.visit_number);
                    if (!completedVisits.includes(1)) setSelectedVisit(1);
                    else if (!completedVisits.includes(2)) setSelectedVisit(2);
                    else if (!completedVisits.includes(3)) setSelectedVisit(3);
                    else setSelectedVisit(1); // ครบหมดแล้ว ดูครั้งที่ 1
                } catch {}
            } catch (err) { console.error('Failed to fetch:', err); }
            finally { setLoading(false); }
        };
        fetchAll();
    }, [studentId]);

    // เมื่อเลือกครั้งที่เปลี่ยน → โหลดข้อมูลเดิม (ถ้ามี)
    useEffect(() => {
        const report = existingReports.find(r => r.visit_number === selectedVisit);
        if (report) {
            setFormData({
                work_observed: report.work_observed || '',
                student_performance: report.student_performance || '',
                issues_found: report.issues_found || '',
                solutions_suggested: report.solutions_suggested || '',
                recommendations: report.recommendations || '',
            });
        } else {
            setFormData({ work_observed: '', student_performance: '', issues_found: '', solutions_suggested: '', recommendations: '' });
        }
    }, [selectedVisit, existingReports]);

    const isVisitCompleted = (num: number) => existingReports.some(r => r.visit_number === num);
    const currentReportExists = isVisitCompleted(selectedVisit);

    const handleSave = async () => {
        if (currentReportExists) { alert('บันทึกครั้งนี้ไปแล้ว'); return; }
        setSaving(true);
        try {
            await api.post('/advisor/visit-report', null, {
                params: {
                    internship_id: Number(studentId),
                    visit_date: new Date().toISOString().split('T')[0],
                    visit_number: selectedVisit,
                    work_observed: formData.work_observed || undefined,
                    student_performance: formData.student_performance || undefined,
                    issues_found: formData.issues_found || undefined,
                    solutions_suggested: formData.solutions_suggested || undefined,
                    recommendations: formData.recommendations || undefined,
                }
            });
            alert(`บันทึกผลนิเทศครั้งที่ ${selectedVisit} สำเร็จ`);
            navigate('/teacher/history');
        } catch (err: any) {
            alert(err.response?.data?.detail || 'ไม่สามารถบันทึกได้');
        } finally { setSaving(false); }
    };

    if (loading) return <div className="flex justify-center items-center h-64 text-gray-500">กำลังโหลดข้อมูล...</div>;
    if (!studentData) return <div className="p-10 text-center">ไม่พบข้อมูลนักศึกษา</div>;

    const student = studentData.student || {};
    const internship = studentData.internship || {};
    const summary = studentData.summary || {};

    return (
        <div className="flex items-center justify-center">
            <div className="bg-white rounded-[3rem] p-8 md:p-12 w-full max-w-5xl shadow-2xl border border-gray-100 relative flex flex-col">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">บันทึกการนิเทศน์</h1>
                    <p className="text-gray-500">กรอกข้อมูลผลการนิเทศนักศึกษา</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="border border-gray-200 rounded-3xl p-6 flex flex-col gap-4">
                        <h3 className="font-bold text-gray-900">ข้อมูลนักศึกษา</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><User size={32} /></div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{student.full_name}</h2>
                                <p className="text-gray-500">{student.student_code} | {student.email || '-'}</p>
                            </div>
                        </div>
                        <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">กำลังฝึกประสบการณ์</span>
                        <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600 mt-2">
                            <div><p className="text-gray-400">ชั่วโมงสะสม</p><p>{internship.completed_hours || 0} / {internship.required_hours || 0} ชม.</p></div>
                            <div><p className="text-gray-400">บันทึกรายวัน</p><p>ตรวจแล้ว {summary.reviewed_daily_logs || 0} / {summary.total_daily_logs || 0}</p></div>
                        </div>
                    </div>
                    <div className="border border-gray-200 rounded-3xl p-6 flex flex-col gap-4">
                        <h3 className="font-bold text-gray-900">ข้อมูลการฝึกงาน</h3>
                        <div className="grid grid-cols-2 gap-y-6 text-sm">
                            <div><p className="text-gray-400 mb-1">ตำแหน่ง</p><p className="text-gray-900 font-medium">{internship.job_title || '-'}</p></div>
                            <div><p className="text-gray-400 mb-1">บริษัทที่ฝึก</p><p className="text-gray-900 font-medium">{internship.company_name || '-'}</p></div>
                            <div><p className="text-gray-400 mb-1">วันเริ่ม</p><p>{internship.start_date ? new Date(internship.start_date).toLocaleDateString('th-TH') : '-'}</p></div>
                            <div><p className="text-gray-400 mb-1">วันสิ้นสุด</p><p>{internship.end_date ? new Date(internship.end_date).toLocaleDateString('th-TH') : '-'}</p></div>
                        </div>
                    </div>
                </div>

                {/* เลือกครั้งที่นิเทศ */}
                <div className="mb-8">
                    <h3 className="font-bold text-gray-900 mb-3">เลือกครั้งที่นิเทศ</h3>
                    <div className="flex gap-3">
                        {[1, 2, 3].map(num => {
                            const completed = isVisitCompleted(num);
                            const isSelected = selectedVisit === num;
                            const report = existingReports.find(r => r.visit_number === num);
                            return (
                                <button
                                    key={num}
                                    onClick={() => setSelectedVisit(num)}
                                    className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all border-2 ${
                                        isSelected
                                            ? 'bg-[#4472c4] text-white border-[#4472c4] shadow-lg'
                                            : completed
                                                ? 'bg-green-50 text-green-700 border-green-200 hover:border-green-400'
                                                : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-blue-300'
                                    }`}
                                >
                                    <div>ครั้งที่ {num}</div>
                                    <div className="text-xs font-medium mt-1">
                                        {completed ? `✓ บันทึกแล้ว ${report?.visit_date ? new Date(report.visit_date).toLocaleDateString('th-TH') : ''}` : 'ยังไม่บันทึก'}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-4 mb-10">
                    <div className={`px-4 py-2 rounded-full flex items-center gap-2 font-bold text-sm ${currentReportExists ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        <FileText size={16} /> {currentReportExists ? `ดูผลนิเทศครั้งที่ ${selectedVisit}` : `บันทึกผลนิเทศครั้งที่ ${selectedVisit}`}
                    </div>
                    <div className="bg-blue-200 text-blue-800 px-4 py-2 rounded-full flex items-center gap-2 font-bold text-sm">
                        <Calendar size={16} /> {new Date().toLocaleDateString('th-TH')}
                    </div>
                    <div className="bg-blue-200 text-blue-800 px-4 py-2 rounded-full flex items-center gap-2 font-bold text-sm">
                        <Clock size={16} /> {new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                    </div>
                </div>

                {/* Form */}
                <h2 className="text-xl font-bold text-gray-900 mb-6">ลักษณะงาน / ความก้าวหน้าของนักศึกษา</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 mb-10">
                    <div className="space-y-2">
                        <label className="font-bold text-gray-900">งาน / โครงการที่นักศึกษาปฏิบัติ</label>
                        <AutoResizeTextarea variant="underline" placeholder="เช่น พัฒนาเว็บส่วนข้างหน้า" rows={1} value={formData.work_observed} onChange={(e) => setFormData({ ...formData, work_observed: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <label className="font-bold text-gray-900">สรุปความคืบหน้า</label>
                        <AutoResizeTextarea variant="underline" placeholder="ระบุความก้าวหน้า" rows={1} value={formData.student_performance} onChange={(e) => setFormData({ ...formData, student_performance: e.target.value })} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 mb-10">
                    <div className="space-y-2">
                        <label className="font-bold text-gray-900">ปัญหาที่พบ</label>
                        <AutoResizeTextarea variant="underline" placeholder="เช่น ด้านบุคลิกภาพ" rows={1} value={formData.issues_found} onChange={(e) => setFormData({ ...formData, issues_found: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <label className="font-bold text-gray-900">แนวทางแก้ไข / สิ่งที่ตกลงร่วมกัน</label>
                        <AutoResizeTextarea variant="underline" placeholder="ระบุสิ่งที่ได้แนะนำ วิธีแก้ไข" rows={1} value={formData.solutions_suggested} onChange={(e) => setFormData({ ...formData, solutions_suggested: e.target.value })} />
                    </div>
                </div>

                <div className="space-y-2 mb-10">
                    <label className="font-bold text-gray-900">ข้อเสนอแนะเพื่อการพัฒนานักศึกษา</label>
                    <AutoResizeTextarea variant="underline" placeholder="เช่น ทักษะการสื่อสาร หรือการจัดเวลา" rows={1} value={formData.recommendations} onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })} />
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-8">
                    <Link to="/teacher/history" className="text-blue-600 font-bold hover:underline">ดูประวัติการบันทึกนิเทศ</Link>
                    <button
                        onClick={handleSave}
                        disabled={saving || currentReportExists}
                        className={`font-bold py-3 px-8 rounded-full shadow-lg transition-transform active:scale-95 ${
                            currentReportExists ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-[#5cc945] hover:bg-[#4db83a] text-white'
                        }`}
                    >
                        {currentReportExists ? `ครั้งที่ ${selectedVisit} บันทึกแล้ว` : saving ? 'กำลังบันทึก...' : `บันทึกครั้งที่ ${selectedVisit}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SupervisionRecordPage;
