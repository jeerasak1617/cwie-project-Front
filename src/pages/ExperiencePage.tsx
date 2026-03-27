import { useState, useEffect } from 'react';
import { FileText, MapPin, Plus, Briefcase } from 'lucide-react';
import CustomDropdown from '../components/ui/CustomDropdown';
import api from '../api';

const ExperiencePage = () => {
    const [activeSection, setActiveSection] = useState('create');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const [profile, setProfile] = useState<any>({});
    const [internship, setInternship] = useState<any>({});
    const [hasInternship, setHasInternship] = useState(false);

    const [departments, setDepartments] = useState<any[]>([]);
    const [advisors, setAdvisors] = useState<any[]>([]);
    const [filteredAdvisors, setFilteredAdvisors] = useState<any[]>([]);
    const [companies, setCompanies] = useState<any[]>([]);
    const [semesters, setSemesters] = useState<any[]>([]);

    // Form State (บันทึกการฝึก)
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

    // Form State (สร้างใหม่)
    const [newCompanyId, setNewCompanyId] = useState('');
    const [newSemesterId, setNewSemesterId] = useState('');
    const [newStartDate, setNewStartDate] = useState('');
    const [newEndDate, setNewEndDate] = useState('');
    const [newJobTitle, setNewJobTitle] = useState('');
    const [newRequiredHours, setNewRequiredHours] = useState('560');

    const prefixes = ['นาย', 'นางสาว', 'นาง'];
    const sections = ['ภาคในเวลาราชการ', 'ภาคนอกเวลาราชการ'];
    const inputClass = "w-full px-5 py-3 rounded-full border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-base";
    const selectClass = "w-full px-5 py-3 rounded-full border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-base appearance-none cursor-pointer";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileRes = await api.get('/student/profile').catch(() => ({ data: {} }));
                const p = profileRes.data;
                setProfile(p);
                setPrefix(p.prefix_th || 'นาย');
                setFullName(`${p.first_name_th || ''} ${p.last_name_th || ''}`);
                setStudentCode(p.student_code || '');
                // แปลค่า study_program_type
                const sectionMap: Record<string, string> = { regular: 'ภาคในเวลาราชการ', part_time: 'ภาคนอกเวลาราชการ' };
                setSection(sectionMap[p.study_program_type] || p.study_program_type || 'ภาคในเวลาราชการ');

                const internRes = await api.get('/student/internship').catch(() => ({ data: {} }));
                const internData = internRes.data;
                setInternship(internData);
                const has = !!internData.id;
                setHasInternship(has);
                if (has) setActiveSection('record');

                if (internData.id) {
                    // ดึงข้อมูลจาก internship response โดยตรง
                    setTaskDescription(internData.job_description || internData.job_title || '');

                    // ชื่อสถานที่ทำงาน + ที่อยู่
                    if (internData.company) {
                        setWorkplaceName(internData.company.name_th || internData.company.name_en || '');
                        setWorkplaceAddress(internData.company.address || '');
                    }

                    // ชื่อพี่เลี้ยง + ตำแหน่ง
                    if (internData.supervisor) {
                        setSupervisorName(internData.supervisor.full_name || '');
                        setSupervisorPosition(internData.supervisor.position || '');
                    }

                    // ชื่ออาจารย์ที่ปรึกษา
                    if (internData.advisor) {
                        setAdvisorName(internData.advisor.full_name || '');
                    }
                }

                const deptRes = await api.get('/master/departments').catch(() => ({ data: [] }));
                const depts = Array.isArray(deptRes.data) ? deptRes.data : deptRes.data.departments || [];
                setDepartments(depts);
                if (p.department_id && depts.length > 0) {
                    const dept = depts.find((d: any) => d.id === p.department_id);
                    if (dept) setMajor(dept.name_th);
                }

                const advRes = await api.get('/master/advisors').catch(() => ({ data: [] }));
                const advs = Array.isArray(advRes.data) ? advRes.data : advRes.data.advisors || [];
                setAdvisors(advs);
                setFilteredAdvisors(advs);

                const compRes = await api.get('/master/companies', { params: { per_page: 100 } }).catch(() => ({ data: { companies: [] } }));
                setCompanies(compRes.data.companies || compRes.data || []);

                const semRes = await api.get('/master/semesters').catch(() => ({ data: [] }));
                setSemesters(Array.isArray(semRes.data) ? semRes.data : []);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!major || advisors.length === 0) { setFilteredAdvisors(advisors); return; }
        const dept = departments.find((d: any) => d.name_th === major);
        if (dept) {
            const filtered = advisors.filter((a: any) => a.department_id === dept.id || !a.department_id);
            setFilteredAdvisors(filtered.length > 0 ? filtered : advisors);
        } else { setFilteredAdvisors(advisors); }
    }, [major, advisors, departments]);

    const handleSave = async () => {
        setSaving(true); setMessage('');
        try {
            const selectedAdvisor = advisors.find((a: any) =>
                `${a.prefix_th || ''} ${a.first_name_th} ${a.last_name_th}`.trim() === advisorName ||
                `${a.first_name_th} ${a.last_name_th}` === advisorName
            );
            await api.put('/student/internship-info', null, {
                params: {
                    advisor_user_id: selectedAdvisor?.id || undefined,
                    supervisor_name: supervisorName || undefined,
                    company_name: workplaceName || undefined,
                    company_address: workplaceAddress || undefined,
                    job_description: taskDescription || undefined,
                    study_program_type: section || undefined,
                }
            });
            setMessage('บันทึกข้อมูลการฝึกสำเร็จ!');
            setTimeout(() => setMessage(''), 3000);
        } catch (e: any) { setMessage(e.response?.data?.detail || 'เกิดข้อผิดพลาด'); }
        finally { setSaving(false); }
    };

    const handleClear = () => {
        setSupervisorName(''); setSupervisorPosition('');
        setWorkplaceName(''); setWorkplaceAddress('');
        setTaskDescription(''); setAdvisorName('');
    };

    const handleCreateInternship = async () => {
        if (!newCompanyId || !newSemesterId || !newStartDate || !newEndDate) {
            setMessage('กรุณากรอกข้อมูลให้ครบ (สถานประกอบการ, ภาคเรียน, วันเริ่ม-สิ้นสุด)');
            return;
        }
        setSaving(true); setMessage('');
        try {
            await api.post('/student/internship', null, {
                params: {
                    company_id: Number(newCompanyId), semester_id: Number(newSemesterId),
                    start_date: newStartDate, end_date: newEndDate,
                    job_title: newJobTitle || undefined, required_hours: Number(newRequiredHours) || 560,
                }
            });
            setMessage('สร้างข้อมูลการฝึกงานสำเร็จ!');
            setTimeout(() => window.location.reload(), 1500);
        } catch (e: any) { setMessage(e.response?.data?.detail || 'เกิดข้อผิดพลาดในการสร้างข้อมูล'); }
        finally { setSaving(false); }
    };

    if (loading) return <div className="text-center py-20 text-gray-400">กำลังโหลด...</div>;

    // Sidebar menu items
    const sidebarItems = [
        { key: 'create', label: 'สร้างข้อมูล\nการฝึกงาน', icon: Plus, color: 'text-green-500', activeBg: 'bg-green-50' },
        { key: 'record', label: 'บันทึกการฝึก\nประสบการณ์วิชาชีพ', icon: FileText, color: 'text-blue-500', activeBg: 'bg-blue-50' },
        { key: 'place', label: 'สถานที่ฝึกประสบการณ์', icon: MapPin, color: 'text-orange-500', activeBg: 'bg-orange-50' },
    ];

    return (
        <div className="">
            <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-5 xl:gap-7">
                {/* Sidebar */}
                <aside className="w-full xl:w-80 bg-white rounded-[30px] p-4 md:p-6 shadow-xl min-h-fit xl:min-h-[800px] flex flex-col">
                    <div className="flex flex-col gap-2 xl:gap-4 pb-2 xl:pb-0">
                        {sidebarItems.map((item) => {
                            const isActive = activeSection === item.key;
                            // ถ้ามี internship แล้ว แสดงเครื่องหมายถูกที่เมนูสร้าง
                            const showCheck = item.key === 'create' && hasInternship;
                            return (
                                <button
                                    key={item.key}
                                    onClick={() => { setActiveSection(item.key); setMessage(''); }}
                                    className={`w-full text-left px-4 md:px-5 py-3 rounded-xl font-bold text-base md:text-lg transition-all duration-200 flex items-center gap-3 ${isActive ? 'bg-[#fff5d0] text-[#032B68] shadow-sm xl:translate-x-1' : 'text-gray-500 hover:bg-[#fff5d0] hover:text-[#032B68] xl:hover:translate-x-1'}`}
                                >
                                    <div className={`p-1 rounded-full ${isActive ? 'bg-[#032B68]/10' : item.activeBg} flex-shrink-0`}>
                                        <item.icon size={24} className={isActive ? 'text-[#032B68]' : item.color} strokeWidth={isActive ? 2 : 1.5} />
                                    </div>
                                    <span className="whitespace-pre-line">{item.label}</span>
                                    {showCheck && <span className="ml-auto text-green-500 text-sm font-bold">✓</span>}
                                </button>
                            );
                        })}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 bg-white rounded-[30px] p-6 md:p-12 shadow-xl min-h-[600px] md:min-h-[800px]">

                    {/* ========== หน้า 1: สร้างข้อมูลการฝึกงาน ========== */}
                    {activeSection === 'create' && (
                        <div>
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-gray-900 inline-flex items-center border-b border-gray-200 pb-2">
                                    <Plus className="text-[#032B68] mr-3" size={32} strokeWidth={2} />สร้างข้อมูลการฝึกงาน
                                </h1>
                                <p className="text-base text-gray-400 mt-3 font-medium">
                                    {hasInternship ? 'มีข้อมูลการฝึกงานแล้ว สามารถดูหรือแก้ไขได้ที่หน้า "บันทึกการฝึกประสบการณ์วิชาชีพ"' : 'กรุณากรอกข้อมูลเพื่อเริ่มต้นการฝึกประสบการณ์วิชาชีพ'}
                                </p>
                            </div>

                            {message && <div className={`mb-4 p-3 rounded-xl text-center font-bold ${message.includes('สำเร็จ') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{message}</div>}

                            {hasInternship ? (
                                <div className="space-y-4">
                                    <div className="p-6 bg-green-50 rounded-2xl border border-green-200">
                                        <p className="text-lg font-bold text-green-800 mb-2">มีข้อมูลการฝึกงานแล้ว</p>
                                        <div className="text-green-700 space-y-1">
                                            <p>รหัสฝึกงาน: <span className="font-bold">{internship.internship_code}</span></p>
                                            {internship.start_date && <p>วันเริ่ม: {internship.start_date} — วันสิ้นสุด: {internship.end_date}</p>}
                                            {internship.job_title && <p>ตำแหน่ง: {internship.job_title}</p>}
                                            <p>ชั่วโมงที่ต้องฝึก: {internship.required_hours || 0} ชม. | ฝึกแล้ว: {internship.completed_hours || 0} ชม.</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setActiveSection('record')} className="px-8 py-3 bg-[#4472c4] hover:bg-[#3561b3] text-white font-bold text-lg rounded-full shadow-lg transition-all">
                                        ไปหน้าบันทึกการฝึก →
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                        <p className="text-sm font-bold text-blue-800 mb-1">นักศึกษา</p>
                                        <p className="text-blue-700">{prefix} {fullName} | รหัส {studentCode}</p>
                                    </div>
                                    <div>
                                        <label className="block text-base font-bold text-gray-900 mb-2">สถานประกอบการ</label>
                                        <select value={newCompanyId} onChange={e => setNewCompanyId(e.target.value)} className={selectClass} required>
                                            <option value="">-- เลือกสถานประกอบการ --</option>
                                            {companies.map((c: any) => <option key={c.id} value={c.id}>{c.name_th || c.name_en}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-base font-bold text-gray-900 mb-2">ภาคเรียน</label>
                                        <select value={newSemesterId} onChange={e => setNewSemesterId(e.target.value)} className={selectClass} required>
                                            <option value="">-- เลือกภาคเรียน --</option>
                                            {semesters.map((s: any) => <option key={s.id} value={s.id}>{s.term}/{s.year} {s.is_current ? '(ปัจจุบัน)' : ''}</option>)}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-base font-bold text-gray-900 mb-2">วันเริ่มฝึกงาน</label>
                                            <input type="date" value={newStartDate} onChange={e => setNewStartDate(e.target.value)} className={inputClass} required />
                                        </div>
                                        <div>
                                            <label className="block text-base font-bold text-gray-900 mb-2">วันสิ้นสุดฝึกงาน</label>
                                            <input type="date" value={newEndDate} onChange={e => setNewEndDate(e.target.value)} className={inputClass} required />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-base font-bold text-gray-900 mb-2">ตำแหน่งงาน</label>
                                            <input type="text" value={newJobTitle} onChange={e => setNewJobTitle(e.target.value)} placeholder="เช่น Backend Developer" className={inputClass} />
                                        </div>
                                        <div>
                                            <label className="block text-base font-bold text-gray-900 mb-2">ชั่วโมงที่ต้องฝึก</label>
                                            <input type="number" value={newRequiredHours} onChange={e => setNewRequiredHours(e.target.value)} placeholder="560" className={inputClass} />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <button onClick={handleCreateInternship} disabled={saving} className="px-10 py-3 bg-[#4472c4] hover:bg-[#3561b3] disabled:bg-gray-400 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                                            {saving ? 'กำลังสร้าง...' : 'สร้างข้อมูลการฝึกงาน'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ========== หน้า 2: บันทึกการฝึกประสบการณ์วิชาชีพ ========== */}
                    {activeSection === 'record' && (
                        <div>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                                <div>
                                    <div className="mb-4"><h1 className="text-3xl font-bold text-gray-900 inline-flex items-center border-b border-gray-200 pb-2"><FileText className="text-[#032B68] mr-3" size={32} strokeWidth={2} />บันทึกการฝึกประสบการณ์วิชาชีพ</h1></div>
                                    <p className="text-base text-gray-400 mt-2 font-medium">กรอกข้อมูลนักศึกษา อาจารย์ที่ปรึกษา และสถานที่ฝึก</p>
                                </div>
                                <button className="mt-4 md:mt-0 px-6 py-2.5 bg-blue-50 text-blue-600 text-sm font-semibold rounded-full hover:bg-blue-100 transition-colors whitespace-nowrap">แบบฟอร์มบันทึกการฝึก</button>
                            </div>

                            {message && <div className={`mb-4 p-3 rounded-xl text-center font-bold ${message.includes('สำเร็จ') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{message}</div>}

                            <div className="space-y-6">
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
                                <div>
                                    <label className="block text-base font-bold text-gray-900 mb-2">
                                        ชื่ออาจารย์ที่ปรึกษา {major && <span className="text-sm text-blue-500 font-normal">({major})</span>}
                                        {internship?.advisor && <span className="text-xs text-green-500 ml-2">(ดึงจากระบบ)</span>}
                                    </label>
                                    {internship?.advisor ? (
                                        <input type="text" value={advisorName} readOnly className="w-full px-5 py-3 rounded-full border border-green-200 text-gray-700 bg-green-50 font-medium text-base cursor-not-allowed" />
                                    ) : (
                                        <CustomDropdown value={advisorName || 'ชื่ออาจารย์ที่ปรึกษา'} onChange={setAdvisorName} options={filteredAdvisors.map((a: any) => `${a.prefix_th || ''} ${a.first_name_th} ${a.last_name_th}`.trim())} />
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-base font-bold text-gray-900 mb-2">
                                            ชื่อผู้นิเทศประจำหน่วยงาน
                                            {internship?.supervisor && <span className="text-xs text-green-500 ml-2">(ดึงจากระบบ)</span>}
                                        </label>
                                        <input type="text" value={supervisorName} onChange={internship?.supervisor ? undefined : e => setSupervisorName(e.target.value)} readOnly={!!internship?.supervisor} placeholder="รอกำหนดโดยอาจารย์" className={internship?.supervisor ? "w-full px-5 py-3 rounded-full border border-green-200 text-gray-700 bg-green-50 font-medium text-base cursor-not-allowed" : inputClass} />
                                    </div>
                                    <div>
                                        <label className="block text-base font-bold text-gray-900 mb-2">ตำแหน่ง</label>
                                        <input type="text" value={supervisorPosition} onChange={internship?.supervisor ? undefined : e => setSupervisorPosition(e.target.value)} readOnly={!!internship?.supervisor} placeholder="รอกำหนดโดยอาจารย์" className={internship?.supervisor ? "w-full px-5 py-3 rounded-full border border-green-200 text-gray-700 bg-green-50 font-medium text-base cursor-not-allowed" : inputClass} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-base font-bold text-gray-900 mb-2">
                                            ชื่อสถานที่ทำงาน
                                            {internship?.company && <span className="text-xs text-green-500 ml-2">(ดึงจากระบบ)</span>}
                                        </label>
                                        <input type="text" value={workplaceName} readOnly={!!internship?.company} onChange={internship?.company ? undefined : e => setWorkplaceName(e.target.value)} placeholder="ชื่อบริษัท" className={internship?.company ? "w-full px-5 py-3 rounded-full border border-green-200 text-gray-700 bg-green-50 font-medium text-base cursor-not-allowed" : inputClass} />
                                    </div>
                                    <div>
                                        <label className="block text-base font-bold text-gray-900 mb-2">สถานที่ตั้งทำงาน</label>
                                        <input type="text" value={workplaceAddress} readOnly={!!internship?.company} onChange={internship?.company ? undefined : e => setWorkplaceAddress(e.target.value)} placeholder="ที่อยู่บริษัท" className={internship?.company ? "w-full px-5 py-3 rounded-full border border-green-200 text-gray-700 bg-green-50 font-medium text-base cursor-not-allowed" : inputClass} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-base font-bold text-gray-900 mb-2">ลักษณะงานที่ได้รับมอบหมาย</label>
                                    <textarea rows={6} value={taskDescription} onChange={e => setTaskDescription(e.target.value)} placeholder="เช่น รับหน้าที่ในการทำuxui" className="w-full px-5 py-4 rounded-2xl border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none font-medium text-base"></textarea>
                                </div>
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
                                <div className="flex flex-col md:flex-row justify-between items-center pt-8 gap-4">
                                    <button onClick={handleClear} className="text-blue-600 hover:text-blue-700 font-bold text-base hover:underline">ล้างข้อมูลทั้งหมด</button>
                                    <button onClick={handleSave} disabled={saving} className="px-10 py-3 bg-[#5cb85c] hover:bg-[#4cae4c] disabled:bg-gray-400 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all">{saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูลการฝึก'}</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========== หน้า 3: สถานที่ฝึกประสบการณ์ ========== */}
                    {activeSection === 'place' && (
                        <div className="h-full flex flex-col">
                            <div className="mb-1"><h1 className="text-3xl font-bold text-gray-900 inline-block border-b border-gray-200 pb-2">สถานที่ฝึกประสบการณ์</h1></div>
                            <p className="text-base text-gray-400 mb-8 font-medium">อัปโหลดแผนที่และแผนผังการบริหาร</p>
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
