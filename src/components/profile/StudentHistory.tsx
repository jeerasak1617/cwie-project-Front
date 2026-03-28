import { useState, useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';
import CustomDropdown from '../ui/CustomDropdown';
import api from '../../api';

// บีบอัดรูปภาพ
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
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, w, h);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = reject;
            img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const StudentHistory = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [profile, setProfile] = useState<any>({});
    const [departments, setDepartments] = useState<any[]>([]);
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const [prefix, setPrefix] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [studentCode, setStudentCode] = useState('');
    const [major, setMajor] = useState('สาขาวิชา');
    const [year, setYear] = useState('ชั้นปีที่ 1');
    const [section, setSection] = useState('ภาคในเวลาราชการ');

    const prefixes = ['นาย', 'นางสาว', 'นาง'];
    const years = ['ชั้นปีที่ 1', 'ชั้นปีที่ 2', 'ชั้นปีที่ 3', 'ชั้นปีที่ 4'];
    const sections = ['ภาคในเวลาราชการ', 'ภาคนอกเวลาราชการ'];

    const sectionMap: Record<string, string> = { regular: 'ภาคในเวลาราชการ', part_time: 'ภาคนอกเวลาราชการ' };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, deptRes] = await Promise.all([
                    api.get('/student/profile').catch(() => ({ data: {} })),
                    api.get('/master/departments').catch(() => ({ data: [] })),
                ]);
                const p = profileRes.data;
                setProfile(p);
                setPrefix(p.prefix_th || 'นาย');
                setFirstName(p.first_name_th || '');
                setLastName(p.last_name_th || '');
                setStudentCode(p.student_code || '');
                setSection(sectionMap[p.study_program_type] || p.study_program_type || 'ภาคในเวลาราชการ');
                if (p.photo_url) setProfileImage(p.photo_url);

                const depts = Array.isArray(deptRes.data) ? deptRes.data : deptRes.data.departments || [];
                setDepartments(depts);
                if (p.department_id && depts.length > 0) {
                    const dept = depts.find((d: any) => d.id === p.department_id);
                    if (dept) setMajor(dept.name_th);
                }

                if (p.admission_year) {
                    const currentYear = new Date().getFullYear() + 543;
                    const diff = currentYear - p.admission_year + 1;
                    if (diff >= 1 && diff <= 8) setYear(`ชั้นปีที่ ${diff}`);
                } else if (p.student_code) {
                    // คำนวณจากรหัสนักศึกษา เช่น 6311202375 → 63 → ปี 2563
                    const yearPrefix = parseInt(p.student_code.substring(0, 2));
                    if (yearPrefix > 0) {
                        const admYear = 2500 + yearPrefix;
                        const currentYear = new Date().getFullYear() + 543;
                        const diff = currentYear - admYear + 1;
                        if (diff >= 1 && diff <= 8) setYear(`ชั้นปีที่ ${diff}`);
                    }
                }
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { setMessage('กรุณาเลือกไฟล์รูปภาพเท่านั้น'); return; }
        if (file.size > 5 * 1024 * 1024) { setMessage('ไฟล์ใหญ่เกิน 5MB'); return; }
        try {
            const compressed = await compressImage(file, 400, 0.7);
            setProfileImage(compressed);
            // ส่งรูปผ่าน POST body เพราะ base64 ยาวเกินไปสำหรับ query param
            await api.post('/student/profile/upload-photo', { photo_url: compressed });
            setMessage('อัปโหลดรูปสำเร็จ');
            setTimeout(() => setMessage(''), 3000);
        } catch { setMessage('อัปโหลดรูปไม่สำเร็จ'); }
    };

    const handleSave = async () => {
        setSaving(true); setMessage('');
        try {
            const dept = departments.find((d: any) => d.name_th === major);
            // คำนวณ admission_year จากชั้นปีที่เลือก
            const yearMatch = year.match(/(\d+)/);
            const yearNum = yearMatch ? parseInt(yearMatch[1]) : 1;
            const currentBE = new Date().getFullYear() + 543;
            const admissionYear = currentBE - yearNum + 1;

            await api.put('/student/profile', null, {
                params: {
                    prefix_th: prefix,
                    study_program_type: section,
                    department_id: dept?.id || undefined,
                    admission_year: admissionYear,
                }
            });
            setMessage('บันทึกสำเร็จ!');
            setTimeout(() => setMessage(''), 3000);
        } catch (e: any) {
            setMessage(e.response?.data?.detail || 'เกิดข้อผิดพลาด');
        } finally { setSaving(false); }
    };

    if (loading) return <div className="text-center py-12 text-gray-400">กำลังโหลด...</div>;

    return (
        <div>
            <div className="mb-2"><h1 className="text-3xl font-bold text-[#1e293b] inline-block border-b border-gray-200 pb-2">ประวัตินักศึกษา</h1></div>
            <p className="text-gray-400 mb-8 font-normal">ตรวจสอบและแก้ไขข้อมูลพื้นฐานที่ใช้ในการจัดทำเอกสารฝึกประสบการณ์และการติดต่อกับนักศึกษา</p>

            {message && <div className={`mb-4 p-3 rounded-xl text-center font-bold ${message.includes('สำเร็จ') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{message}</div>}

            <div className="flex flex-col xl:flex-row gap-12">
                <div className="flex flex-col items-center gap-4">
                    <div onClick={() => fileInputRef.current?.click()} className="w-64 h-64 bg-[#f1f5f9] rounded-3xl flex items-center justify-center relative overflow-hidden group border-2 border-dashed border-indigo-200 cursor-pointer">
                        {profileImage ? (
                            <img src={profileImage} alt="profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-32 h-32 bg-[#5d3b6d] rounded-full flex items-center justify-center">
                                <div className="w-12 h-12 bg-white/20 rounded-full"></div>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera className="text-white w-12 h-12 drop-shadow-lg" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => fileInputRef.current?.click()} className="text-blue-500 font-medium hover:underline">อัพโหลดรูปภาพ</button>
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/jpeg,image/png,image/webp" />
                        <span className="px-3 py-1 bg-[#dcfce7] text-[#166534] text-xs rounded-full font-medium">• นักศึกษาปัจจุบัน</span>
                    </div>
                    <p className="text-xs text-gray-400 text-center">รับไฟล์ .jpg .png .webp<br/>ขนาดไม่เกิน 5MB (บีบอัดอัตโนมัติ)</p>
                </div>

                <div className="flex-1 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
                        <div className="lg:col-span-3">
                            <label className="block text-lg font-bold text-[#1e293b] mb-2">คำนำหน้า</label>
                            <CustomDropdown value={prefix} onChange={setPrefix} options={prefixes} />
                        </div>
                        <div className="lg:col-span-5">
                            <label className="block text-lg font-bold text-[#1e293b] mb-2">ชื่อจริง</label>
                            <input type="text" value={firstName} disabled className="w-full px-6 py-3 rounded-full border border-gray-200 text-gray-500 bg-gray-50" />
                        </div>
                        <div className="lg:col-span-4">
                            <label className="block text-lg font-bold text-[#1e293b] mb-2">นามสกุล</label>
                            <input type="text" value={lastName} disabled className="w-full px-6 py-3 rounded-full border border-gray-200 text-gray-500 bg-gray-50" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-lg font-bold text-[#1e293b] mb-2">สาขาวิชา</label>
                            <CustomDropdown value={major} onChange={setMajor} options={departments.map((d: any) => d.name_th)} />
                        </div>
                        <div>
                            <label className="block text-lg font-bold text-[#1e293b] mb-2">ชั้นปี</label>
                            <CustomDropdown value={year} onChange={setYear} options={years} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-lg font-bold text-[#1e293b] mb-2">รหัสนักศึกษา</label>
                            <input type="text" value={studentCode} disabled className="w-full px-6 py-3 rounded-full border border-gray-200 text-gray-500 bg-gray-50" />
                        </div>
                        <div>
                            <label className="block text-lg font-bold text-[#1e293b] mb-2">ภาคการศึกษา</label>
                            <CustomDropdown value={section} onChange={setSection} options={sections} />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button onClick={handleSave} disabled={saving} className="px-10 py-3 bg-[#52c41a] hover:bg-[#49aa19] disabled:bg-gray-400 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all">{saving ? 'กำลังบันทึก...' : 'บันทึก'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentHistory;
