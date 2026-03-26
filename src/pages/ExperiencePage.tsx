import { useState, useEffect } from 'react';
import { FileText, MapPin } from 'lucide-react';
import CustomDropdown from '../components/ui/CustomDropdown';
import api from '../api';

const ExperiencePage = () => {
    const [activeSection, setActiveSection] = useState('record');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    // Profile data from API
    const [profile, setProfile] = useState<any>({});
    const [internship, setInternship] = useState<any>({});

    // Dropdown data from API
    const [departments, setDepartments] = useState<any[]>([]);
    const [advisors, setAdvisors] = useState<any[]>([]);
    const [filteredAdvisors, setFilteredAdvisors] = useState<any[]>([]);

    // Form State
    const [prefix, setPrefix] = useState('');
    const [fullName, setFullName] = useState('');
    const [studentCode, setStudentCode] = useState('');
    const [major, setMajor] = useState('');
    const [section, setSection] = useState('ภาคในเวลาราชการ');
    const [advisorName, setAdvisorName] = useState('');
    const [supervisorName, setSupervisorName] = useState('');
    const [supervisorPosition, setSupervisorPosition] = useState('');
    const [workplaceName, setWorkplaceName] = useState('');
    const [workplaceAddress, setWorkplaceAddress] = useState('');
    const [taskDescription, setTaskDescription] = useState('');

    const prefixes = ['นาย', 'นางสาว', 'นาง'];
    const sections = ['ภาคในเวลาราชการ', 'ภาคนอกเวลาราชการ'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                // ดึงข้อมูล profile
                const profileRes = await api.get('/student/profile').catch(() => ({ data: {} }));
                const p = profileRes.data;
                setProfile(p);
                setPrefix(p.prefix_th || 'นาย');
                setFullName(`${p.first_name_th || ''} ${p.last_name_th || ''}`);
                setStudentCode(p.student_code || '');
                setSection(p.study_program_type || 'ภาคในเวลาราชการ');

                // ดึงข้อมูล internship
                const internRes = await api.get('/student/internship').catch(() => ({ data: {} }));
                setInternship(internRes.data);

                // ดึง departments
                const deptRes = await api.get('/master/departments').catch(() => ({ data: [] }));
                const depts = Array.isArray(deptRes.data) ? deptRes.data : deptRes.data.departments || [];
                setDepartments(depts);

                // ตั้ง major จาก department_id ของ user
                if (p.department_id && depts.length > 0) {
                    const dept = depts.find((d: any) => d.id === p.department_id);
                    if (dept) setMajor(dept.name_th);
                }

                // ดึง advisors (role = advisor)
                const advRes = await api.get('/master/advisors').catch(() => ({ data: [] }));
                const advs = Array.isArray(advRes.data) ? advRes.data : advRes.data.advisors || [];
                setAdvisors(advs);
                setFilteredAdvisors(advs);

                // ดึงชื่ออาจารย์ที่ assign ให้นักศึกษาคนนี้ (read-only)
                const advId = p.advisor_user_id || internRes.data?.user_adv_id;
                if (advId && advs.length > 0) {
                    const myAdv = advs.find((a: any) => a.id === advId);
                    if (myAdv) {
                        setAdvisorName(`${myAdv.prefix_th || ''} ${myAdv.first_name_th} ${myAdv.last_name_th}`.trim());
                    }
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // กรอง advisor ตาม department ที่เลือก
    useEffect(() => {
        if (!major || advisors.length === 0) {
            setFilteredAdvisors(advisors);
            return;
        }
        const dept = departments.find((d: any) => d.name_th === major);
        if (dept) {
            const filtered = advisors.filter((a: any) => a.department_id === dept.id || !a.department_id);
            setFilteredAdvisors(filtered.length > 0 ? filtered : advisors);
        } else {
            setFilteredAdvisors(advisors);
        }
    }, [major, advisors, departments]);

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            await api.put('/student/internship-info', null, {
                params: {
                    supervisor_name: supervisorName || undefined,
                    supervisor_position: supervisorPosition || undefined,
                    company_name: workplaceName || undefined,
                    company_address: workplaceAddress || undefined,
                    job_description: taskDescription || undefined,
                    study_program_type: section || undefined,
                }
            });
            setMessage('บันทึกข้อมูลการฝึกสำเร็จ!');
            setTimeout(() => setMessage(''), 3000);
        } catch (e: any) {
            setMessage(e.response?.data?.detail || 'เกิดข้อผิดพลาด');
        } finally {
            setSaving(false);
        }
    };

    const handleClear = () => {
        setSupervisorName(''); setSupervisorPosition('');
        setWorkplaceName(''); setWorkplaceAddress('');
        setTaskDescription(''); setAdvisorName('');
    };

    if (loading) return <div className="text-center py-20 text-gray-400">กำลังโหลด...</div>;

    return (
        <div className="">
            <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-5 xl:gap-7">
                {/* Sidebar Card */}
                <aside className="w-full xl:w-80 bg-white rounded-[30px] p-4 md:p-6 shadow-xl min-h-fit xl:min-h-[800px] flex flex-col">
                    <div className="flex flex-col gap-2 xl:gap-4 pb-2 xl:pb-0">
                        <button onClick={() => setActiveSection('record')} className={`w-full text-left px-4 md:px-5 py-3 rounded-xl font-bold text-base md:text-lg transition-all duration-200 flex items-center gap-3 ${activeSection === 'record' ? 'bg-[#fff5d0] text-[#032B68] shadow-sm xl:translate-x-1' : 'text-gray-500 hover:bg-[#fff5d0] hover:text-[#032B68] xl:hover:translate-x-1'}`}>
                            <div className={`p-1 rounded-full ${activeSection === 'record' ? 'bg-[#032B68]/10' : 'bg-blue-50'} flex-shrink-0`}><FileText size={24} className={activeSection === 'record' ? 'text-[#032B68]' : 'text-blue-500'} strokeWidth={activeSection === 'record' ? 2 : 1.5} /></div>
                            <span>บันทึกการฝึก<br />ประสบการณ์วิชาชีพ</span>
                        </button>
                        <button onClick={() => setActiveSection('place')} className={`w-full text-left px-4 md:px-5 py-3 rounded-xl font-bold text-base md:text-lg transition-all duration-200 flex items-center gap-3 ${activeSection === 'place' ? 'bg-[#fff5d0] text-[#032B68] shadow-sm xl:translate-x-1' : 'text-gray-500 hover:bg-[#fff5d0] hover:text-[#032B68] xl:hover:translate-x-1'}`}>
                            <div className={`p-1 rounded-full ${activeSection === 'place' ? 'bg-[#032B68]/10' : 'bg-orange-50'} flex-shrink-0`}><MapPin size={24} className={activeSection === 'place' ? 'text-[#032B68]' : 'text-orange-500'} strokeWidth={activeSection === 'place' ? 2 : 1.5} /></div>
                            <span>สถานที่ฝึกประสบการณ์</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content Card */}
                <main className="flex-1 bg-white rounded-[30px] p-6 md:p-12 shadow-xl min-h-[600px] md:min-h-[800px]">
                    {activeSection === 'record' ? (
                        <>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                                <div>
                                    <div className="mb-4"><h1 className="text-3xl font-bold text-gray-900 inline-flex items-center border-b border-gray-200 pb-2"><FileText className="text-[#032B68] mr-3" size={32} strokeWidth={2} />บันทึกการฝึกประสบการณ์วิชาชีพ</h1></div>
                                    <p className="text-base text-gray-400 mt-2 font-medium">กรอกข้อมูลนักศึกษา อาจารย์ที่ปรึกษา และสถานที่ฝึก เพื่อใช้ประกอบการจัดทำเอกสารและการประเมินผลการฝึก</p>
                                </div>
                                <button className="mt-4 md:mt-0 px-6 py-2.5 bg-blue-50 text-blue-600 text-sm font-semibold rounded-full hover:bg-blue-100 transition-colors whitespace-nowrap">แบบฟอร์มบันทึกการฝึก</button>
                            </div>

                            {message && <div className={`mb-4 p-3 rounded-xl text-center font-bold ${message.includes('สำเร็จ') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{message}</div>}

                            <div className="space-y-6">
                                {/* Row 1: Prefix, Name, Student ID */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="md:col-span-1">
                                        <label className="block text-base font-bold text-gray-900 mb-2">คำนำหน้า</label>
                                        <CustomDropdown value={prefix} onChange={setPrefix} options={prefixes} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-base font-bold text-gray-900 mb-2">ชื่อ - นามสกุล นักศึกษา</label>
                                        <input type="text" value={fullName} disabled className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-500 bg-gray-50 font-medium text-base" />
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className="block text-base font-bold text-gray-900 mb-2">รหัสนักศึกษา</label>
                                        <input type="text" value={studentCode} disabled className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-500 bg-gray-50 font-medium text-base" />
                                    </div>
                                </div>

                                {/* Row 2: Major, Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-base font-bold text-gray-900 mb-2">สาขาวิชา</label>
                                        <CustomDropdown value={major || 'สาขาวิชา'} onChange={setMajor} options={departments.map((d: any) => d.name_th)} />
                                    </div>
                                    <div>
                                        <label className="block text-base font-bold text-gray-900 mb-2">ภาคในเวลาราชการ</label>
                                        <CustomDropdown value={section} onChange={setSection} options={sections} />
                                    </div>
                                </div>

                                {/* Row 3: Advisor - READ ONLY (กำหนดโดยอาจารย์) */}
                                <div>
                                    <label className="block text-base font-bold text-gray-900 mb-2">ชื่ออาจารย์ที่ปรึกษา <span className="text-sm text-blue-500 font-normal">(กำหนดโดยอาจารย์)</span></label>
                                    <input
                                        type="text"
                                        value={advisorName || 'ยังไม่มีอาจารย์ที่ปรึกษา - รออาจารย์เลือกนักศึกษา'}
                                        disabled
                                        className={`w-full px-5 py-3 rounded-full border font-medium text-base ${advisorName ? 'border-green-200 text-green-700 bg-green-50' : 'border-orange-200 text-orange-500 bg-orange-50'}`}
                                    />
                                </div>

                                {/* Row 4: Supervisor, Position */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-base font-bold text-gray-900 mb-2">ชื่อผู้นิเทศประจำหน่วยงาน</label>
                                        <input type="text" value={supervisorName} onChange={e => setSupervisorName(e.target.value)} placeholder="ชื่อจริง - นามสกุล" className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-base" />
                                    </div>
                                    <div>
                                        <label className="block text-base font-bold text-gray-900 mb-2">ตำแหน่ง</label>
                                        <input type="text" value={supervisorPosition} onChange={e => setSupervisorPosition(e.target.value)} placeholder="ตำแหน่ง" className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-base" />
                                    </div>
                                </div>

                                {/* Row 5: Workplace */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-base font-bold text-gray-900 mb-2">ชื่อสถานที่ทำงาน</label>
                                        <input type="text" value={workplaceName} onChange={e => setWorkplaceName(e.target.value)} placeholder="ชื่อบริษัท" className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-base" />
                                    </div>
                                    <div>
                                        <label className="block text-base font-bold text-gray-900 mb-2">สถานที่ตั้งทำงาน</label>
                                        <input type="text" value={workplaceAddress} onChange={e => setWorkplaceAddress(e.target.value)} placeholder="เช่น บริษัท เอ บี ซี จำกัด" className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-base" />
                                    </div>
                                </div>

                                {/* Row 6: Task Description */}
                                <div>
                                    <label className="block text-base font-bold text-gray-900 mb-2">ลักษณะงานที่ได้รับมอบหมาย</label>
                                    <textarea rows={6} value={taskDescription} onChange={e => setTaskDescription(e.target.value)} placeholder="เช่น รับหน้าที่ในการทำuxui" className="w-full px-5 py-4 rounded-2xl border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none font-medium text-base"></textarea>
                                </div>

                                {/* Row 7: Signatures */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-base font-bold text-gray-900 mb-2">ลายเซ็นพี่เลี้ยง</label>
                                        <div className="h-40 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center"><div className="w-full h-full border-2 border-dashed border-gray-200 rounded-xl m-2 bg-white/50"></div></div>
                                    </div>
                                    <div>
                                        <label className="block text-base font-bold text-gray-900 mb-2">ลายเซ็นอาจารย์</label>
                                        <div className="h-40 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center"><div className="w-full h-full border-2 border-dashed border-gray-200 rounded-xl m-2 bg-white/50"></div></div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col md:flex-row justify-between items-center pt-8 gap-4">
                                    <button onClick={handleClear} className="text-blue-600 hover:text-blue-700 font-bold text-base hover:underline">ล้างข้อมูลทั้งหมด</button>
                                    <button onClick={handleSave} disabled={saving} className="px-10 py-3 bg-[#5cb85c] hover:bg-[#4cae4c] disabled:bg-gray-400 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">{saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูลการฝึก'}</button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col">
                            <div className="mb-1"><h1 className="text-3xl font-bold text-gray-900 inline-block border-b border-gray-200 pb-2">สถานที่ฝึกประสบการณ์</h1></div>
                            <p className="text-base text-gray-400 mb-8 font-medium">อัปโหลดแผนที่และแผนผังการบริหาร เพื่อช่วยให้อาจารย์นิเทศและพี่เลี้ยงสามารถตรวจสอบและติดตามนักศึกษาได้สะดวก</p>
                            <div className="space-y-8 flex-1">
                                <div><h2 className="text-lg font-bold text-gray-900 mb-4">1.ประวัติ</h2>
                                    <div className="border border-dashed border-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer group">
                                        <div className="flex-1 text-center sm:text-left"><p className="text-base font-medium text-gray-700 group-hover:text-gray-900">ลากไฟล์มาวาง หรือกดปุ่ม "เลือกไฟล์"</p><p className="text-sm text-gray-400 mt-1">รองรับไฟล์ .jpg .png .pdf ขนาดไม่เกิน 5 MB</p></div>
                                        <button className="px-6 py-2 bg-white border border-gray-200 text-blue-600 rounded-full font-bold text-sm shadow-sm group-hover:border-blue-200 group-hover:shadow-md transition-all">เลือกไฟล์</button>
                                    </div>
                                </div>
                                <div><h2 className="text-lg font-bold text-gray-900 mb-4">2.แผนที่สถานที่ฝึก</h2>
                                    <div className="w-full h-[500px] bg-gray-100 rounded-2xl overflow-hidden relative">
                                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15501.76104860167!2d100.52834045!3d13.75199655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2996e3871d37b%3A0xe54e58284534438b!2sBangkok!5e0!3m2!1sen!2sth!4v1717345678901!5m2!1sen!2sth" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="w-full h-full object-cover"></iframe>
                                    </div>
                                </div>
                                <div><h2 className="text-lg font-bold text-gray-900 mb-4">3.แผนผังการบริหาร</h2>
                                    <div className="border border-dashed border-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer group">
                                        <div className="flex-1 text-center sm:text-left"><p className="text-base font-medium text-gray-700 group-hover:text-gray-900">ลากไฟล์มาวาง หรือกดปุ่ม "เลือกไฟล์"</p><p className="text-sm text-gray-400 mt-1">รองรับไฟล์ .jpg .png .pdf ขนาดไม่เกิน 5 MB</p></div>
                                        <button className="px-6 py-2 bg-white border border-gray-200 text-blue-600 rounded-full font-bold text-sm shadow-sm group-hover:border-blue-200 group-hover:shadow-md transition-all">เลือกไฟล์</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ExperiencePage;
