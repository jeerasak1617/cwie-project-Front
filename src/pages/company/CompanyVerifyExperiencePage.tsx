import { useState, useEffect } from 'react';
import { FileText, User, MapPin, CheckCircle2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import api from '../../api';

const CompanyVerifyExperiencePage = () => {
    const { studentId } = useParams(); // internship_id
    const [isSigned, setIsSigned] = useState(false);
    const [signing, setSigning] = useState(false);
    const [studentData, setStudentData] = useState<any>(null);
    const [experiences, setExperiences] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // ตรวจ + comment
    const [comment, setComment] = useState('');
    const [reviewingId, setReviewingId] = useState<number | null>(null);

    const signKey = `company_sign_experience_${studentId}`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [detailRes, expRes] = await Promise.all([
                    api.get(`/supervisor/students/${studentId}`),
                    api.get(`/supervisor/experiences/${studentId}`, { params: { per_page: 100 } }),
                ]);
                setStudentData(detailRes.data);
                setExperiences(expRes.data.experiences || []);

                // เช็ค localStorage ก่อน (จำสถานะได้)
                const saved = localStorage.getItem(signKey);
                if (saved === 'signed') {
                    setIsSigned(true);
                } else {
                    // เช็คจาก backend ด้วย (ถ้ามี flag)
                    const internship = detailRes.data?.internship;
                    if (internship && internship.remarks && internship.remarks.includes('supervisor_signed')) {
                        setIsSigned(true);
                        localStorage.setItem(signKey, 'signed');
                    }
                }
            } catch (err) {
                console.error('Failed to fetch data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [studentId]);

    const handleSign = async () => {
        setSigning(true);
        try {
            try {
                await api.post('/supervisor/sign-experience', null, { params: { internship_id: studentId } });
            } catch {}
            localStorage.setItem(signKey, 'signed');
            setIsSigned(true);
        } finally {
            setSigning(false);
        }
    };

    const handleUnsign = async () => {
        if (!confirm('ยืนยันการยกเลิกการลงนาม?')) return;
        try {
            try {
                await api.post('/supervisor/unsign-experience', null, { params: { internship_id: studentId } });
            } catch {}
            localStorage.removeItem(signKey);
            setIsSigned(false);
        } catch {}
    };

    const handleReview = async (expId: number) => {
        if (!comment.trim()) return;
        try {
            await api.post(`/supervisor/experiences/${expId}/review`, null, { params: { comment: comment.trim() } });
            setComment('');
            setReviewingId(null);
            const expRes = await api.get(`/supervisor/experiences/${studentId}`, { params: { per_page: 100 } });
            setExperiences(expRes.data.experiences || []);
        } catch {}
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64 text-gray-500">กำลังโหลดข้อมูล...</div>;
    }

    if (!studentData) {
        return <div className="p-10 text-center text-gray-400">ไม่พบข้อมูลนักศึกษา</div>;
    }

    const student = studentData.student || {};
    const internship = studentData.internship || {};

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="mb-8 border-b border-gray-100 pb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">บันทึกการฝึกประสบการณ์วิชาชีพ</h1>
                <p className="text-gray-500">ตรวจสอบข้อมูลและลงลายเซ็นรับรอง (รหัส: {student.student_code})</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: ข้อมูล + ประสบการณ์ */}
                <div className="lg:col-span-2 space-y-8">
                    {/* ข้อมูลนักศึกษา */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="text-[#4472c4]" /> ข้อมูลนักศึกษา
                        </h2>
                        <div className="bg-gray-50 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">ชื่อ-นามสกุล</label>
                                <p className="text-gray-900 font-bold text-lg">{student.full_name}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">รหัสนักศึกษา</label>
                                <p className="text-gray-900 font-bold text-lg">{student.student_code}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">อีเมล</label>
                                <p className="text-gray-700">{student.email || '-'}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">เบอร์โทร</label>
                                <p className="text-gray-700">{student.phone || '-'}</p>
                            </div>
                        </div>
                    </section>

                    {/* ข้อมูลการฝึกงาน */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <MapPin className="text-orange-500" /> ข้อมูลการฝึกงาน
                        </h2>
                        <div className="bg-gray-50 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">ตำแหน่ง</label>
                                <p className="text-gray-900 font-bold text-lg">{internship.job_title || '-'}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">ชั่วโมงสะสม</label>
                                <p className="text-gray-700">{internship.completed_hours || 0} / {internship.required_hours || 0} ชม.</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">วันเริ่ม</label>
                                <p className="text-gray-700">{internship.start_date ? new Date(internship.start_date).toLocaleDateString('th-TH') : '-'}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">วันสิ้นสุด</label>
                                <p className="text-gray-700">{internship.end_date ? new Date(internship.end_date).toLocaleDateString('th-TH') : '-'}</p>
                            </div>
                        </div>
                    </section>

                    {/* ประสบการณ์ที่บันทึก */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText className="text-green-500" /> ประสบการณ์ที่บันทึก ({experiences.length} รายการ)
                        </h2>
                        {experiences.length === 0 ? (
                            <div className="bg-gray-50 rounded-3xl p-6 text-gray-400 text-center">ยังไม่มีข้อมูลประสบการณ์</div>
                        ) : (
                            <div className="space-y-4">
                                {experiences.map((exp) => (
                                    <div key={exp.id} className="bg-gray-50 rounded-3xl p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-gray-900">{exp.topic || 'ไม่มีหัวข้อ'}</h3>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-400">{new Date(exp.experience_date).toLocaleDateString('th-TH')}</span>
                                                {exp.supervisor_comment ? (
                                                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-600">ตรวจแล้ว</span>
                                                ) : (
                                                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-50 text-yellow-600">รอตรวจ</span>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-gray-700 whitespace-pre-line mb-2">{exp.description || '-'}</p>

                                        {exp.supervisor_comment && (
                                            <p className="text-sm text-blue-600 mt-2">
                                                <strong>พี่เลี้ยง:</strong> {exp.supervisor_comment}
                                            </p>
                                        )}
                                        {exp.advisor_comment && (
                                            <p className="text-sm text-green-600">
                                                <strong>อาจารย์:</strong> {exp.advisor_comment}
                                            </p>
                                        )}

                                        {/* ปุ่มตรวจ + comment */}
                                        {!exp.supervisor_comment && (
                                            reviewingId === exp.id ? (
                                                <div className="mt-3 flex gap-2">
                                                    <input
                                                        value={comment}
                                                        onChange={e => setComment(e.target.value)}
                                                        placeholder="ความเห็น..."
                                                        className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#4472c4]"
                                                        onKeyDown={e => e.key === 'Enter' && handleReview(exp.id)}
                                                    />
                                                    <button onClick={() => handleReview(exp.id)} className="px-4 py-2 bg-[#5cc945] text-white rounded-full font-bold text-sm">บันทึก</button>
                                                    <button onClick={() => { setReviewingId(null); setComment(''); }} className="px-4 py-2 bg-gray-200 text-gray-600 rounded-full font-bold text-sm">ยกเลิก</button>
                                                </div>
                                            ) : (
                                                <button onClick={() => setReviewingId(exp.id)} className="mt-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-sm font-bold hover:bg-orange-100 transition-colors">
                                                    ตรวจ + ให้ความเห็น
                                                </button>
                                            )
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                {/* Right: การรับรอง */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6">
                        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-lg">
                            <h3 className="font-bold text-gray-900 mb-6 text-center">การรับรอง</h3>

                            {/* ส่วนของพี่เลี้ยง */}
                            <div className="text-center">
                                <label className="text-xs font-bold text-gray-400 uppercase block mb-4">ส่วนของพี่เลี้ยง</label>
                                {!isSigned ? (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100 text-yellow-800 text-sm font-medium">
                                            กรุณาตรวจสอบข้อมูลให้ถูกต้องครบถ้วนก่อนลงนาม
                                        </div>
                                        <button
                                            onClick={handleSign}
                                            disabled={signing}
                                            className="w-full py-3 bg-[#4472c4] hover:bg-[#365fa3] text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 disabled:opacity-50"
                                        >
                                            {signing ? 'กำลังลงนาม...' : 'ลงลายเซ็นรับรอง'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                                        <div className="h-32 bg-green-50 border-2 border-green-200 rounded-2xl flex flex-col items-center justify-center text-green-700">
                                            <div className="text-2xl font-bold mb-1">ลงนามแล้ว</div>
                                            <span className="text-xs font-bold">ลงนามเรียบร้อย</span>
                                        </div>
                                        <div className="text-green-600 font-bold text-sm flex items-center justify-center gap-2">
                                            <CheckCircle2 size={16} /> ลงนามเรียบร้อยแล้ว
                                        </div>
                                        <button onClick={handleUnsign} className="text-gray-400 hover:text-gray-600 text-sm underline">
                                            ยกเลิกการลงนาม
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyVerifyExperiencePage;
