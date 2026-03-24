import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import api from '../../api';

const SupervisionRecordPage = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [results, setResults] = useState('');
    const [suggestions, setSuggestions] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSave = async () => {
        if (!results.trim()) { setMessage('กรุณากรอกผลการนิเทศ'); return; }
        setLoading(true);
        try {
            await api.post('/advisor/visit-report', null, {
                params: { internship_id: parseInt(studentId || '0'), results: results.trim(), suggestions: suggestions.trim() || undefined }
            });
            setMessage('บันทึกผลนิเทศสำเร็จ!');
            setTimeout(() => navigate('/teacher'), 1500);
        } catch (e: any) { setMessage(e.response?.data?.detail || 'เกิดข้อผิดพลาด'); }
        finally { setLoading(false); }
    };

    return (
        <div className="flex items-center justify-center">
            <div className="bg-white rounded-[3rem] p-6 md:p-12 w-full max-w-5xl shadow-2xl">
                <h1 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-8">บันทึกผลนิเทศ</h1>
                {message && <div className={`mb-4 p-3 rounded-xl text-center font-bold ${message.includes('สำเร็จ') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{message}</div>}
                <div className="space-y-6">
                    <div>
                        <label className="text-gray-900 font-bold block mb-2">ผลการนิเทศ *</label>
                        <textarea value={results} onChange={e => setResults(e.target.value)} rows={5} placeholder="สรุปผลการนิเทศ..." className="w-full px-5 py-4 rounded-2xl border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none font-medium" />
                    </div>
                    <div>
                        <label className="text-gray-900 font-bold block mb-2">ข้อเสนอแนะ</label>
                        <textarea value={suggestions} onChange={e => setSuggestions(e.target.value)} rows={3} placeholder="ข้อเสนอแนะเพิ่มเติม..." className="w-full px-5 py-4 rounded-2xl border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none font-medium" />
                    </div>
                </div>
                <div className="flex justify-end mt-10">
                    <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#5cc945] disabled:bg-gray-400 text-white font-bold shadow-lg transition-all hover:-translate-y-1"><Save size={20} />{loading ? 'กำลังบันทึก...' : 'บันทึกผลนิเทศ'}</button>
                </div>
            </div>
        </div>
    );
};

export default SupervisionRecordPage;
