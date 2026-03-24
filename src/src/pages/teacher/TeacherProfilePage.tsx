import { useState, useEffect, useRef } from 'react';
import { Camera, Save } from 'lucide-react';
import api from '../../api';

const TeacherProfilePage = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({ prefix: '', firstName: '', lastName: '', email: '', phone: '', mobile: '', academic_position: '' });

    useEffect(() => {
        api.get('/advisor/profile').then(res => {
            const d = res.data;
            setFormData({ prefix: d.prefix_th || '', firstName: d.first_name_th || '', lastName: d.last_name_th || '', email: d.email || '', phone: d.phone || '', mobile: d.mobile || '', academic_position: d.academic_position || '' });
            if (d.photo_url) setProfileImage(d.photo_url);
        }).catch(() => {});
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            await api.put('/advisor/profile', null, { params: { phone: formData.phone || undefined, mobile: formData.mobile || undefined, email: formData.email || undefined, academic_position: formData.academic_position || undefined } });
            setMessage('บันทึกสำเร็จ!'); setTimeout(() => setMessage(''), 3000);
        } catch (e: any) { setMessage(e.response?.data?.detail || 'เกิดข้อผิดพลาด'); }
        finally { setLoading(false); }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) { const reader = new FileReader(); reader.onloadend = () => setProfileImage(reader.result as string); reader.readAsDataURL(file); }
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-[#032B68] mb-8">โปรไฟล์อาจารย์</h1>
            {message && <div className={`mb-4 p-3 rounded-xl text-center font-bold ${message.includes('สำเร็จ') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{message}</div>}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden">{profileImage ? <img src={profileImage} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><Camera size={40} /></div>}</div>
                        <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-[#4472c4] text-white p-2 rounded-full shadow-lg"><Camera size={16} /></button>
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="text-gray-700 font-bold mb-2 block">คำนำหน้า</label><input value={formData.prefix} disabled className="w-full bg-gray-100 border border-gray-200 rounded-full py-3 px-6 text-gray-500" /></div>
                    <div><label className="text-gray-700 font-bold mb-2 block">ตำแหน่งทางวิชาการ</label><input value={formData.academic_position} onChange={e => setFormData({...formData, academic_position: e.target.value})} className="w-full bg-white border border-gray-200 rounded-full py-3 px-6 text-gray-700 focus:outline-none focus:border-[#4472c4]" /></div>
                    <div><label className="text-gray-700 font-bold mb-2 block">ชื่อ</label><input value={formData.firstName} disabled className="w-full bg-gray-100 border border-gray-200 rounded-full py-3 px-6 text-gray-500" /></div>
                    <div><label className="text-gray-700 font-bold mb-2 block">นามสกุล</label><input value={formData.lastName} disabled className="w-full bg-gray-100 border border-gray-200 rounded-full py-3 px-6 text-gray-500" /></div>
                    <div><label className="text-gray-700 font-bold mb-2 block">อีเมล</label><input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white border border-gray-200 rounded-full py-3 px-6 text-gray-700 focus:outline-none focus:border-[#4472c4]" /></div>
                    <div><label className="text-gray-700 font-bold mb-2 block">เบอร์โทร</label><input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white border border-gray-200 rounded-full py-3 px-6 text-gray-700 focus:outline-none focus:border-[#4472c4]" /></div>
                </div>
                <div className="flex justify-end mt-8">
                    <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#5cc945] hover:bg-[#4db83a] disabled:bg-gray-400 text-white font-bold shadow-lg transition-all"><Save size={20} />{loading ? 'กำลังบันทึก...' : 'บันทึก'}</button>
                </div>
            </div>
        </div>
    );
};

export default TeacherProfilePage;
