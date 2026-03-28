import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Save, ChevronLeft, RotateCcw, Upload } from 'lucide-react';
import api from '../../api';

const EvaluationPage = () => {
    const { studentId } = useParams(); // internship_id
    const navigate = useNavigate();
    const [studentData, setStudentData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const criteriaSection1 = [
        "ทำงานถูกต้องและมีคุณภาพ",
        "สามารถแก้ไขปัญหาและตัดสินใจได้",
        "การพัฒนาตนเองในการทำงาน",
        "ความเรียบร้อยถูกต้องของสมุดบันทึก"
    ];

    const criteriaSection2 = [
        "แต่งกายสะอาด สุภาพเรียบร้อย",
        "กิริยาวาจาเหมาะสมกับกาลเทศะ",
        "มีมนุษย์สัมพันธ์ และใฝ่รู้",
        "ตรงต่อเวลา"
    ];

    const [ratings, setRatings] = useState<{ [key: string]: number }>({});
    const [teacherScore, setTeacherScore] = useState<string>('');
    const [alreadyEvaluated, setAlreadyEvaluated] = useState(false);
    const [supervisorScore, setSupervisorScore] = useState<number | null>(null);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const { data } = await api.get(`/advisor/students/${studentId}`);
                setStudentData(data);

                // โหลดคะแนนที่ประเมินไปแล้ว
                try {
                    const evalRes = await api.get(`/advisor/evaluation/${studentId}`);
                    const evals = evalRes.data.evaluations || {};

                    // คะแนนอาจารย์ (ถ้าประเมินแล้ว)
                    if (evals.advisor) {
                        setAlreadyEvaluated(true);
                        setTeacherScore(String(evals.advisor.total_score || 0));
                        if (evals.advisor.scores) {
                            setRatings(evals.advisor.scores);
                        }
                    }

                    // คะแนนบริษัท
                    if (evals.supervisor) {
                        setSupervisorScore(evals.supervisor.total_score || 0);
                    }
                } catch {}
            } catch (err) {
                console.error('Failed to fetch:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [studentId]);

    const handleRatingChange = (sectionPrefix: string, index: number, value: number) => {
        setRatings(prev => {
            const updated = { ...prev, [`${sectionPrefix}_${index}`]: value };
            // คำนวณคะแนนรวมจาก ratings อัตโนมัติ
            const ratingTotal = Object.values(updated).reduce((sum, v) => sum + v, 0);
            setTeacherScore(String(ratingTotal));
            return updated;
        });
    };

    const calculateTotalScore = () => {
        const baseScore = 10; // ปฐมนิเทศ 5 + ปัจฉิมนิเทศ 5
        const teacherVal = parseFloat(teacherScore) || 0;
        const supVal = supervisorScore || 0;
        return baseScore + teacherVal + supVal;
    };

    // คำนวณคะแนนแยกหมวด
    const workScore = criteriaSection1.reduce((sum, _, idx) => sum + (ratings[`work_${idx}`] || 0), 0);
    const personScore = criteriaSection2.reduce((sum, _, idx) => sum + (ratings[`person_${idx}`] || 0), 0);

    const handleSave = async () => {
        const score = parseFloat(teacherScore);
        if (!score || score < 0 || score > 40) {
            alert('กรุณากรอกคะแนน (0-40)');
            return;
        }
        setSaving(true);
        try {
            await api.post('/advisor/evaluation', null, {
                params: {
                    internship_id: Number(studentId),
                    total_score: score,
                    scores: JSON.stringify(ratings),
                    overall_comment: `คะแนนรวม: ${score}/40`,
                }
            });
            alert('บันทึกผลการประเมินสำเร็จ');
            navigate('/teacher/students');
        } catch (err: any) {
            alert(err.response?.data?.detail || 'ไม่สามารถบันทึกได้');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64 text-gray-500">กำลังโหลดข้อมูล...</div>;
    }

    const student = studentData?.student || {};
    const internship = studentData?.internship || {};

    return (
        <div className="flex justify-center items-start min-h-screen pt-4 pb-12">
            <div className="bg-white rounded-[40px] p-8 md:p-12 w-full max-w-[1400px] shadow-sm">
                <div className="flex flex-col gap-8 mb-10">
                    <Link to="/teacher/students" className="inline-flex items-center text-gray-400 hover:text-[#4472c4] transition-colors font-medium w-fit group">
                        <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" /> ย้อนกลับไปหน้ารายชื่อ
                    </Link>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 pb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">แบบประเมินผลการฝึกประสบการณ์วิชาชีพ</h1>
                            <p className="text-gray-500 text-lg">ประเมินผลการปฏิบัติงานและคุณลักษณะของนักศึกษา</p>
                        </div>
                    </div>
                </div>

                {/* Student Info Card */}
                <div className="bg-[#F8F9FA] rounded-[30px] p-8 md:p-10 mb-12 border border-blue-50/50 relative overflow-hidden">
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div>
                            <div className="text-gray-500 text-sm mb-1 font-medium">ชื่อ-นามสกุล</div>
                            <div className="text-xl font-bold text-[#032B68]">{student.full_name || '-'}</div>
                            <div className="text-[#4472c4] text-sm font-medium mt-1">{student.student_code || '-'}</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-sm mb-1 font-medium">อีเมล</div>
                            <div className="text-gray-900 font-semibold">{student.email || '-'}</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-sm mb-1 font-medium">ตำแหน่ง</div>
                            <div className="text-gray-900 font-semibold">{internship.job_title || '-'}</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-sm mb-1 font-medium">ชั่วโมงสะสม</div>
                            <div className="text-gray-900 font-semibold">{internship.completed_hours || 0} / {internship.required_hours || 0} ชม.</div>
                        </div>
                    </div>
                </div>

                <div className="space-y-32">
                    {/* Section 1 */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#4472c4] flex items-center justify-center font-bold text-xl">1</div>
                            <h2 className="text-2xl font-bold text-gray-900">ด้านการทำงาน</h2>
                            {workScore > 0 && <span className="ml-auto px-4 py-1 bg-blue-50 text-[#4472c4] rounded-full font-bold text-lg">{workScore}/{criteriaSection1.length * 5}</span>}
                        </div>
                        <p className="text-gray-500 pl-14 text-lg -mt-4 mb-6">คุณภาพงาน การแก้ปัญหา การพัฒนางาน</p>
                        <div className="bg-white rounded-[30px] border border-gray-100 shadow-sm overflow-hidden">
                            {criteriaSection1.map((item, idx) => (
                                <div key={idx} className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                    <div className="text-lg font-medium text-gray-700 md:w-1/2">{item}</div>
                                    <div className="flex items-center gap-3">
                                        {[1, 2, 3, 4, 5].map((score) => (
                                            <button key={score} onClick={() => handleRatingChange('work', idx, score)}
                                                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg font-bold transition-all duration-200 transform hover:scale-105 active:scale-95
                                                    ${ratings[`work_${idx}`] === score ? 'bg-[#4472c4] border-[#4472c4] text-white shadow-md shadow-blue-200' : 'bg-white border-gray-100 text-gray-400 hover:border-blue-200 hover:text-blue-400'}`}>
                                                {score}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#4472c4] flex items-center justify-center font-bold text-xl">2</div>
                            <h2 className="text-2xl font-bold text-gray-900">บุคลิกภาพ มนุษยสัมพันธ์ และวินัย</h2>
                            {personScore > 0 && <span className="ml-auto px-4 py-1 bg-blue-50 text-[#4472c4] rounded-full font-bold text-lg">{personScore}/{criteriaSection2.length * 5}</span>}
                        </div>
                        <p className="text-gray-500 pl-14 text-lg -mt-4 mb-6">การแต่งกาย กิริยามารยาท การตรงต่อเวลา</p>
                        <div className="bg-white rounded-[30px] border border-gray-100 shadow-sm overflow-hidden">
                            {criteriaSection2.map((item, idx) => (
                                <div key={idx} className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                    <div className="text-lg font-medium text-gray-700 md:w-1/2">{item}</div>
                                    <div className="flex items-center gap-3">
                                        {[1, 2, 3, 4, 5].map((score) => (
                                            <button key={score} onClick={() => handleRatingChange('person', idx, score)}
                                                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg font-bold transition-all duration-200 transform hover:scale-105 active:scale-95
                                                    ${ratings[`person_${idx}`] === score ? 'bg-[#4472c4] border-[#4472c4] text-white shadow-md shadow-blue-200' : 'bg-white border-gray-100 text-gray-400 hover:border-blue-200 hover:text-blue-400'}`}>
                                                {score}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary Table */}
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-gray-900 pl-4 border-l-4 border-[#4472c4]">สรุปคะแนนตามเกณฑ์การประเมิน</h2>
                        <div className="bg-white rounded-[30px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
                            <table className="w-full min-w-[800px]">
                                <thead className="bg-[#f8fafc] border-b border-gray-100">
                                    <tr>
                                        <th className="py-6 px-8 text-left font-bold text-gray-700 w-1/4">ผู้ประเมิน</th>
                                        <th className="py-6 px-8 text-left font-bold text-gray-700 w-1/2">รายละเอียด</th>
                                        <th className="py-6 px-8 text-center font-bold text-gray-700">คะแนนเต็ม</th>
                                        <th className="py-6 px-8 text-center font-bold text-gray-700">คะแนนที่ได้</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    <tr className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-6 px-8 font-bold text-gray-800 align-top">1. ผู้นิเทศประจำหน่วยงาน<div className="text-sm font-normal text-gray-400 mt-1">(สถานประกอบการ)</div></td>
                                        <td className="py-6 px-8 text-gray-600">พี่เลี้ยงนักศึกษาฝึกประสบการณ์วิชาชีพ</td>
                                        <td className="py-6 px-8 text-center font-bold text-gray-400">50</td>
                                        <td className="py-6 px-8 text-center">
                                            {supervisorScore !== null ? (
                                                <span className="inline-block px-4 py-1 bg-green-50 text-green-700 rounded-lg font-bold text-xl">{supervisorScore}</span>
                                            ) : (
                                                <span className="font-bold text-gray-300 text-xl">ยังไม่ประเมิน</span>
                                            )}
                                        </td>
                                    </tr>
                                    <tr className="bg-[#4472c4]/5">
                                        <td className="py-6 px-8 font-bold text-[#032B68] align-top">2. อาจารย์นิเทศ</td>
                                        <td className="py-6 px-8 text-gray-700 font-medium">การนิเทศนักศึกษาฝึกประสบการณ์วิชาชีพ</td>
                                        <td className="py-6 px-8 text-center font-bold text-[#032B68]">40</td>
                                        <td className="py-6 px-8 text-center">
                                            <input type="number" value={teacherScore} readOnly className="w-24 text-center py-2 px-3 border-2 border-[#4472c4]/20 rounded-xl font-bold text-[#032B68] text-xl bg-blue-50 cursor-not-allowed outline-none" placeholder="0" />
                                        </td>
                                    </tr>
                                    <tr><td className="py-6 px-8 font-bold text-gray-800">3. หัวหน้าศูนย์ฝึกฯ</td><td className="py-6 px-8 text-gray-600">การเข้าร่วมกิจกรรมปฐมนิเทศ</td><td className="py-6 px-8 text-center font-bold text-gray-600">5</td><td className="py-6 px-8 text-center"><span className="inline-block px-4 py-1 bg-green-50 text-green-700 rounded-lg font-bold">5</span></td></tr>
                                    <tr><td className="py-6 px-8 font-bold text-gray-800">4. กรรมการศูนย์ฝึกฯ</td><td className="py-6 px-8 text-gray-600">การเข้าร่วมกิจกรรมปัจฉิมนิเทศ</td><td className="py-6 px-8 text-center font-bold text-gray-600">5</td><td className="py-6 px-8 text-center"><span className="inline-block px-4 py-1 bg-green-50 text-green-700 rounded-lg font-bold">5</span></td></tr>
                                </tbody>
                                <tfoot className="bg-gray-50/80 border-t border-gray-100">
                                    <tr><td colSpan={2} className="py-6 px-8 font-bold text-gray-900 text-lg">รวมคะแนนทั้งหมด</td><td className="py-6 px-8 text-center font-bold text-gray-900 text-lg">100</td><td className="py-6 px-8 text-center"><span className="font-bold text-[#2E5A9B] text-2xl">{calculateTotalScore()}</span></td></tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Signature */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 pl-4 border-l-4 border-[#4472c4]">ลายเซ็นรับรองผลการประเมิน</h2>
                        <div className="bg-[#f8fafc] rounded-[30px] p-10 flex flex-col items-center border border-dashed border-gray-300">
                            <label className="text-xl font-bold text-gray-900 mb-6">ลายเซ็นอาจารย์นิเทศ</label>
                            <div className="w-full max-w-[500px] h-48 bg-white rounded-2xl border-2 border-[#E2E8F0] mb-8 relative shadow-inner flex items-center justify-center">
                                <span className="text-gray-300 font-medium text-lg">พื้นที่สำหรับเซ็นชื่อ</span>
                            </div>
                            <div className="flex flex-wrap justify-center gap-4">
                                <button className="px-8 py-3 rounded-full border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 flex items-center gap-2"><RotateCcw size={18} /> ล้างลายเซ็น</button>
                                <button className="px-8 py-3 rounded-full bg-white border-2 border-[#4472c4] text-[#4472c4] font-bold hover:bg-blue-50 shadow-sm flex items-center gap-2"><Upload size={18} /> อัปโหลดลายเซ็น</button>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col sm:flex-row items-center justify-end gap-6 pt-8 border-t border-gray-100">
                        {alreadyEvaluated && (
                            <div className="flex-1 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 font-bold text-center">
                                ประเมินนักศึกษาคนนี้แล้ว (คะแนน {teacherScore}/40) — กำลังแสดงคะแนนที่บันทึกไว้
                            </div>
                        )}
                        <button onClick={handleSave} disabled={saving || alreadyEvaluated} className="w-full sm:w-auto px-12 py-4 bg-[#5DC139] hover:bg-[#4ea82e] disabled:bg-gray-400 text-white text-xl font-bold rounded-[20px] shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3">
                            <Save size={24} /> {alreadyEvaluated ? 'ประเมินแล้ว' : saving ? 'กำลังบันทึก...' : 'บันทึกผลการประเมิน'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EvaluationPage;
