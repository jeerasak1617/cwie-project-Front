import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';

const TeacherVerifyExperiencePage = () => {
    const { studentId } = useParams();
    const [experiences, setExperiences] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [reviewingId, setReviewingId] = useState<number | null>(null);

    useEffect(() => { loadExperiences(); }, [studentId]);

    const loadExperiences = async () => {
        setLoading(true);
        try { const res = await api.get(`/advisor/experiences/${studentId}`); setExperiences(res.data.experiences || []); } catch {} finally { setLoading(false); }
    };

    const handleReview = async (expId: number) => {
        if (!comment.trim()) return;
        try { await api.post(`/advisor/experiences/${expId}/review`, null, { params: { comment: comment.trim() } }); setComment(''); setReviewingId(null); loadExperiences(); } catch {}
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString('th-TH', { weekday: 'short', day: 'numeric', month: 'short' });

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-2xl font-bold text-[#032B68] mb-6">ตรวจประสบการณ์</h1>
            {loading ? <div className="text-center py-12 text-gray-400">กำลังโหลด...</div> : experiences.length === 0 ? <div className="text-center py-12 text-gray-400">ยังไม่มีประสบการณ์</div> : (
                <div className="space-y-4">
                    {experiences.map((exp: any) => (
                        <div key={exp.id} className="bg-white rounded-2xl p-6 shadow-md">
                            <div className="flex justify-between items-start mb-3">
                                <div><span className="text-[#4472c4] font-bold">{formatDate(exp.experience_date)}</span><h3 className="text-lg font-bold text-gray-800 mt-1">{exp.topic}</h3></div>
                                {exp.advisor_comment ? <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600">ตรวจแล้ว</span> : <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-50 text-yellow-600">รอตรวจ</span>}
                            </div>
                            {exp.description && <p className="text-gray-600 text-sm mb-2">{exp.description}</p>}
                            {exp.skills_learned && <p className="text-gray-600 text-sm"><strong>ทักษะ:</strong> {exp.skills_learned}</p>}
                            {exp.advisor_comment && <p className="text-blue-600 text-sm mt-3"><strong>ความเห็น:</strong> {exp.advisor_comment}</p>}
                            {!exp.advisor_comment && (
                                reviewingId === exp.id ? (
                                    <div className="mt-3 flex gap-2">
                                        <input value={comment} onChange={e => setComment(e.target.value)} placeholder="ความเห็น..." className="flex-1 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:border-[#4472c4]" />
                                        <button onClick={() => handleReview(exp.id)} className="px-4 py-2 bg-[#5cc945] text-white rounded-full font-bold text-sm">บันทึก</button>
                                        <button onClick={() => setReviewingId(null)} className="px-4 py-2 bg-gray-200 text-gray-600 rounded-full font-bold text-sm">ยกเลิก</button>
                                    </div>
                                ) : <button onClick={() => setReviewingId(exp.id)} className="mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-bold hover:bg-blue-100">ตรวจ + ให้ความเห็น</button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeacherVerifyExperiencePage;
