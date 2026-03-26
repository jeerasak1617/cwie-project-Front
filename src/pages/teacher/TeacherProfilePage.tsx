import { useState, useRef, useEffect } from 'react';
import { Camera, Save } from 'lucide-react';
import CustomDropdown from '../../components/ui/CustomDropdown';
import api from '../../api';

const TeacherProfilePage = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const [formData, setFormData] = useState({
        prefix: '',
        firstName: '',
        lastName: '',
        major: '',
        faculty: '',
        email: '',
        phone: ''
    });

    const prefixes = ['นาย', 'นางสาว', 'นาง', 'ผศ.', 'รศ.', 'ศ.', 'ดร.'];
    const majors = ['วิทยาการคอมพิวเตอร์', 'เทคโนโลยีสารสนเทศ', 'วิศวกรรมซอฟต์แวร์', 'Multimedia', 'Animation'];
    const faculties = ['คณะวิทยาศาสตร์'];

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/advisor/profile');
                setFormData({
                    prefix: data.prefix_th || '',
                    firstName: data.first_name_th || '',
                    lastName: data.last_name_th || '',
                    major: '', // department_id → need lookup, leave empty for now
                    faculty: 'คณะวิทยาศาสตร์',
                    email: data.email || '',
                    phone: data.phone || data.mobile || '',
                });
                if (data.photo_url) setProfileImage(data.photo_url);
            } catch (err) {
                console.error('Failed to fetch profile:', err);
            } finally {
                setIsFetching(false);
            }
        };
        fetchProfile();
    }, []);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProfileImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await api.put('/advisor/profile', null, {
                params: {
                    phone: formData.phone,
                    email: formData.email,
                }
            });
            alert('บันทึกข้อมูลเรียบร้อยแล้ว');
        } catch (err) {
            console.error('Failed to save profile:', err);
            alert('ไม่สามารถบันทึกได้ กรุณาลองใหม่');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return <div className="flex justify-center items-center h-64 text-gray-500">กำลังโหลดข้อมูล...</div>;
    }

    return (
        <div className="flex justify-center items-start min-h-screen pt-4 pb-12">
            <div className="bg-white rounded-[40px] p-8 md:p-12 w-full max-w-[1400px] shadow-sm">
                <h1 className="text-3xl font-bold text-gray-900 mb-12">โปรไฟล์อาจารย์นิเทศ</h1>

                <div className="flex flex-col xl:flex-row gap-16">
                    {/* Left Column - Profile Image */}
                    <div className="flex flex-col items-center gap-4">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-64 h-64 bg-[#f1f5f9] rounded-3xl flex items-center justify-center relative overflow-hidden group border-2 border-dashed border-indigo-200 cursor-pointer"
                        >
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-32 h-32 bg-[#5d3b6d] rounded-full flex items-center justify-center mb-4">
                                    <div className="w-16 h-16 bg-[#5d3b6d] rounded-full relative">
                                        <div className="absolute -bottom-2 w-24 h-12 bg-[#5d3b6d] rounded-t-full left-1/2 -translate-x-1/2"></div>
                                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-12 bg-white/20 rounded-full"></div>
                                    </div>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Camera className="text-white w-12 h-12 drop-shadow-lg" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => fileInputRef.current?.click()} className="text-blue-500 font-medium hover:underline">อัพโหลดรูปภาพ</button>
                            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                            <span className="px-3 py-1 bg-[#dcfce7] text-[#166534] text-xs rounded-full font-medium">• อาจารย์นิเทศ</span>
                        </div>
                    </div>

                    {/* Right Column - Form Fields */}
                    <div className="flex-1 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <label className="block text-lg font-bold text-gray-900">คำนำหน้า</label>
                                <CustomDropdown value={formData.prefix} onChange={(value) => setFormData({ ...formData, prefix: value })} options={prefixes} variant="underline" placeholder="เลือกคำนำหน้า" />
                            </div>
                            <div className="md:col-span-5 space-y-2">
                                <label className="block text-lg font-bold text-gray-900">ชื่อจริง</label>
                                <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full bg-transparent border-b border-gray-300 py-2 text-gray-700 focus:outline-none focus:border-[#4472c4] transition-colors rounded-none text-lg" />
                            </div>
                            <div className="md:col-span-5 space-y-2">
                                <label className="block text-lg font-bold text-gray-900">นามสกุล</label>
                                <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full bg-transparent border-b border-gray-300 py-2 text-gray-700 focus:outline-none focus:border-[#4472c4] transition-colors rounded-none text-lg" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="block text-lg font-bold text-gray-900">สาขา</label>
                                <CustomDropdown value={formData.major} onChange={(value) => setFormData({ ...formData, major: value })} options={majors} variant="underline" placeholder="เลือกสาขา" />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-lg font-bold text-gray-900">คณะ</label>
                                <CustomDropdown value={formData.faculty} onChange={(value) => setFormData({ ...formData, faculty: value })} options={faculties} variant="underline" placeholder="เลือกคณะ" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="block text-lg font-bold text-gray-900">อีเมลมหาวิทยาลัย</label>
                                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-transparent border-b border-gray-300 py-2 text-gray-700 focus:outline-none focus:border-[#4472c4] transition-colors rounded-none text-lg" />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-lg font-bold text-gray-900">เบอร์โทรศัพท์</label>
                                <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-transparent border-b border-gray-300 py-2 text-gray-700 focus:outline-none focus:border-[#4472c4] transition-colors rounded-none text-lg" />
                            </div>
                        </div>

                        <div className="flex justify-end pt-8">
                            <button onClick={handleSave} disabled={isLoading} className="px-12 py-4 bg-[#5DC139] hover:bg-[#4ea82e] text-white text-xl font-bold rounded-[20px] transition-all transform active:scale-95 shadow-md flex items-center gap-2">
                                {isLoading ? 'กำลังบันทึก...' : 'บันทึก'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherProfilePage;
