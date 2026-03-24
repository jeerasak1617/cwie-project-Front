import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ChevronLeft } from 'lucide-react';
import api from '../../api';

const CompanyEvaluationDetailPage = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const criteria = [
        "คุณภาพของงาน", "ปริมาณงานที่ทำได้", "ความรู้ความสามารถในงาน", "ความคิดริเริ่มสร้างสรรค์",
        "ความรับผิดชอบ", "การตรงต่อเวลา", "มนุษยสัมพันธ์", "การปฏิบัติตามกฎระเบียบ",
        "การปรับตัวเข้ากับงาน", "บุคลิกภาพและการแต่งกาย",
    ];

    const [scores, setScores] = useState<number[]>(criteria.map(() => 3));
    const [comment, setComment] = useState('');

    const handleScore = (idx: number, val: number) => { const n = [...scores]; n[idx] = val; setScores(n); };
    const totalScore = scores.reduce((a, b) => a + b, 0);
    const maxScore = 50;

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await api.post('/supervisor/evaluation', null, {
                params: {
                    internship_id: parseInt(studentId || '0'),
                    total_score: totalScore,
                    max_possible_score: maxScore,
                    overall_comment: comment.trim() || undefined,
                    scores_json: JSON.stringify(criteria.map((c, i) => ({ criteria: c, score: scores[i] }))),
                }
            });
            setMessage('ส่งผลประเมินสำเร็จ!');
            setTimeout(() => navigate('/company/evaluation'), 1500);
        } catch (e: any) { setMessage(e.response?.data?.detail || 'เกิดข้อผิดพลาด'); }
        finally { setLoading(false); }
    };

    return (
        <div className="p-4 md:p-8">
            <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[#4472c4] font-bold mb-4 hover:underline"><ChevronLeft size={20} />กลับ</button>
            <h1 className="text-2xl font-bold text-[#032B68] mb-8">ประเมินนักศึกษา (พี่เลี้ยง 50 คะแนน)</h1>
            {message && <div className={`mb-4 p-3 rounded-xl text-center font-bold ${message.includes('สำเร็จ') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{message}</div>}
            <div className="bg-white rounded-2xl p-6 shadow-md">
                <div className="space-y-4 mb-8">
                    {criteria.map((c, i) => (
                        <div key={i} className="flex justify-between items-center py-3 border-b border-gray-50">
                            <span className="text-gray-800 font-medium">{i + 1}. {c}</span>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(v => (
                                    <button key={v} onClick={() => handleScore(i, v)} className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${scores[i] === v ? 'bg-[#032B68] text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{v}</button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-blue-50 rounded-2xl p-6 mb-6 text-center">
                    <span className="text-2xl font-bold text-[#032B68]">คะแนนรวม: {totalScore} / {maxScore}</span>
                </div>
                <div className="mb-8">
                    <label className="text-gray-900 font-bold block mb-2">ความเห็นเพิ่มเติม</label>
                    <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} placeholder="ความเห็นโดยรวม..." className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none font-medium" />
                </div>
                <div className="flex justify-end">
                    <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#5cc945] disabled:bg-gray-400 text-white font-bold shadow-lg transition-all hover:-translate-y-1"><Save size={20} />{loading ? 'กำลังส่ง...' : 'ส่งผลประเมิน'}</button>
                </div>
            </div>
        </div>
    );
};

export default CompanyEvaluationDetailPage;
