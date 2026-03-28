import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, ChevronLeft, Save, User } from 'lucide-react';
import api from '../../api';

const AdminEvaluationPage = () => {
    const [internships, setInternships] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIntern, setSelectedIntern] = useState<any>(null);
    const [msg, setMsg] = useState('');
    const [orientationScore, setOrientationScore] = useState<number | null>(null);
    const [debriefingScore, setDebriefingScore] = useState<number | null>(null);
    const [oriSaved, setOriSaved] = useState(false);
    const [debSaved, setDebSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await api.get('/admin/internships');
                setInternships(data.internships || []);
            } catch {} finally { setLoading(false); }
        };
        fetchData();
    }, []);

    const handleSelect = async (intern: any) => {
        setSelectedIntern(intern);
        setOrientationScore(null); setDebriefingScore(null);
        setOriSaved(false); setDebSaved(false); setMsg('');
        try {
            const { data } = await api.get(`/admin/evaluation/${intern.id}`);
            const evals = data.evaluations || {};
            if (evals.orientation) { setOrientationScore(evals.orientation.score); setOriSaved(true); }
            if (evals.debriefing) { setDebriefingScore(evals.debriefing.score); setDebSaved(true); }
        } catch {}
    };

    const handleSave = async (type: string) => {
        const score = type === 'orientation' ? orientationScore : debriefingScore;
        if (score === null) { setMsg('กรุณาเลือกคะแนน'); return; }
        setSaving(true);
        try {
            await api.post('/admin/evaluation', { internship_id: selectedIntern.id, evaluation_type: type, score });
            setMsg(`ให้คะแนน${type === 'orientation' ? 'ปฐมนิเทศ' : 'ปัจฉิมนิเทศ'}สำเร็จ`);
            if (type === 'orientation') setOriSaved(true);
            else setDebSaved(true);
            setTimeout(() => setMsg(''), 3000);
        } catch (e: any) { setMsg(e.response?.data?.detail || 'เกิดข้อผิดพลาด'); }
        finally { setSaving(false); }
    };

    if (loading) return <div className="text-center py-20 text-gray-400">กำลังโหลด...</div>;

    // ถ้ายังไม่เลือกนักศึกษา → แสดงรายชื่อ
    if (!selectedIntern) {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">ประเมินปฐมนิเทศ / ปัจฉิมนิเทศ</h1>
                    <p className="text-gray-500 mt-1">เลือกนักศึกษาเพื่อให้คะแนน ({internships.length} คน)</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b"><tr>
                            <th className="py-4 px-6 text-left font-bold text-gray-600">นักศึกษา</th>
                            <th className="py-4 px-6 text-left font-bold text-gray-600">บริษัท</th>
                            <th className="py-4 px-6 text-center font-bold text-gray-600">ปฐมนิเทศ</th>
                            <th className="py-4 px-6 text-center font-bold text-gray-600">ปัจฉิมนิเทศ</th>
                        </tr></thead>
                        <tbody className="divide-y divide-gray-50">
                            {internships.map(i => (
                                <tr key={i.id} onClick={() => handleSelect(i)} className="hover:bg-blue-50 cursor-pointer transition-colors">
                                    <td className="py-4 px-6"><div className="font-bold text-gray-900">{i.student_name}</div><div className="text-sm text-gray-500">{i.student_code}</div></td>
                                    <td className="py-4 px-6 text-gray-600">{i.company_name}</td>
                                    <td className="py-4 px-6 text-center">{i.orientation_attended ? <span className="text-green-600 font-bold">✓</span> : <span className="text-gray-300">—</span>}</td>
                                    <td className="py-4 px-6 text-center">{i.debriefing_attended ? <span className="text-green-600 font-bold">✓</span> : <span className="text-gray-300">—</span>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // เลือกนักศึกษาแล้ว → แสดงหน้าประเมิน (UI เหมือนอาจารย์)
    return (
        <div className="flex justify-center items-start min-h-screen pt-4 pb-12">
            <div className="bg-white rounded-[40px] p-8 md:p-12 w-full max-w-[1400px] shadow-sm">
                <div className="flex flex-col gap-8 mb-10">
                    <button onClick={() => setSelectedIntern(null)} className="inline-flex items-center text-gray-400 hover:text-[#4472c4] transition-colors font-medium w-fit group">
                        <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" /> ย้อนกลับไปรายชื่อ
                    </button>
                    <div className="border-b border-gray-100 pb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">แบบประเมินปฐมนิเทศ / ปัจฉิมนิเทศ</h1>
                        <p className="text-gray-500 text-lg">ให้คะแนนการเข้าร่วมกิจกรรมของนักศึกษา (เต็ม 5 คะแนนต่อรายการ)</p>
                    </div>
                </div>

                {/* Student Info Card */}
                <div className="bg-[#F8F9FA] rounded-[30px] p-8 md:p-10 mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="text-gray-500 text-sm mb-1">ชื่อ-นามสกุล</div>
                            <div className="text-xl font-bold text-[#032B68]">{selectedIntern.student_name}</div>
                            <div className="text-[#4472c4] text-sm mt-1">{selectedIntern.student_code}</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-sm mb-1">บริษัท</div>
                            <div className="text-gray-900 font-semibold">{selectedIntern.company_name}</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-sm mb-1">ระยะเวลาฝึก</div>
                            <div className="text-gray-900 font-semibold">{selectedIntern.start_date ? `${new Date(selectedIntern.start_date).toLocaleDateString('th-TH')} — ${selectedIntern.end_date ? new Date(selectedIntern.end_date).toLocaleDateString('th-TH') : '-'}` : '-'}</div>
                        </div>
                    </div>
                </div>

                {msg && <div className={`mb-6 p-3 rounded-xl text-center font-bold ${msg.includes('สำเร็จ') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{msg}</div>}

                <div className="space-y-16">
                    {/* Section 3: ปฐมนิเทศ */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#4472c4] flex items-center justify-center font-bold text-xl">3</div>
                            <h2 className="text-2xl font-bold text-gray-900">หัวหน้าศูนย์ฝึกฯ — ปฐมนิเทศ</h2>
                            {oriSaved && <span className="ml-auto px-4 py-1 bg-green-50 text-green-700 rounded-full font-bold">ให้คะแนนแล้ว ({orientationScore}/5)</span>}
                        </div>
                        <p className="text-gray-500 pl-14 text-lg -mt-4 mb-6">การเข้าร่วมกิจกรรมปฐมนิเทศ</p>
                        <div className="bg-white rounded-[30px] border border-gray-100 shadow-sm p-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="text-lg font-medium text-gray-700">การเข้าร่วมกิจกรรมปฐมนิเทศ (เต็ม 5 คะแนน)</div>
                                <div className="flex items-center gap-3">
                                    {[0, 1, 2, 3, 4, 5].map(v => (
                                        <button key={v} onClick={() => !oriSaved && setOrientationScore(v)}
                                            className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-xl font-bold transition-all ${orientationScore === v ? 'bg-[#4472c4] border-[#4472c4] text-white shadow-md shadow-blue-200' : 'bg-white border-gray-100 text-gray-400 hover:border-blue-200'}`}>
                                            {v}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end mt-6">
                                <button onClick={() => handleSave('orientation')} disabled={saving || oriSaved}
                                    className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 ${oriSaved ? 'bg-green-100 text-green-700' : 'bg-[#5DC139] hover:bg-[#4ea82e] text-white shadow-md'}`}>
                                    <Save size={20} /> {oriSaved ? 'บันทึกแล้ว' : 'บันทึกคะแนนปฐมนิเทศ'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: ปัจฉิมนิเทศ */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#4472c4] flex items-center justify-center font-bold text-xl">4</div>
                            <h2 className="text-2xl font-bold text-gray-900">กรรมการศูนย์ฝึกฯ — ปัจฉิมนิเทศ</h2>
                            {debSaved && <span className="ml-auto px-4 py-1 bg-green-50 text-green-700 rounded-full font-bold">ให้คะแนนแล้ว ({debriefingScore}/5)</span>}
                        </div>
                        <p className="text-gray-500 pl-14 text-lg -mt-4 mb-6">การเข้าร่วมกิจกรรมปัจฉิมนิเทศ</p>
                        <div className="bg-white rounded-[30px] border border-gray-100 shadow-sm p-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="text-lg font-medium text-gray-700">การเข้าร่วมกิจกรรมปัจฉิมนิเทศ (เต็ม 5 คะแนน)</div>
                                <div className="flex items-center gap-3">
                                    {[0, 1, 2, 3, 4, 5].map(v => (
                                        <button key={v} onClick={() => !debSaved && setDebriefingScore(v)}
                                            className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-xl font-bold transition-all ${debriefingScore === v ? 'bg-[#4472c4] border-[#4472c4] text-white shadow-md shadow-blue-200' : 'bg-white border-gray-100 text-gray-400 hover:border-blue-200'}`}>
                                            {v}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end mt-6">
                                <button onClick={() => handleSave('debriefing')} disabled={saving || debSaved}
                                    className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 ${debSaved ? 'bg-green-100 text-green-700' : 'bg-[#5DC139] hover:bg-[#4ea82e] text-white shadow-md'}`}>
                                    <Save size={20} /> {debSaved ? 'บันทึกแล้ว' : 'บันทึกคะแนนปัจฉิมนิเทศ'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-gray-900 pl-4 border-l-4 border-[#4472c4]">สรุปคะแนน</h2>
                        <div className="bg-white rounded-[30px] border border-gray-100 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-[#f8fafc] border-b"><tr><th className="py-5 px-8 text-left">รายการ</th><th className="py-5 px-8 text-center">เต็ม</th><th className="py-5 px-8 text-center">ได้</th></tr></thead>
                                <tbody>
                                    <tr className="border-b border-gray-50"><td className="py-5 px-8 font-bold">3. ปฐมนิเทศ</td><td className="py-5 px-8 text-center font-bold">5</td><td className="py-5 px-8 text-center">{oriSaved ? <span className="px-4 py-1 bg-green-50 text-green-700 rounded-lg font-bold text-xl">{orientationScore}</span> : <span className="text-gray-300">—</span>}</td></tr>
                                    <tr className="border-b border-gray-50"><td className="py-5 px-8 font-bold">4. ปัจฉิมนิเทศ</td><td className="py-5 px-8 text-center font-bold">5</td><td className="py-5 px-8 text-center">{debSaved ? <span className="px-4 py-1 bg-green-50 text-green-700 rounded-lg font-bold text-xl">{debriefingScore}</span> : <span className="text-gray-300">—</span>}</td></tr>
                                </tbody>
                                <tfoot className="bg-gray-50 border-t"><tr><td className="py-5 px-8 font-bold text-lg">รวม</td><td className="py-5 px-8 text-center font-bold text-lg">10</td><td className="py-5 px-8 text-center font-bold text-[#2E5A9B] text-2xl">{(orientationScore || 0) + (debriefingScore || 0)}</td></tr></tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminEvaluationPage;
