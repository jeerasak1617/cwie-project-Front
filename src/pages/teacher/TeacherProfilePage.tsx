import { useState, useRef, useEffect } from 'react';
import { Camera, Save } from 'lucide-react';
import CustomDropdown from '../../components/ui/CustomDropdown';
import api from '../../api';

const TeacherProfilePage = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [saveMsg, setSaveMsg] = useState('');

    const [faculties, setFaculties] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [selectedFacultyId, setSelectedFacultyId] = useState('');

    const [formData, setFormData] = useState({
        prefix: '', firstName: '', lastName: '',
        departmentId: '', facultyName: '',
        email: '', phone: ''
    });

    const prefixes = ['นาย', 'นางสาว', 'นาง', 'ผศ.', 'ผศ.ดร.', 'รศ.', 'รศ.ดร.', 'ศ.', 'ศ.ดร.', 'ดร.', 'อ.', 'อ.ดร.'];

    useEffect(() => {
        const fetchAll = async () => {
            try {
                // โหลดคณะ
                const facRes = await api.get('/master/faculties').catch(() => ({ data: [] }));
                const facs = facRes.data || [];
                setFaculties(facs);

                // โหลดโปรไฟล์
                const { data } = await api.get('/advisor/profile');

                setFormData({
                    prefix: data.prefix_th || '',
                    firstName: data.first_name_th || '',
                    lastName: data.last_name_th || '',
                    departmentId: data.department_id ? String(data.department_id) : '',
                    facultyName: '',
                    email: data.email || '',
                    phone: data.phone || data.mobile || '',
                });
                if (data.photo_url) setProfileImage(data.photo_url);

                // หาคณะจาก department_id
                if (data.department_id) {
                    // โหลด departments ทั้งหมดเพื่อหา faculty_id
                    const deptAllRes = await api.get('/master/departments').catch(() => ({ data: [] }));
                    const allDepts = Array.isArray(deptAllRes.data) ? deptAllRes.data : [];
                    const dept = allDepts.find((d: any) => d.id === data.department_id);
                    if (dept && dept.faculty_id) {
                        setSelectedFacultyId(String(dept.faculty_id));
                        const fac = facs.find((f: any) => f.id === dept.faculty_id);
                        if (fac) setFormData(prev => ({ ...prev, facultyName: fac.name_th }));
                    }
                }
            } catch (err) { console.error('Failed to fetch profile:', err); }
            finally { setIsFetching(false); }
        };
        fetchAll();
    }, []);

    // โหลดสาขาตามคณะ
    useEffect(() => {
        if (selectedFacultyId) {
            api.get(`/master/departments/${selectedFacultyId}`).then(res => {
                setDepartments(res.data || []);
            }).catch(() => setDepartments([]));
        } else { setDepartments([]); }
    }, [selectedFacultyId]);

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

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { setSaveMsg('กรุณาเลือกไฟล์รูปภาพเท่านั้น'); return; }
        if (file.size > 5 * 1024 * 1024) { setSaveMsg('ไฟล์ใหญ่เกิน 5MB'); return; }
        try {
            const compressed = await compressImage(file, 400, 0.7);
            setProfileImage(compressed);
            await api.post('/advisor/profile/upload-photo', { photo_url: compressed });
            setSaveMsg('อัปโหลดรูปสำเร็จ');
            setTimeout(() => setSaveMsg(''), 3000);
        } catch { setSaveMsg('อัปโหลดรูปไม่สำเร็จ'); }
    };

    const handleSave = async () => {
        setIsLoading(true); setSaveMsg('');
        try {
            await api.put('/advisor/profile', null, {
                params: {
                    phone: formData.phone,
                    email: formData.email,
                    department_id: formData.departmentId || undefined,
                    prefix_th: formData.prefix || undefined,
                }
            });
            setSaveMsg('บันทึกข้อมูลเรียบร้อยแล้ว');
            setTimeout(() => setSaveMsg(''), 3000);
        } catch { setSaveMsg('ไม่สามารถบันทึกได้ กรุณาลองใหม่'); }
        finally { setIsLoading(false); }
    };

    // หาชื่อสาขาจาก departmentId
    const deptName = departments.find(d => String(d.id) === formData.departmentId)?.name_th || '';

    if (isFetching) return <div className="flex justify-center items-center h-64 text-gray-500">กำลังโหลดข้อมูล...</div>;

    return (
        <div className="flex justify-center items-start min-h-screen pt-4 pb-12">
            <div className="bg-white rounded-[40px] p-8 md:p-12 w-full max-w-[1400px] shadow-sm">
                <h1 className="text-3xl font-bold text-gray-900 mb-12">โปรไฟล์อาจารย์นิเทศ</h1>

                {saveMsg && <div className={`mb-6 p-3 rounded-xl text-center font-bold ${saveMsg.includes('เรียบร้อย') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{saveMsg}</div>}

                <div className="flex flex-col xl:flex-row gap-16">
                    <div className="flex flex-col items-center gap-4">
                        <div onClick={() => fileInputRef.current?.click()} className="w-64 h-64 bg-[#f1f5f9] rounded-3xl flex items-center justify-center relative overflow-hidden group border-2 border-dashed border-indigo-200 cursor-pointer">
                            {profileImage ? <img src={profileImage} alt="Profile" className="w-full h-full object-cover" /> : (
                                <div className="w-32 h-32 bg-[#5d3b6d] rounded-full flex items-center justify-center">
                                    <div className="w-16 h-16 bg-[#5d3b6d] rounded-full relative"><div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-12 bg-white/20 rounded-full"></div></div>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Camera className="text-white w-12 h-12 drop-shadow-lg" /></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => fileInputRef.current?.click()} className="text-blue-500 font-medium hover:underline">อัพโหลดรูปภาพ</button>
                            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/jpeg,image/png,image/webp" />
                            <span className="px-3 py-1 bg-[#dcfce7] text-[#166534] text-xs rounded-full font-medium">• อาจารย์นิเทศ</span>
                        </div>
                        <p className="text-xs text-gray-400 text-center">รับไฟล์ .jpg .png .webp ขนาดไม่เกิน 5MB</p>
                    </div>

                    <div className="flex-1 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <label className="block text-lg font-bold text-gray-900">คำนำหน้า</label>
                                <CustomDropdown value={formData.prefix} onChange={v => setFormData({ ...formData, prefix: v })} options={prefixes} variant="underline" placeholder="เลือก" />
                            </div>
                            <div className="md:col-span-5 space-y-2">
                                <label className="block text-lg font-bold text-gray-900">ชื่อจริง</label>
                                <input type="text" value={formData.firstName} readOnly className="w-full bg-transparent border-b border-gray-300 py-2 text-gray-500 rounded-none text-lg" />
                            </div>
                            <div className="md:col-span-5 space-y-2">
                                <label className="block text-lg font-bold text-gray-900">นามสกุล</label>
                                <input type="text" value={formData.lastName} readOnly className="w-full bg-transparent border-b border-gray-300 py-2 text-gray-500 rounded-none text-lg" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="block text-lg font-bold text-gray-900">คณะ</label>
                                <select value={selectedFacultyId} onChange={e => { setSelectedFacultyId(e.target.value); setFormData(prev => ({ ...prev, departmentId: '' })); }} className="w-full bg-transparent border-b border-gray-300 py-2 text-gray-700 focus:outline-none focus:border-[#4472c4] rounded-none text-lg appearance-none cursor-pointer">
                                    <option value="">-- เลือกคณะ --</option>
                                    {faculties.map(f => <option key={f.id} value={f.id}>{f.name_th}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-lg font-bold text-gray-900">สาขา {deptName && <span className="text-sm text-green-500 font-normal">({deptName})</span>}</label>
                                <select value={formData.departmentId} onChange={e => setFormData({ ...formData, departmentId: e.target.value })} disabled={!selectedFacultyId} className="w-full bg-transparent border-b border-gray-300 py-2 text-gray-700 focus:outline-none focus:border-[#4472c4] rounded-none text-lg appearance-none cursor-pointer disabled:text-gray-400">
                                    <option value="">{selectedFacultyId ? '-- เลือกสาขา --' : '-- เลือกคณะก่อน --'}</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.name_th}</option>)}
                                </select>
                                {!formData.departmentId && (
                                    <p className="text-sm text-amber-600 font-medium mt-1">กรุณาเลือกคณะและสาขา แล้วกดบันทึก เพื่อให้ระบบทราบว่าท่านสังกัดสาขาใด</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="block text-lg font-bold text-gray-900">อีเมลมหาวิทยาลัย</label>
                                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-transparent border-b border-gray-300 py-2 text-gray-700 focus:outline-none focus:border-[#4472c4] rounded-none text-lg" />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-lg font-bold text-gray-900">เบอร์โทรศัพท์</label>
                                <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-transparent border-b border-gray-300 py-2 text-gray-700 focus:outline-none focus:border-[#4472c4] rounded-none text-lg" />
                            </div>
                        </div>

                        <div className="flex justify-end pt-8">
                            <button onClick={handleSave} disabled={isLoading} className="px-12 py-4 bg-[#5DC139] hover:bg-[#4ea82e] text-white text-xl font-bold rounded-[20px] transition-all shadow-md flex items-center gap-2">
                                {isLoading ? 'กำลังบันทึก...' : <><Save size={24} /> บันทึก</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherProfilePage;
