import { useState, useRef, useEffect } from 'react';
import { Camera, Save } from 'lucide-react';
import CustomDropdown from '../../components/ui/CustomDropdown';
import api from '../../api';

const CompanyProfilePage = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [saveMessage, setSaveMessage] = useState('');

    const [formData, setFormData] = useState({
        companyName: '',
        businessType: '',
        address: '',
        phone: '',
        email: '',
        website: '',
    });

    const businessTypes = [
        'เทคโนโลยีสารสนเทศ',
        'การเงินและธนาคาร',
        'การผลิต',
        'การศึกษา',
        'สาธารณสุข',
        'โรงพยาบาล',
        'โทรคมนาคม',
        'อสังหาริมทรัพย์',
    ];

    // โหลดข้อมูลโปรไฟล์จาก API
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await api.get('/supervisor/profile');
                const data = res.data;
                setFormData({
                    companyName: data.company_name || '',
                    businessType: data.business_type || '',
                    address: data.address || '',
                    phone: data.phone || '',
                    email: data.email || '',
                    website: data.website || '',
                });
                if (data.photo_url) setProfileImage(data.photo_url);
            } catch (err) {
                console.error('Failed to load profile:', err);
            } finally {
                setLoadingProfile(false);
            }
        };
        loadProfile();
    }, []);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        setSaveMessage('');
        try {
            await api.put('/supervisor/profile', null, {
                params: {
                    phone: formData.phone || undefined,
                    email: formData.email || undefined,
                }
            });
            setSaveMessage('บันทึกข้อมูลเรียบร้อยแล้ว');
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (err) {
            setSaveMessage('เกิดข้อผิดพลาดในการบันทึก');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-start min-h-screen pt-4 pb-12">
            <div className="bg-white rounded-[40px] p-8 md:p-12 w-full max-w-[1400px] shadow-sm">
                <h1 className="text-3xl font-bold text-gray-900 mb-12">โปรไฟล์สถานประกอบการ</h1>

                <div className="flex flex-col xl:flex-row gap-16">
                    {/* Left Column - Profile Image */}
                    <div className="flex flex-col items-center gap-4">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-64 h-64 bg-[#f1f5f9] rounded-3xl flex items-center justify-center relative overflow-hidden group border-2 border-dashed border-indigo-200 cursor-pointer"
                        >
                            {profileImage ? (
                                <img src={profileImage} alt="Company Logo" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-32 h-32 bg-[#2d5a8e] rounded-full flex items-center justify-center">
                                    <svg className="w-16 h-16 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                                    </svg>
                                </div>
                            )}

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Camera className="text-white w-12 h-12 drop-shadow-lg" />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="text-blue-500 font-medium hover:underline"
                            >
                                อัพโหลดโลโก้
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                className="hidden"
                                accept="image/*"
                            />
                            <span className="px-3 py-1 bg-[#dbeafe] text-[#1e40af] text-xs rounded-full font-medium">
                                • สถานประกอบการ
                            </span>
                        </div>
                    </div>

                    {/* Right Column - Form Fields */}
                    <div className="flex-1 space-y-8">
                        {/* Row 1: Company Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="block text-lg font-bold text-gray-900">ชื่อสถานประกอบการ</label>
                                <input
                                    type="text"
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    className="w-full bg-transparent border-b border-gray-300 py-2 text-gray-700 focus:outline-none focus:border-[#4472c4] transition-colors rounded-none text-lg placeholder-gray-400"
                                    placeholder="เช่น บริษัท ตัวอย่าง จำกัด"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-lg font-bold text-gray-900">ประเภทธุรกิจ</label>
                                <CustomDropdown
                                    value={formData.businessType}
                                    onChange={(value) => setFormData({ ...formData, businessType: value })}
                                    options={businessTypes}
                                    variant="underline"
                                    placeholder="เลือกประเภทธุรกิจ"
                                />
                            </div>
                        </div>

                        {/* Row 2: Address */}
                        <div className="space-y-2">
                            <label className="block text-lg font-bold text-gray-900">ที่อยู่</label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full bg-transparent border-b border-gray-300 py-2 text-gray-700 focus:outline-none focus:border-[#4472c4] transition-colors rounded-none text-lg placeholder-gray-400"
                                placeholder="เช่น 123 ถ.วิภาวดีรังสิต แขวงจตุจักร เขตจตุจักร กรุงเทพมหานคร 10900"
                            />
                        </div>



                        {/* Row 4: Phone & Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="block text-lg font-bold text-gray-900">เบอร์โทรศัพท์</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full bg-transparent border-b border-gray-300 py-2 text-gray-700 focus:outline-none focus:border-[#4472c4] transition-colors rounded-none text-lg placeholder-gray-400"
                                    placeholder=""
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-lg font-bold text-gray-900">อีเมล</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-transparent border-b border-gray-300 py-2 text-gray-700 focus:outline-none focus:border-[#4472c4] transition-colors rounded-none text-lg placeholder-gray-400"
                                    placeholder=""
                                />
                            </div>
                        </div>
                        {/* Save Button */}
                        <div className="flex justify-end pt-8">
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="px-12 py-4 bg-[#5DC139] hover:bg-[#4ea82e] text-white text-xl font-bold rounded-[20px] transition-all transform active:scale-95 shadow-md flex items-center gap-2"
                            >
                                {isLoading ? 'กำลังบันทึก...' : (
                                    <>
                                        <Save size={24} />
                                        บันทึก
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyProfilePage;
