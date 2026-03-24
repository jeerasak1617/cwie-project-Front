import { useState, useEffect } from 'react';
import { FileText, MapPin, Save } from 'lucide-react';
import api from '../api';

const ExperiencePage = () => {
    const [activeSection, setActiveSection] = useState('record');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [profile, setProfile] = useState<any>({});
    const [internship, setInternship] = useState<any>({});

    // Form
    const [topic, setTopic] = useState('');
    const [description, setDescription] = useState('');
    const [skillsLearned, setSkillsLearned] = useState('');
    const [challenges, setChallenges] = useState('');

    useEffect(() => {
        api.get('/student/profile').then(res => setProfile(res.data)).catch(() => {});
        api.get('/student/internship').then(res => setInternship(res.data)).catch(() => {});
    }, []);

    const handleSave = async () => {
        if (!topic.trim()) { setMessage('กรุณากรอกหัวข้อ'); return; }
        setLoading(true);
        try {
            const today = new Date().toISOString().split('T')[0];
            await api.post('/student/experience', null, {
                params: { experience_date: today, topic: topic.trim(), description: description.trim() || undefined, skills_learned: skillsLearned.trim() || undefined, challenges: challenges.trim() || undefined }
            });
            setMessage('บันทึกประสบการณ์สำเร็จ!');
            setTopic(''); setDescription(''); setSkillsLearned(''); setChallenges('');
            setTimeout(() => setMessage(''), 3000);
        } catch (e: any) { setMessage(e.response?.data?.detail || 'เกิดข้อผิดพลาด'); }
        finally { setLoading(false); }
    };

    return (
        <div className="">
            <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-5 xl:gap-7">
                <aside className="w-full xl:w-80 bg-white rounded-[30px] p-4 md:p-6 shadow-xl min-h-fit xl:min-h-[800px] flex flex-col">
                    <div className="flex flex-col gap-2 xl:gap-4 pb-2 xl:pb-0">
                        <button onClick={() => setActiveSection('record')} className={`w-full text-left px-4 md:px-5 py-3 rounded-xl font-bold text-base md:text-lg transition-all duration-200 flex items-center gap-3 ${activeSection === 'record' ? 'bg-[#fff5d0] text-[#032B68] shadow-sm xl:translate-x-1' : 'text-gray-500 hover:bg-[#fff5d0] hover:text-[#032B68] xl:hover:translate-x-1'}`}>
                            <div className={`p-1 rounded-full ${activeSection === 'record' ? 'bg-[#032B68]/10' : 'bg-blue-50'} flex-shrink-0`}><FileText size={24} className={activeSection === 'record' ? 'text-[#032B68]' : 'text-blue-500'} /></div>
                            <span>บันทึกการฝึก<br />ประสบการณ์วิชาชีพ</span>
                        </button>
                        <button onClick={() => setActiveSection('place')} className={`w-full text-left px-4 md:px-5 py-3 rounded-xl font-bold text-base md:text-lg transition-all duration-200 flex items-center gap-3 ${activeSection === 'place' ? 'bg-[#fff5d0] text-[#032B68] shadow-sm xl:translate-x-1' : 'text-gray-500 hover:bg-[#fff5d0] hover:text-[#032B68] xl:hover:translate-x-1'}`}>
                            <div className={`p-1 rounded-full ${activeSection === 'place' ? 'bg-[#032B68]/10' : 'bg-orange-50'} flex-shrink-0`}><MapPin size={24} className={activeSection === 'place' ? 'text-[#032B68]' : 'text-orange-500'} /></div>
                            <span>สถานที่ฝึกประสบการณ์</span>
                        </button>
                    </div>
                </aside>

                <main className="flex-1 bg-white rounded-[30px] p-6 md:p-12 shadow-xl min-h-[600px] md:min-h-[800px]">
                    {activeSection === 'record' ? (
                        <>
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-gray-900 inline-flex items-center border-b border-gray-200 pb-2"><FileText className="text-[#032B68] mr-3" size={32} />บันทึกการฝึกประสบการณ์วิชาชีพ</h1>
                                <p className="text-base text-gray-400 mt-2 font-medium">กรอกข้อมูลประสบการณ์ที่ได้รับจากการฝึกงาน</p>
                            </div>
                            {message && <div className={`mb-4 p-3 rounded-xl text-center font-bold ${message.includes('สำเร็จ') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{message}</div>}
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-base font-bold text-gray-900 mb-2">ชื่อ - นามสกุล</label>
                                        <input type="text" value={`${profile.prefix_th || ''} ${profile.first_name_th || ''} ${profile.last_name_th || ''}`} disabled className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-500 bg-gray-50" />
                                    </div>
                                    <div>
                                        <label className="block text-base font-bold text-gray-900 mb-2">รหัสนักศึกษา</label>
                                        <input type="text" value={profile.student_code || ''} disabled className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-500 bg-gray-50" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-base font-bold text-gray-900 mb-2">หัวข้อประสบการณ์ *</label>
                                    <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="เช่น การพัฒนา REST API ด้วย FastAPI" className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium" />
                                </div>
                                <div>
                                    <label className="block text-base font-bold text-gray-900 mb-2">รายละเอียด</label>
                                    <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} placeholder="อธิบายรายละเอียดสิ่งที่ได้เรียนรู้" className="w-full px-5 py-4 rounded-2xl border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none font-medium" />
                                </div>
                                <div>
                                    <label className="block text-base font-bold text-gray-900 mb-2">ทักษะที่ได้รับ</label>
                                    <textarea rows={3} value={skillsLearned} onChange={e => setSkillsLearned(e.target.value)} placeholder="เช่น Python, FastAPI, PostgreSQL, Git" className="w-full px-5 py-4 rounded-2xl border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none font-medium" />
                                </div>
                                <div>
                                    <label className="block text-base font-bold text-gray-900 mb-2">ปัญหาและอุปสรรค</label>
                                    <textarea rows={3} value={challenges} onChange={e => setChallenges(e.target.value)} placeholder="ปัญหาที่พบระหว่างการฝึกงาน" className="w-full px-5 py-4 rounded-2xl border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none font-medium" />
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-10 py-3 bg-[#5cb85c] hover:bg-[#4cae4c] disabled:bg-gray-400 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"><Save size={20} />{loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูลการฝึก'}</button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col">
                            <div className="mb-1"><h1 className="text-3xl font-bold text-gray-900 inline-block border-b border-gray-200 pb-2">สถานที่ฝึกประสบการณ์</h1></div>
                            <p className="text-base text-gray-400 mb-8 font-medium">ข้อมูลสถานที่ฝึกงาน: {internship.job_title || '-'}</p>
                            <div className="space-y-8 flex-1">
                                <div className="w-full h-[500px] bg-gray-100 rounded-2xl overflow-hidden">
                                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15501.76104860167!2d100.52834045!3d13.75199655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2996e3871d37b%3A0xe54e58284534438b!2sBangkok!5e0!3m2!1sen!2sth!4v1717345678901!5m2!1sen!2sth" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
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
