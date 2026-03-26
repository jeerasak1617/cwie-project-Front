import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Save, ChevronLeft, RotateCcw, Upload } from 'lucide-react';
import api from '../../api';

const CompanyEvaluationDetailPage = () => {
    const { studentId } = useParams(); // internship_id
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [studentInfo, setStudentInfo] = useState<any>(null);

    const criteriaSection1 = ["ทำงานถูกต้องและมีคุณภาพ","สามารถแก้ไขปัญหาและตัดสินใจได้","การพัฒนาตนเองในการทำงาน","ความเรียบร้อยถูกต้องของสมุดบันทึก"];
    const criteriaSection2 = ["แต่งกายสะอาด สุภาพเรียบร้อย","กิริยาวาจาเหมาะสมกับกาลเทศะ","มีมนุษย์สัมพันธ์ และใฝ่รู้","ตรงต่อเวลา"];

    const [ratings, setRatings] = useState<{ [key: string]: number }>({});
    const [mentorScore, setMentorScore] = useState<string>('');

    useEffect(() => {
        const fetch = async () => {
            try {
                // Supervisor doesn't have /students/{id} detail endpoint like advisor
                // Use students list and find
                const { data } = await api.get('/supervisor/students');
                const found = (data.students || []).find((s: any) => s.internship_id === Number(studentId));
                setStudentInfo(found);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetch();
    }, [studentId]);

    const handleRatingChange = (prefix: string, idx: number, val: number) => {
        setRatings(prev => ({ ...prev, [`${prefix}_${idx}`]: val }));
    };

    const calculateTotalScore = () => {
        const base = 10;
        return base + (parseFloat(mentorScore) || 0);
    };

    const handleSave = async () => {
        const score = parseFloat(mentorScore);
        if (!score || score < 0 || score > 50) { alert('กรุณากรอกคะแนน (0-50)'); return; }
        setSaving(true);
        try {
            await api.post('/supervisor/evaluation', null, {
                params: {
                    internship_id: Number(studentId),
                    total_score: score,
                    scores: JSON.stringify(ratings),
                    overall_comment: `คะแนนรวม: ${score}/50`,
                }
            });
            alert('บันทึกผลการประเมินสำเร็จ');
            navigate('/company/evaluations');
        } catch (err: any) {
            alert(err.response?.data?.detail || 'ไม่สามารถบันทึกได้');
        } finally { setSaving(false); }
    };

    if (loading) return <div className="flex justify-center items-center h-64 text-gray-500">กำลังโหลด...</div>;

    const student = studentInfo || {};

    return (
        <div className="flex justify-center items-start min-h-screen pt-4 pb-12">
            <div className="bg-white rounded-[40px] p-8 md:p-12 w-full max-w-[1400px] shadow-sm">
                <div className="flex flex-col gap-8 mb-10">
                    <Link to="/company/evaluations" className="inline-flex items-center text-gray-400 hover:text-[#4472c4] transition-colors font-medium w-fit group">
                        <ChevronLeft size={20} className="mr-1" /> ย้อนกลับ
                    </Link>
                    <div className="border-b border-gray-100 pb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">แบบประเมินผลการฝึกประสบการณ์วิชาชีพ</h1>
                        <p className="text-gray-500 text-lg">ประเมินโดยพี่เลี้ยง/ผู้นิเทศประจำหน่วยงาน (50 คะแนน)</p>
                    </div>
                </div>

                {/* Student Info */}
                <div className="bg-[#F8F9FA] rounded-[30px] p-8 mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div><div className="text-gray-500 text-sm mb-1">ชื่อ-นามสกุล</div><div className="text-xl font-bold text-[#032B68]">{student.full_name || '-'}</div><div className="text-[#4472c4] text-sm mt-1">{student.student_code || '-'}</div></div>
                        <div><div className="text-gray-500 text-sm mb-1">ชั่วโมงสะสม</div><div className="text-gray-900 font-semibold">{student.completed_hours || 0} / {student.required_hours || 0} ชม.</div></div>
                        <div><div className="text-gray-500 text-sm mb-1">ระยะเวลาฝึก</div><div className="text-gray-900 font-semibold">{student.start_date ? `${new Date(student.start_date).toLocaleDateString('th-TH')} - ${student.end_date ? new Date(student.end_date).toLocaleDateString('th-TH') : '-'}` : '-'}</div></div>
                    </div>
                </div>

                <div className="space-y-24">
                    {/* Section 1 */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-blue-50 text-[#4472c4] flex items-center justify-center font-bold text-xl">1</div><h2 className="text-2xl font-bold text-gray-900">ด้านการทำงาน</h2></div>
                        <div className="bg-white rounded-[30px] border border-gray-100 shadow-sm overflow-hidden">
                            {criteriaSection1.map((item, idx) => (
                                <div key={idx} className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-50 last:border-0">
                                    <div className="text-lg font-medium text-gray-700 md:w-1/2">{item}</div>
                                    <div className="flex items-center gap-3">
                                        {[1,2,3,4,5].map(s => (
                                            <button key={s} onClick={() => handleRatingChange('work', idx, s)} className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg font-bold transition-all ${ratings[`work_${idx}`] === s ? 'bg-[#4472c4] border-[#4472c4] text-white shadow-md' : 'bg-white border-gray-100 text-gray-400 hover:border-blue-200'}`}>{s}</button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-blue-50 text-[#4472c4] flex items-center justify-center font-bold text-xl">2</div><h2 className="text-2xl font-bold text-gray-900">บุคลิกภาพ มนุษยสัมพันธ์ และวินัย</h2></div>
                        <div className="bg-white rounded-[30px] border border-gray-100 shadow-sm overflow-hidden">
                            {criteriaSection2.map((item, idx) => (
                                <div key={idx} className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-50 last:border-0">
                                    <div className="text-lg font-medium text-gray-700 md:w-1/2">{item}</div>
                                    <div className="flex items-center gap-3">
                                        {[1,2,3,4,5].map(s => (
                                            <button key={s} onClick={() => handleRatingChange('person', idx, s)} className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg font-bold transition-all ${ratings[`person_${idx}`] === s ? 'bg-[#4472c4] border-[#4472c4] text-white shadow-md' : 'bg-white border-gray-100 text-gray-400 hover:border-blue-200'}`}>{s}</button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-gray-900 pl-4 border-l-4 border-[#4472c4]">สรุปคะแนน</h2>
                        <div className="bg-white rounded-[30px] border border-gray-100 overflow-hidden">
                            <table className="w-full min-w-[700px]">
                                <thead className="bg-[#f8fafc]"><tr><th className="py-5 px-8 text-left">ผู้ประเมิน</th><th className="py-5 px-8 text-left">รายละเอียด</th><th className="py-5 px-8 text-center">เต็ม</th><th className="py-5 px-8 text-center">ได้</th></tr></thead>
                                <tbody className="divide-y divide-gray-50">
                                    <tr className="bg-[#4472c4]/5">
                                        <td className="py-5 px-8 font-bold text-[#032B68]">1. ผู้นิเทศหน่วยงาน</td>
                                        <td className="py-5 px-8 text-gray-700">พี่เลี้ยง</td>
                                        <td className="py-5 px-8 text-center font-bold text-[#032B68]">50</td>
                                        <td className="py-5 px-8 text-center"><input type="number" value={mentorScore} onChange={e => setMentorScore(e.target.value)} className="w-24 text-center py-2 border-2 border-[#4472c4]/20 rounded-xl font-bold text-[#032B68] text-xl focus:border-[#4472c4] outline-none bg-white" placeholder="0" min="0" max="50" /></td>
                                    </tr>
                                    <tr><td className="py-5 px-8 font-bold text-gray-800">2. อาจารย์นิเทศ</td><td className="py-5 px-8 text-gray-600">การนิเทศนักศึกษา</td><td className="py-5 px-8 text-center font-bold">40</td><td className="py-5 px-8 text-center text-gray-300">-</td></tr>
                                    <tr><td className="py-5 px-8 font-bold">3. หัวหน้าศูนย์ฯ</td><td className="py-5 px-8 text-gray-600">ปฐมนิเทศ</td><td className="py-5 px-8 text-center">5</td><td className="py-5 px-8 text-center"><span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg font-bold">5</span></td></tr>
                                    <tr><td className="py-5 px-8 font-bold">4. กรรมการศูนย์ฯ</td><td className="py-5 px-8 text-gray-600">ปัจฉิมนิเทศ</td><td className="py-5 px-8 text-center">5</td><td className="py-5 px-8 text-center"><span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg font-bold">5</span></td></tr>
                                </tbody>
                                <tfoot className="bg-gray-50 border-t"><tr><td colSpan={2} className="py-5 px-8 font-bold text-lg">รวม</td><td className="py-5 px-8 text-center font-bold text-lg">100</td><td className="py-5 px-8 text-center font-bold text-[#2E5A9B] text-2xl">{calculateTotalScore()}</td></tr></tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Signature */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 pl-4 border-l-4 border-[#4472c4]">ลายเซ็นรับรอง</h2>
                        <div className="bg-[#f8fafc] rounded-[30px] p-10 flex flex-col items-center border border-dashed border-gray-300">
                            <label className="text-xl font-bold text-gray-900 mb-6">ลายเซ็นพี่เลี้ยง</label>
                            <div className="w-full max-w-[500px] h-48 bg-white rounded-2xl border-2 border-[#E2E8F0] mb-8 flex items-center justify-center"><span className="text-gray-300 font-medium text-lg">พื้นที่สำหรับเซ็นชื่อ</span></div>
                            <div className="flex gap-4"><button className="px-8 py-3 rounded-full border-2 border-gray-200 text-gray-600 font-bold flex items-center gap-2"><RotateCcw size={18} /> ล้าง</button><button className="px-8 py-3 rounded-full border-2 border-[#4472c4] text-[#4472c4] font-bold flex items-center gap-2"><Upload size={18} /> อัปโหลด</button></div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-8 border-t border-gray-100">
                        <button onClick={handleSave} disabled={saving} className="px-12 py-4 bg-[#5DC139] hover:bg-[#4ea82e] text-white text-xl font-bold rounded-[20px] shadow-lg flex items-center gap-3">
                            <Save size={24} /> {saving ? 'กำลังบันทึก...' : 'บันทึกผลการประเมิน'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyEvaluationDetailPage;
