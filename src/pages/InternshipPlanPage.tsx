import { useState } from 'react';
import { Calendar, Clock, Save, History, Building2, FileText } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Link } from 'react-router-dom';
import api from '../api';

const InternshipPlanPage = () => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [place, setPlace] = useState('');
    const [description, setDescription] = useState('');
    const [taskName, setTaskName] = useState('');
    const [plannedHours, setPlannedHours] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');

    const handleSave = async () => {
        if (!taskName.trim() || !startDate || !endDate) { setMessage('กรุณากรอกชื่องานและวันที่'); setMessageType('error'); setTimeout(() => setMessage(''), 3000); return; }
        setLoading(true);
        try {
            await api.post('/student/internship-plan', null, {
                params: {
                    task_name: taskName.trim(),
                    start_date: startDate.toISOString().split('T')[0],
                    end_date: endDate.toISOString().split('T')[0],
                    location: place.trim() || undefined,
                    task_description: description.trim() || undefined,
                    planned_hours: plannedHours ? parseInt(plannedHours) : undefined,
                }
            });
            setMessage('บันทึกแผนฝึกงานสำเร็จ!'); setMessageType('success');
            setTaskName(''); setPlace(''); setDescription(''); setPlannedHours(''); setStartDate(null); setEndDate(null);
        } catch (err: any) { setMessage(err.response?.data?.detail || 'เกิดข้อผิดพลาด'); setMessageType('error'); }
        finally { setLoading(false); setTimeout(() => setMessage(''), 3000); }
    };

    return (
        <div className="flex items-center justify-center">
            <div className="bg-white rounded-[3rem] p-12 w-full max-w-[1600px] shadow-2xl relative flex flex-col min-h-[800px]">
                <div className="mb-10">
                    <div className="mb-8"><h1 className="text-4xl font-bold text-gray-900 inline-block border-b border-gray-200 pb-4">แผนงานการฝึกประสบการณ์วิชาชีพ</h1></div>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                        <div className="lg:col-span-1">
                            <label className="text-gray-700 font-bold mb-2 flex items-center gap-2"><Building2 size={18} />สถานที่ฝึกงาน</label>
                            <input value={place} onChange={(e) => setPlace(e.target.value)} placeholder="ระบุสถานที่" className="w-full bg-white border border-gray-200 rounded-full py-3 px-6 text-gray-700 focus:outline-none focus:border-[#4472c4]" />
                        </div>
                        <div className="lg:col-span-1">
                            <label className="text-gray-700 font-bold mb-2 flex items-center gap-2"><FileText size={18} />ชื่องาน</label>
                            <input value={taskName} onChange={(e) => setTaskName(e.target.value)} placeholder="ระบุชื่องาน" className="w-full bg-white border border-gray-200 rounded-full py-3 px-6 text-gray-700 focus:outline-none focus:border-[#4472c4]" />
                        </div>
                        <div>
                            <label className="text-gray-700 font-bold mb-2 flex items-center gap-2"><Calendar size={18} />วันที่เริ่ม</label>
                            <DatePicker selected={startDate} onChange={(d) => setStartDate(d)} placeholderText="เลือกวันที่" className="w-full bg-white border border-gray-200 rounded-full py-3 px-6 text-gray-700 focus:outline-none focus:border-[#4472c4]" />
                        </div>
                        <div>
                            <label className="text-gray-700 font-bold mb-2 flex items-center gap-2"><Calendar size={18} />วันที่สิ้นสุด</label>
                            <DatePicker selected={endDate} onChange={(d) => setEndDate(d)} placeholderText="เลือกวันที่" className="w-full bg-white border border-gray-200 rounded-full py-3 px-6 text-gray-700 focus:outline-none focus:border-[#4472c4]" />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="text-gray-700 font-bold mb-2 flex items-center gap-2"><Clock size={18} />จำนวนชั่วโมง</label>
                        <input type="number" value={plannedHours} onChange={(e) => setPlannedHours(e.target.value)} placeholder="ชั่วโมง" className="w-48 bg-white border border-gray-200 rounded-full py-3 px-6 text-gray-700 focus:outline-none focus:border-[#4472c4]" />
                    </div>
                </div>
                {message && <div className={`mb-4 p-3 rounded-xl text-center font-bold ${messageType === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{message}</div>}
                <div className="flex-1 mb-8">
                    <div className="bg-[#f8fafc] rounded-3xl p-8 h-full border border-gray-100">
                        <label className="text-xl font-bold text-gray-800 mb-4 block">รายละเอียดแผนงาน</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-white rounded-2xl p-6 text-lg text-gray-700 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 resize-none focus:outline-none min-h-[250px]" placeholder="อธิบายรายละเอียดแผนงาน..." />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-100">
                    <Link to="/internship-plan-history" className="flex items-center gap-2 text-[#4472c4] font-bold text-lg hover:opacity-80 px-4 py-2 rounded-xl hover:bg-blue-50"><History size={24} />ดูประวัติ</Link>
                    <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-10 py-4 rounded-full bg-[#5cc945] hover:bg-[#4db83a] disabled:bg-gray-400 text-white font-bold text-lg shadow-[0_4px_15px_rgba(92,201,69,0.3)] transition-all hover:-translate-y-1"><Save size={24} />{loading ? 'กำลังบันทึก...' : 'บันทึก'}</button>
                </div>
            </div>
        </div>
    );
};

export default InternshipPlanPage;
