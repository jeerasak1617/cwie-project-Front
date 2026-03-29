import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Save, ChevronLeft } from 'lucide-react';
import api from '../../api';

const CompanyEvaluationDetailPage = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [studentInfo, setStudentInfo] = useState<any>(null);
    const [ratings, setRatings] = useState<{ [key: string]: number }>({});
    const [mentorScore, setMentorScore] = useState('');
    const [alreadyEvaluated, setAlreadyEvaluated] = useState(false);

    const criteriaWork = [
        "ทำงานถูกต้องและผลงานมีคุณภาพ",
        "การแก้ไขปัญหาและการตัดสินใจ",
        "เอาใจใส่ต่อการใช้อุปกรณ์และต่อความปลอดภัย",
        "มีการพัฒนางาน มีความคิดริเริ่ม",
        "มีความขยันและรับผิดชอบต่อการทำงาน",
    ];
    const criteriaPerson = [
        "แต่งกายสะอาด สุภาพเรียบร้อย",
        "กิริยาวาจาเหมาะสมกับกาละเทศะ",
        "มีมนุษยสัมพันธ์ และใฝ่รู้",
        "ตรงต่อเวลา",
        "ซื่อสัตย์และมีน้ำใจ",
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await api.get('/supervisor/students');
                const found = (data.students || []).find((s: any) => s.internship_id === Number(studentId));
                setStudentInfo(found);
                try {
                    const evalRes = await api.get(`/supervisor/evaluation/${studentId}`);
                    if (evalRes.data.evaluation) {
                        setAlreadyEvaluated(true);
                        setMentorScore(String(evalRes.data.evaluation.total_score || 0));
                        if (evalRes.data.evaluation.scores) setRatings(evalRes.data.evaluation.scores);
                    }
                } catch {}
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchData();
    }, [studentId]);

    const handleRating = (prefix: string, idx: number, val: number) => {
        if (alreadyEvaluated) return;
        setRatings(prev => {
            const updated = { ...prev, [`${prefix}_${idx}`]: val };
            const total = Object.values(updated).reduce((s, v) => s + v, 0);
            setMentorScore(String(total));
            return updated;
        });
    };

    const workScore = criteriaWork.reduce((s, _, i) => s + (ratings[`work_${i}`] || 0), 0);
    const personScore = criteriaPerson.reduce((s, _, i) => s + (ratings[`person_${i}`] || 0), 0);

    const handleSave = async () => {
        const score = parseFloat(mentorScore);
        if (!score || score < 0 || score > 50) { alert('กรุณาให้คะแนนให้ครบ'); return; }
        setSaving(true);
        try {
            await api.post('/supervisor/evaluation', null, {
                params: { internship_id: Number(studentId), total_score: score, scores: JSON.stringify(ratings), overall_comment: `คะแนนรวม: ${score}/50` }
            });
            alert('บันทึกผลการประเมินสำเร็จ');
            navigate('/company/evaluation');
        } catch (err: any) { alert(err.response?.data?.detail || 'ไม่สามารถบันทึกได้'); }
        finally { setSaving(false); }
    };

    if (loading) return <div className="flex justify-center items-center h-64 text-gray-500">กำลังโหลด...</div>;
    const s = studentInfo || {};

    const RatingRow = ({ label, prefix, idx }: { label: string; prefix: string; idx: number }) => (
        <tr className="border-b border-gray-50 hover:bg-gray-50/50">
            <td className="py-5 px-8 text-gray-700 font-medium">• {label}</td>
            <td className="py-5 px-8 text-center font-bold text-gray-400">5</td>
            <td className="py-5 px-8"><div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map(v => (
                    <button key={v} onClick={() => handleRating(prefix, idx, v)}
                        className={`w-11 h-11 rounded-full border-2 font-bold transition-all ${ratings[`${prefix}_${idx}`] === v ? 'bg-[#4472c4] border-[#4472c4] text-white shadow-md' : 'bg-white border-gray-100 text-gray-400 hover:border-blue-200'}`}>{v}</button>
                ))}
            </div></td>
        </tr>
    );

    return (
        <div className="flex justify-center items-start min-h-screen pt-4 pb-12">
            <div className="bg-white rounded-[40px] p-8 md:p-12 w-full max-w-[1400px] shadow-sm">
                <div className="flex flex-col gap-8 mb-10">
                    <Link to="/company/evaluation" className="inline-flex items-center text-gray-400 hover:text-[#4472c4] font-medium w-fit group"><ChevronLeft size={20} className="mr-1" /> ย้อนกลับ</Link>
                    <div className="border-b border-gray-100 pb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">แบบประเมินผลการฝึกประสบการณ์วิชาชีพ</h1>
                        <p className="text-gray-500 text-lg">ประเมินโดยพี่เลี้ยง/ผู้นิเทศประจำหน่วยงาน (50 คะแนน)</p>
                    </div>
                </div>

                <div className="bg-[#F8F9FA] rounded-[30px] p-8 mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div><div className="text-gray-500 text-sm mb-1">ชื่อ-นามสกุล</div><div className="text-xl font-bold text-[#032B68]">{s.full_name || '-'}</div><div className="text-[#4472c4] text-sm mt-1">{s.student_code || '-'}</div></div>
                        <div><div className="text-gray-500 text-sm mb-1">ชั่วโมงสะสม</div><div className="text-gray-900 font-semibold">{s.completed_hours || 0} / {s.required_hours || 450} ชม.</div></div>
                        <div><div className="text-gray-500 text-sm mb-1">ภาคเรียน</div><div className="text-gray-900 font-semibold">{s.semester || `${s.start_date ? new Date(s.start_date).toLocaleDateString('th-TH') : '-'} - ${s.end_date ? new Date(s.end_date).toLocaleDateString('th-TH') : '-'}`}</div></div>
                    </div>
                </div>

                {alreadyEvaluated && <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-2xl text-center text-green-700 font-bold">ประเมินเรียบร้อยแล้ว (คะแนนรวม: {mentorScore}/50)</div>}

                {/* ด้านการทำงาน */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-6"><div className="w-10 h-10 rounded-full bg-blue-50 text-[#4472c4] flex items-center justify-center font-bold text-xl">1</div><h2 className="text-2xl font-bold text-gray-900">ด้านการทำงาน</h2><span className="ml-auto text-lg font-bold text-[#4472c4]">{workScore}/25</span></div>
                    <div className="bg-white rounded-[30px] border border-gray-100 overflow-hidden">
                        <table className="w-full"><thead className="bg-[#f8fafc] border-b"><tr><th className="py-4 px-8 text-left font-bold text-gray-600">เกณฑ์การประเมิน</th><th className="py-4 px-8 text-center font-bold text-gray-600 w-24">เต็ม</th><th className="py-4 px-8 text-center font-bold text-gray-600 w-64">คะแนนที่ได้</th></tr></thead>
                        <tbody>
                            {criteriaWork.map((c, i) => <RatingRow key={i} label={c} prefix="work" idx={i} />)}
                        </tbody></table>
                    </div>
                </div>

                {/* ด้านบุคลิกภาพ */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-6"><div className="w-10 h-10 rounded-full bg-blue-50 text-[#4472c4] flex items-center justify-center font-bold text-xl">2</div><h2 className="text-2xl font-bold text-gray-900">ด้านบุคลิกภาพ</h2><span className="ml-auto text-lg font-bold text-[#4472c4]">{personScore}/25</span></div>
                    <div className="bg-white rounded-[30px] border border-gray-100 overflow-hidden">
                        <table className="w-full"><thead className="bg-[#f8fafc] border-b"><tr><th className="py-4 px-8 text-left font-bold text-gray-600">เกณฑ์การประเมิน</th><th className="py-4 px-8 text-center font-bold text-gray-600 w-24">เต็ม</th><th className="py-4 px-8 text-center font-bold text-gray-600 w-64">คะแนนที่ได้</th></tr></thead>
                        <tbody>
                            {criteriaPerson.map((c, i) => <RatingRow key={i} label={c} prefix="person" idx={i} />)}
                        </tbody></table>
                    </div>
                </div>

                {/* สรุป */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 pl-4 border-l-4 border-[#4472c4] mb-6">สรุปคะแนน</h2>
                    <div className="bg-white rounded-[30px] border border-gray-100 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-[#f8fafc] border-b"><tr><th className="py-5 px-8 text-left">ผู้ประเมิน</th><th className="py-5 px-8 text-left">รายละเอียด</th><th className="py-5 px-8 text-center">คะแนนเต็ม</th><th className="py-5 px-8 text-center">คะแนนที่ได้</th></tr></thead>
                            <tbody>
                                <tr className="border-b border-gray-50 bg-blue-50/30"><td className="py-5 px-8 font-bold text-[#032B68]">1. ผู้นิเทศประจำหน่วยงาน<br/><span className="text-sm text-gray-400 font-normal">(สถานประกอบการ)</span></td><td className="py-5 px-8 text-gray-600">พี่เลี้ยงนักศึกษาฝึกประสบการณ์วิชาชีพ</td><td className="py-5 px-8 text-center font-bold">50</td><td className="py-5 px-8 text-center"><span className="px-4 py-1 bg-blue-50 text-[#4472c4] rounded-lg font-bold text-xl">{mentorScore || 0}</span></td></tr>
                                <tr className="border-b border-gray-50"><td className="py-5 px-8 font-bold">2. อาจารย์นิเทศ</td><td className="py-5 px-8 text-gray-600">การนิเทศนักศึกษาฝึกประสบการณ์วิชาชีพ</td><td className="py-5 px-8 text-center font-bold">40</td><td className="py-5 px-8 text-center"><span className="text-gray-300">อาจารย์ให้คะแนน</span></td></tr>
                                <tr className="border-b border-gray-50"><td className="py-5 px-8 font-bold">3. หัวหน้าศูนย์ฝึกฯ</td><td className="py-5 px-8 text-gray-600">การเข้าร่วมกิจกรรมปฐมนิเทศ</td><td className="py-5 px-8 text-center font-bold">5</td><td className="py-5 px-8 text-center"><span className="text-gray-300">Admin ให้คะแนน</span></td></tr>
                                <tr className="border-b border-gray-50"><td className="py-5 px-8 font-bold">4. กรรมการศูนย์ฝึกฯ</td><td className="py-5 px-8 text-gray-600">การเข้าร่วมกิจกรรมปัจฉิมนิเทศ</td><td className="py-5 px-8 text-center font-bold">5</td><td className="py-5 px-8 text-center"><span className="text-gray-300">Admin ให้คะแนน</span></td></tr>
                            </tbody>
                            <tfoot className="bg-gray-50 border-t"><tr><td colSpan={2} className="py-5 px-8 font-bold text-lg">รวมคะแนนทั้งหมด</td><td className="py-5 px-8 text-center font-bold text-lg">100</td><td className="py-5 px-8 text-center font-bold text-[#2E5A9B] text-2xl">{mentorScore || 0}</td></tr></tfoot>
                        </table>
                    </div>
                </div>

                {!alreadyEvaluated && (
                    <div className="flex justify-end"><button onClick={handleSave} disabled={saving} className="px-12 py-4 bg-[#5DC139] hover:bg-[#4ea82e] text-white text-xl font-bold rounded-[20px] shadow-md flex items-center gap-2"><Save size={24} /> {saving ? 'กำลังบันทึก...' : 'บันทึกผลประเมิน'}</button></div>
                )}
            </div>
        </div>
    );
};
export default CompanyEvaluationDetailPage;
