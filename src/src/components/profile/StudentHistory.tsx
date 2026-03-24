import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import api from '../../api';

const StudentHistory = () => {
    const [profile, setProfile] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [phone, setPhone] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        api.get('/student/profile').then(res => {
            setProfile(res.data);
            setPhone(res.data.phone || '');
            setMobile(res.data.mobile || '');
            setEmail(res.data.email || '');
        }).catch(() => {}).finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/student/profile', null, { params: { phone: phone || undefined, mobile: mobile || undefined, email: email || undefined } });
            setMessage('บันทึกสำเร็จ!'); setTimeout(() => setMessage(''), 3000);
        } catch (e: any) { setMessage(e.response?.data?.detail || 'เกิดข้อผิดพลาด'); }
        finally { setSaving(false); }
    };

    if (loading) return <div className="text-center py-12 text-gray-400">กำลังโหลด...</div>;

    return (
        <div className="bg-white rounded-[30px] p-6 md:p-10 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">ประวัตินักศึกษา</h2>
            {message && <div className={`mb-4 p-3 rounded-xl text-center font-bold ${message.includes('สำเร็จ') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{message}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="text-gray-700 font-bold mb-2 block">คำนำหน้า</label>
                    <input value={profile.prefix_th || ''} disabled className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-500 bg-gray-50" />
                </div>
                <div>
                    <label className="text-gray-700 font-bold mb-2 block">รหัสนักศึกษา</label>
                    <input value={profile.student_code || ''} disabled className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-500 bg-gray-50" />
                </div>
                <div>
                    <label className="text-gray-700 font-bold mb-2 block">ชื่อ</label>
                    <input value={profile.first_name_th || ''} disabled className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-500 bg-gray-50" />
                </div>
                <div>
                    <label className="text-gray-700 font-bold mb-2 block">นามสกุล</label>
                    <input value={profile.last_name_th || ''} disabled className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-500 bg-gray-50" />
                </div>
                <div>
                    <label className="text-gray-700 font-bold mb-2 block">อีเมล</label>
                    <input value={email} onChange={e => setEmail(e.target.value)} className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-700 focus:outline-none focus:border-[#4472c4]" />
                </div>
                <div>
                    <label className="text-gray-700 font-bold mb-2 block">เบอร์โทร</label>
                    <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-700 focus:outline-none focus:border-[#4472c4]" />
                </div>
                <div>
                    <label className="text-gray-700 font-bold mb-2 block">มือถือ</label>
                    <input value={mobile} onChange={e => setMobile(e.target.value)} className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-700 focus:outline-none focus:border-[#4472c4]" />
                </div>
                <div>
                    <label className="text-gray-700 font-bold mb-2 block">GPA</label>
                    <input value={profile.gpa || '-'} disabled className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-500 bg-gray-50" />
                </div>
            </div>
            <div className="flex justify-end mt-8">
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#5cc945] hover:bg-[#4db83a] disabled:bg-gray-400 text-white font-bold shadow-lg transition-all"><Save size={20} />{saving ? 'กำลังบันทึก...' : 'บันทึก'}</button>
            </div>
        </div>
    );
};

export default StudentHistory;
