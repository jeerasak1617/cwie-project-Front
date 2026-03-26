import { useState, useEffect } from 'react';
import { FileText, User, MapPin, CheckCircle2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import api from '../../api';

const TeacherVerifyExperiencePage = () => {
    const { studentId } = useParams(); // internship_id
    const [isSigned, setIsSigned] = useState(false);
    const [studentData, setStudentData] = useState<any>(null);
    const [experiences, setExperiences] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [detailRes, expRes] = await Promise.all([
                    api.get(`/advisor/students/${studentId}`),
                    api.get(`/advisor/experiences/${studentId}`, { params: { per_page: 100 } }),
                ]);
                setStudentData(detailRes.data);
                setExperiences(expRes.data.experiences || []);
            } catch (err) {
                console.error('Failed to fetch data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [studentId]);

    if (loading) {
        return <div className="flex justify-center items-center h-64 text-gray-500">กำลังโหลดข้อมูล...</div>;
    }

    if (!studentData) {
        return <div className="p-10 text-center">ไม่พบข้อมูลนักศึกษา</div>;
    }

    const student = studentData.student || {};
    const internship = studentData.internship || {};

    // Combine experiences into a description
    const expDescription = experiences.length > 0
        ? experiences.map(e => `${e.topic || ''}: ${e.description || ''}`).join('\n')
        : 'ยังไม่มีข้อมูลประสบการณ์';

    return (
        <div className="flex flex-col h-full">
            <div className="mb-8 border-b border-gray-100 pb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">บันทึกการฝึกประสบการณ์วิชาชีพ</h1>
                <p className="text-gray-500">ตรวจสอบข้อมูลและลงลายเซ็นรับรอง (รหัส: {student.student_code})</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Student Info */}
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

                    {/* Internship Info */}
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

                    {/* Experiences */}
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
                                            <span className="text-sm text-gray-400">{new Date(exp.experience_date).toLocaleDateString('th-TH')}</span>
                                        </div>
                                        <p className="text-gray-700 whitespace-pre-line mb-2">{exp.description || '-'}</p>
                                        {exp.supervisor_comment && (
                                            <p className="text-sm text-blue-600">พี่เลี้ยง: {exp.supervisor_comment}</p>
                                        )}
                                        {exp.advisor_comment ? (
                                            <p className="text-sm text-green-600">อาจารย์: {exp.advisor_comment}</p>
                                        ) : (
                                            <p className="text-sm text-orange-500">รอตรวจจากอาจารย์</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                {/* Signature Column */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6">
                        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-lg">
                            <h3 className="font-bold text-gray-900 mb-6 text-center">การรับรอง</h3>
                            <div className="mb-6">
                                <label className="text-xs font-bold text-gray-400 uppercase block mb-2 text-center">ลายเซ็นนักศึกษา</label>
                                <div className="h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center mb-2">
                                    <span className="text-gray-400 text-sm">มีลายเซ็นแล้ว</span>
                                </div>
                                <p className="text-center text-sm font-bold text-gray-900">{student.full_name}</p>
                            </div>
                            <div className="border-t border-gray-100 my-6"></div>
                            <div className="text-center">
                                <label className="text-xs font-bold text-gray-400 uppercase block mb-4">ส่วนของอาจารย์นิเทศ</label>
                                {!isSigned ? (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100 text-yellow-800 text-sm font-medium">
                                            กรุณาตรวจสอบข้อมูลให้ถูกต้องครบถ้วนก่อนลงนาม
                                        </div>
                                        <button onClick={() => setIsSigned(true)} className="w-full py-3 bg-[#4472c4] hover:bg-[#365fa3] text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95">
                                            ลงลายเซ็นรับรอง
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                                        <div className="h-32 bg-green-50 border-2 border-green-200 rounded-2xl flex flex-col items-center justify-center text-green-700">
                                            <div className="font-script text-2xl mb-1">Signed</div>
                                            <span className="text-xs font-bold uppercase">Digital Signature</span>
                                        </div>
                                        <div className="text-green-600 font-bold text-sm flex items-center justify-center gap-2">
                                            <CheckCircle2 size={16} /> ลงนามเรียบร้อยแล้ว
                                        </div>
                                        <button onClick={() => setIsSigned(false)} className="text-gray-400 hover:text-gray-600 text-sm underline">ยกเลิกการลงนาม</button>
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

export default TeacherVerifyExperiencePage;
