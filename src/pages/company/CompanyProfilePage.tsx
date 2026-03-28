import { useState, useRef, useEffect } from 'react';
import { Camera, Save, Building2, User } from 'lucide-react';
import api from '../../api';

const compressImage = (file: File, maxWidth = 400, quality = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let w = img.width, h = img.height;
                if (w > maxWidth) { h = (maxWidth / w) * h; w = maxWidth; }
                canvas.width = w; canvas.height = h;
                canvas.getContext('2d')?.drawImage(img, 0, 0, w, h);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = reject;
            img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const CompanyProfilePage = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [saveMessage, setSaveMessage] = useState('');
    const [activeTab, setActiveTab] = useState<'company' | 'mentor'>('company');

    // ข้อมูลบริษัท (read-only จาก admin)
    const [company, setCompany] = useState<any>(null);

    // ข้อมูลพี่เลี้ยง
    const [mentorName, setMentorName] = useState('');
    const [mentorPosition, setMentorPosition] = useState('');
    const [mentorPhone, setMentorPhone] = useState('');
    const [mentorEmail, setMentorEmail] = useState('');

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await api.get('/supervisor/profile');
                const data = res.data;
                setMentorName(`${data.first_name_th || ''} ${data.last_name_th || ''}`.trim());
                setMentorPosition(data.position || '');
                setMentorPhone(data.phone || '');
                setMentorEmail(data.email || '');
                if (data.photo_url) setProfileImage(data.photo_url);
                if (data.company) setCompany(data.company);
            } catch (err) { console.error('Failed to load profile:', err); }
            finally { setLoadingProfile(false); }
        };
        loadProfile();
    }, []);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { setSaveMessage('กรุณาเลือกไฟล์รูปภาพเท่านั้น'); return; }
        if (file.size > 5 * 1024 * 1024) { setSaveMessage('ไฟล์ใหญ่เกิน 5MB'); return; }
        try {
            const compressed = await compressImage(file, 400, 0.7);
            setProfileImage(compressed);
            await api.post('/supervisor/profile/upload-photo', { photo_url: compressed });
            setSaveMessage('อัปโหลดรูปสำเร็จ');
            setTimeout(() => setSaveMessage(''), 3000);
        } catch { setSaveMessage('อัปโหลดไม่สำเร็จ'); }
    };

    const handleSave = async () => {
        setIsLoading(true); setSaveMessage('');
        try {
            await api.put('/supervisor/profile', null, {
                params: { position: mentorPosition, phone: mentorPhone, email: mentorEmail }
            });
            setSaveMessage('บันทึกข้อมูลเรียบร้อยแล้ว');
            setTimeout(() => setSaveMessage(''), 3000);
        } catch { setSaveMessage('ไม่สามารถบันทึกได้'); }
        finally { setIsLoading(false); }
    };

    if (loadingProfile) return <div className="flex justify-center items-center h-64 text-gray-500">กำลังโหลด...</div>;

    return (
        <div className="flex justify-center items-start min-h-screen pt-4 pb-12">
            <div className="bg-white rounded-[40px] p-8 md:p-12 w-full max-w-[1400px] shadow-sm">
                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-gray-100 pb-4">
                    <button onClick={() => setActiveTab('company')} className={`px-6 py-3 rounded-xl font-bold text-lg transition-all ${activeTab === 'company' ? 'bg-[#032B68] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
                        <Building2 size={20} className="inline mr-2" />ข้อมูลสถานประกอบการ
                    </button>
                    <button onClick={() => setActiveTab('mentor')} className={`px-6 py-3 rounded-xl font-bold text-lg transition-all ${activeTab === 'mentor' ? 'bg-[#032B68] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
                        <User size={20} className="inline mr-2" />ข้อมูลพี่เลี้ยง
                    </button>
                </div>

                {saveMessage && <div className={`mb-6 p-3 rounded-xl text-center font-bold ${saveMessage.includes('เรียบร้อย') || saveMessage.includes('สำเร็จ') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{saveMessage}</div>}

                {/* Tab 1: ข้อมูลสถานประกอบการ */}
                {activeTab === 'company' && (
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-8">โปรไฟล์สถานประกอบการ</h1>
                        <div className="flex flex-col xl:flex-row gap-16">
                            <div className="flex flex-col items-center gap-4">
                                <div onClick={() => fileInputRef.current?.click()} className="w-64 h-64 bg-[#f1f5f9] rounded-3xl flex items-center justify-center relative overflow-hidden group border-2 border-dashed border-indigo-200 cursor-pointer">
                                    {profileImage ? <img src={profileImage} alt="Logo" className="w-full h-full object-cover" /> : (
                                        <div className="w-24 h-24 bg-[#4472c4] rounded-2xl flex items-center justify-center"><Building2 size={48} className="text-white" /></div>
                                    )}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Camera className="text-white w-12 h-12" /></div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => fileInputRef.current?.click()} className="text-blue-500 font-medium hover:underline">อัพโหลดโลโก้</button>
                                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/jpeg,image/png,image/webp" />
                                    <span className="px-3 py-1 bg-[#dcfce7] text-[#166534] text-xs rounded-full font-medium">• สถานประกอบการ</span>
                                </div>
                            </div>

                            <div className="flex-1 space-y-8">
                                {company ? (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="block text-lg font-bold text-gray-900">ชื่อสถานประกอบการ</label>
                                                <div className="w-full bg-green-50 border-b-2 border-green-200 py-3 px-1 text-gray-900 text-lg font-medium">{company.name_th} <span className="text-xs text-green-500">(ดึงจากระบบ)</span></div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-lg font-bold text-gray-900">ชื่อภาษาอังกฤษ</label>
                                                <div className="w-full bg-green-50 border-b-2 border-green-200 py-3 px-1 text-gray-700 text-lg">{company.name_en || '-'}</div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-lg font-bold text-gray-900">ที่อยู่</label>
                                            <div className="w-full bg-green-50 border-b-2 border-green-200 py-3 px-1 text-gray-700 text-lg">{company.description || '-'} <span className="text-xs text-green-500">(ดึงจากระบบ)</span></div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="block text-lg font-bold text-gray-900">เบอร์โทรศัพท์</label>
                                                <div className="w-full bg-green-50 border-b-2 border-green-200 py-3 px-1 text-gray-700 text-lg">{company.phone || '-'}</div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-lg font-bold text-gray-900">อีเมล</label>
                                                <div className="w-full bg-green-50 border-b-2 border-green-200 py-3 px-1 text-gray-700 text-lg">{company.email || '-'}</div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-400">ข้อมูลบริษัทถูกตั้งค่าโดย Admin หากต้องการแก้ไขกรุณาติดต่อผู้ดูแลระบบ</p>
                                    </>
                                ) : (
                                    <div className="p-8 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                                        <p className="text-amber-700 font-bold">ยังไม่ได้เลือกสถานประกอบการ</p>
                                        <p className="text-amber-600 text-sm mt-1">กรุณาติดต่อ Admin เพื่อกำหนดบริษัท</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab 2: ข้อมูลพี่เลี้ยง */}
                {activeTab === 'mentor' && (
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-8">ข้อมูลพี่เลี้ยง</h1>
                        <div className="space-y-8 max-w-3xl">
                            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                <p className="text-sm text-blue-700"><span className="font-bold">ชื่อพี่เลี้ยง:</span> {mentorName || '-'} <span className="text-xs text-blue-500">(จากข้อมูลตอนสมัคร)</span></p>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-lg font-bold text-gray-900">ตำแหน่ง</label>
                                <input type="text" value={mentorPosition} onChange={e => setMentorPosition(e.target.value)} placeholder="เช่น ผู้จัดการฝ่าย IT" className="w-full bg-transparent border-b border-gray-300 py-2 text-gray-700 focus:outline-none focus:border-[#4472c4] text-lg" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="block text-lg font-bold text-gray-900">เบอร์โทรศัพท์</label>
                                    <input type="text" value={mentorPhone} onChange={e => setMentorPhone(e.target.value)} placeholder="08x-xxx-xxxx" className="w-full bg-transparent border-b border-gray-300 py-2 text-gray-700 focus:outline-none focus:border-[#4472c4] text-lg" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-lg font-bold text-gray-900">อีเมล</label>
                                    <input type="text" value={mentorEmail} onChange={e => setMentorEmail(e.target.value)} placeholder="email@company.com" className="w-full bg-transparent border-b border-gray-300 py-2 text-gray-700 focus:outline-none focus:border-[#4472c4] text-lg" />
                                </div>
                            </div>
                            <div className="flex justify-end pt-8">
                                <button onClick={handleSave} disabled={isLoading} className="px-12 py-4 bg-[#5DC139] hover:bg-[#4ea82e] text-white text-xl font-bold rounded-[20px] shadow-md flex items-center gap-2">
                                    <Save size={24} /> {isLoading ? 'กำลังบันทึก...' : 'บันทึก'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyProfilePage;
