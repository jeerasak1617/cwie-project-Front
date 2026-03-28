import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Search, Building2 } from 'lucide-react';
import api from '../../api';

const AdminCompanyPage = () => {
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [msg, setMsg] = useState('');
    const [search, setSearch] = useState('');
    const [form, setForm] = useState({ name_th: '', name_en: '', phone: '', email: '', description: '' });

    const fetchCompanies = async () => {
        try {
            const { data } = await api.get('/admin/companies', { params: { search: search || undefined, per_page: 200 } });
            setCompanies(data.companies || []);
        } catch {} finally { setLoading(false); }
    };
    useEffect(() => { fetchCompanies(); }, [search]);

    const resetForm = () => { setForm({ name_th: '', name_en: '', phone: '', email: '', description: '' }); setEditId(null); setShowForm(false); };

    const handleEdit = (c: any) => {
        setForm({ name_th: c.name_th || '', name_en: c.name_en || '', phone: c.phone || '', email: c.email || '', description: c.description || '' });
        setEditId(c.id); setShowForm(true);
    };

    const handleSave = async () => {
        if (!form.name_th) { setMsg('กรุณาใส่ชื่อบริษัท'); return; }
        try {
            if (editId) { await api.put(`/admin/companies/${editId}`, form); setMsg('อัปเดตสำเร็จ'); }
            else { await api.post('/admin/companies', form); setMsg('เพิ่มบริษัทสำเร็จ'); }
            resetForm(); fetchCompanies(); setTimeout(() => setMsg(''), 3000);
        } catch (e: any) { setMsg(e.response?.data?.detail || 'เกิดข้อผิดพลาด'); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('ยืนยันลบบริษัทนี้?')) return;
        try { await api.delete(`/admin/companies/${id}`); fetchCompanies(); setMsg('ลบสำเร็จ'); setTimeout(() => setMsg(''), 3000); }
        catch (e: any) { setMsg(e.response?.data?.detail || 'ลบไม่สำเร็จ'); }
    };

    const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium";

    if (loading) return <div className="text-center py-20 text-gray-400">กำลังโหลด...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">จัดการบริษัท/สถานประกอบการ</h1>
                    <p className="text-gray-500 mt-1">เพิ่ม แก้ไข ลบ รายชื่อบริษัท ({companies.length} แห่ง)</p>
                </div>
                <button onClick={() => { resetForm(); setShowForm(true); }} className="px-5 py-2.5 bg-[#4472c4] hover:bg-[#3561b3] text-white rounded-xl font-bold flex items-center gap-2">
                    <Plus size={20} /> เพิ่มบริษัท
                </button>
            </div>

            {msg && <div className={`mb-6 p-3 rounded-xl text-center font-bold ${msg.includes('สำเร็จ') ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>{msg}</div>}

            {/* ค้นหา */}
            <div className="relative mb-6">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหาบริษัท..." className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium" />
            </div>

            {showForm && (
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-blue-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">{editId ? 'แก้ไขบริษัท' : 'เพิ่มบริษัทใหม่'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div><label className="block font-bold text-gray-700 mb-1">ชื่อบริษัท (ไทย) *</label><input type="text" value={form.name_th} onChange={e => setForm({ ...form, name_th: e.target.value })} className={inputClass} placeholder="เช่น บริษัท เอบีซี จำกัด" /></div>
                        <div><label className="block font-bold text-gray-700 mb-1">ชื่อบริษัท (อังกฤษ)</label><input type="text" value={form.name_en} onChange={e => setForm({ ...form, name_en: e.target.value })} className={inputClass} placeholder="ABC Co., Ltd." /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div><label className="block font-bold text-gray-700 mb-1">โทรศัพท์</label><input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={inputClass} /></div>
                        <div><label className="block font-bold text-gray-700 mb-1">อีเมล</label><input type="text" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inputClass} /></div>
                    </div>
                    <div className="mb-6"><label className="block font-bold text-gray-700 mb-1">ที่อยู่</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={inputClass + " resize-none"} rows={2} placeholder="เช่น 123 ถ.วิภาวดีรังสิต แขวงจตุจักร เขตจตุจักร กรุงเทพ 10900" /></div>
                    <div className="flex gap-3 justify-end">
                        <button onClick={resetForm} className="px-6 py-2.5 border border-gray-300 text-gray-600 rounded-xl font-bold">ยกเลิก</button>
                        <button onClick={handleSave} className="px-8 py-2.5 bg-[#5cb85c] hover:bg-[#4cae4c] text-white rounded-xl font-bold">{editId ? 'อัปเดต' : 'เพิ่ม'}</button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b"><tr><th className="py-4 px-6 text-left font-bold text-gray-600">ชื่อบริษัท</th><th className="py-4 px-6 text-left font-bold text-gray-600">โทร/อีเมล</th><th className="py-4 px-6 text-right font-bold text-gray-600">จัดการ</th></tr></thead>
                    <tbody className="divide-y divide-gray-50">
                        {companies.length === 0 && <tr><td colSpan={3} className="py-12 text-center text-gray-400">ยังไม่มีบริษัท</td></tr>}
                        {companies.map(c => (
                            <tr key={c.id} className="hover:bg-gray-50">
                                <td className="py-4 px-6"><div className="flex items-center gap-3"><Building2 size={20} className="text-blue-500" /><div><span className="font-bold text-gray-900">{c.name_th}</span>{c.name_en && <span className="text-gray-400 text-sm ml-2">({c.name_en})</span>}</div></div></td>
                                <td className="py-4 px-6 text-sm text-gray-600">{c.phone || '-'} / {c.email || '-'}</td>
                                <td className="py-4 px-6 text-right"><div className="flex justify-end gap-2"><button onClick={() => handleEdit(c)} className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"><Edit3 size={16} /></button><button onClick={() => handleDelete(c.id)} className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100"><Trash2 size={16} /></button></div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default AdminCompanyPage;
