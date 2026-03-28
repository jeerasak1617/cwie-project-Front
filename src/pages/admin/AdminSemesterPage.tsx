import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Check, Star } from 'lucide-react';
import api from '../../api';

const AdminSemesterPage = () => {
    const [semesters, setSemesters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [msg, setMsg] = useState('');
    const [form, setForm] = useState({
        term: '1', year: String(new Date().getFullYear() + 543),
        start_date: '', end_date: '', internship_start: '', internship_end: '', is_current: false,
    });

    const fetchSemesters = async () => {
        try {
            const { data } = await api.get('/admin/semesters');
            setSemesters(data.semesters || []);
        } catch {} finally { setLoading(false); }
    };
    useEffect(() => { fetchSemesters(); }, []);

    const resetForm = () => {
        setForm({ term: '1', year: String(new Date().getFullYear() + 543), start_date: '', end_date: '', internship_start: '', internship_end: '', is_current: false });
        setEditId(null); setShowForm(false);
    };

    const handleEdit = (s: any) => {
        setForm({
            term: String(s.term), year: String(s.year),
            start_date: s.start_date || '', end_date: s.end_date || '',
            internship_start: s.internship_start || '', internship_end: s.internship_end || '',
            is_current: s.is_current || false,
        });
        setEditId(s.id); setShowForm(true);
    };

    const handleSave = async () => {
        setMsg('');
        try {
            if (editId) {
                await api.put(`/admin/semesters/${editId}`, form);
                setMsg('อัปเดตภาคเรียนสำเร็จ');
            } else {
                await api.post('/admin/semesters', form);
                setMsg('สร้างภาคเรียนสำเร็จ');
            }
            resetForm(); fetchSemesters();
            setTimeout(() => setMsg(''), 3000);
        } catch (e: any) { setMsg(e.response?.data?.detail || 'เกิดข้อผิดพลาด'); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('ยืนยันลบภาคเรียนนี้?')) return;
        try {
            await api.delete(`/admin/semesters/${id}`);
            fetchSemesters(); setMsg('ลบสำเร็จ');
            setTimeout(() => setMsg(''), 3000);
        } catch (e: any) { setMsg(e.response?.data?.detail || 'ลบไม่สำเร็จ'); }
    };

    const handleUpdateHours = async () => {
        if (!confirm('ยืนยันเปลี่ยนชั่วโมงฝึกงานจาก 560 → 450 ทั้งหมด?')) return;
        try {
            const { data } = await api.put('/admin/internships/update-hours');
            setMsg(data.message);
            setTimeout(() => setMsg(''), 5000);
        } catch (e: any) { setMsg(e.response?.data?.detail || 'เกิดข้อผิดพลาด'); }
    };

    const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium";

    if (loading) return <div className="text-center py-20 text-gray-400">กำลังโหลด...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">จัดการภาคเรียน</h1>
                    <p className="text-gray-500 mt-1">ตั้งค่าภาคเรียนและระยะเวลาฝึกงาน</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleUpdateHours} className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-all flex items-center gap-2">
                        560 → 450 ชม.
                    </button>
                    <button onClick={() => { resetForm(); setShowForm(true); }} className="px-5 py-2.5 bg-[#4472c4] hover:bg-[#3561b3] text-white rounded-xl font-bold transition-all flex items-center gap-2">
                        <Plus size={20} /> เพิ่มภาคเรียน
                    </button>
                </div>
            </div>

            {msg && <div className={`mb-6 p-3 rounded-xl text-center font-bold ${msg.includes('สำเร็จ') ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>{msg}</div>}

            {/* ฟอร์มเพิ่ม/แก้ไข */}
            {showForm && (
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-blue-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">{editId ? 'แก้ไขภาคเรียน' : 'เพิ่มภาคเรียนใหม่'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block font-bold text-gray-700 mb-1">ภาคเรียน</label>
                            <select value={form.term} onChange={e => setForm({ ...form, term: e.target.value })} className={inputClass}>
                                <option value="1">เทอม 1</option>
                                <option value="2">เทอม 2</option>
                                <option value="3">เทอม 3 (ฤดูร้อน)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-bold text-gray-700 mb-1">ปีการศึกษา (พ.ศ.)</label>
                            <input type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} className={inputClass} />
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked={form.is_current} onChange={e => setForm({ ...form, is_current: e.target.checked })} className="w-5 h-5 rounded" />
                                <span className="font-bold text-gray-700">ภาคเรียนปัจจุบัน</span>
                            </label>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block font-bold text-gray-700 mb-1">วันเริ่มภาคเรียน</label>
                            <input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} className={inputClass} />
                        </div>
                        <div>
                            <label className="block font-bold text-gray-700 mb-1">วันสิ้นสุดภาคเรียน</label>
                            <input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} className={inputClass} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block font-bold text-gray-700 mb-1">วันเริ่มฝึกงาน</label>
                            <input type="date" value={form.internship_start} onChange={e => setForm({ ...form, internship_start: e.target.value })} className={inputClass} />
                        </div>
                        <div>
                            <label className="block font-bold text-gray-700 mb-1">วันสิ้นสุดฝึกงาน</label>
                            <input type="date" value={form.internship_end} onChange={e => setForm({ ...form, internship_end: e.target.value })} className={inputClass} />
                        </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                        <button onClick={resetForm} className="px-6 py-2.5 border border-gray-300 text-gray-600 rounded-xl font-bold hover:bg-gray-50">ยกเลิก</button>
                        <button onClick={handleSave} className="px-8 py-2.5 bg-[#5cb85c] hover:bg-[#4cae4c] text-white rounded-xl font-bold">{editId ? 'อัปเดต' : 'สร้าง'}</button>
                    </div>
                </div>
            )}

            {/* ตารางภาคเรียน */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="py-4 px-6 text-left font-bold text-gray-600">ภาคเรียน</th>
                            <th className="py-4 px-6 text-left font-bold text-gray-600">ช่วงภาคเรียน</th>
                            <th className="py-4 px-6 text-left font-bold text-gray-600">ช่วงฝึกงาน</th>
                            <th className="py-4 px-6 text-center font-bold text-gray-600">สถานะ</th>
                            <th className="py-4 px-6 text-right font-bold text-gray-600">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {semesters.length === 0 && (
                            <tr><td colSpan={5} className="py-12 text-center text-gray-400">ยังไม่มีภาคเรียน กดปุ่ม "เพิ่มภาคเรียน" เพื่อสร้าง</td></tr>
                        )}
                        {semesters.map(s => (
                            <tr key={s.id} className={`hover:bg-gray-50 transition-colors ${s.is_current ? 'bg-blue-50/50' : ''}`}>
                                <td className="py-4 px-6">
                                    <span className="font-bold text-gray-900">เทอม {s.term}/{s.year}</span>
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-600">
                                    {s.start_date ? new Date(s.start_date).toLocaleDateString('th-TH') : '-'} — {s.end_date ? new Date(s.end_date).toLocaleDateString('th-TH') : '-'}
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-600">
                                    {s.internship_start ? new Date(s.internship_start).toLocaleDateString('th-TH') : '-'} — {s.internship_end ? new Date(s.internship_end).toLocaleDateString('th-TH') : '-'}
                                </td>
                                <td className="py-4 px-6 text-center">
                                    {s.is_current ? (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold"><Star size={12} /> ปัจจุบัน</span>
                                    ) : (
                                        <span className="text-gray-400 text-xs">—</span>
                                    )}
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleEdit(s)} className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"><Edit3 size={16} /></button>
                                        <button onClick={() => handleDelete(s.id)} className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminSemesterPage;
