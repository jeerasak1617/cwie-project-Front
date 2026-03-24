import { useState } from 'react';
import { Calendar, Clock, Save, History } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Link } from 'react-router-dom';
import api from '../api';

const DailyLogPage = () => {
    const [selectedDate] = useState<Date | null>(new Date());
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [activities, setActivities] = useState('');
    const [problems, setProblems] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');

    const handleSave = async () => {
        if (!selectedDate || !activities.trim()) { setMessage('กรุณากรอกกิจกรรม'); setMessageType('error'); setTimeout(() => setMessage(''), 3000); return; }
        setLoading(true);
        try {
            const logDate = selectedDate.toISOString().split('T')[0];
            let hoursSpent: number | undefined;
            if (startTime && endTime) hoursSpent = Math.round((endTime.getTime() - startTime.getTime()) / 3600000 * 100) / 100;
            await api.post('/student/daily-log', null, { params: { log_date: logDate, activities: activities.trim(), problems: problems.trim() || undefined, hours_spent: hoursSpent } });
            setMessage('บันทึกประจำวันสำเร็จ!'); setMessageType('success'); setActivities(''); setProblems(''); setStartTime(null); setEndTime(null);
        } catch (err: any) { setMessage(err.response?.data?.detail || 'เกิดข้อผิดพลาด'); setMessageType('error'); }
        finally { setLoading(false); setTimeout(() => setMessage(''), 3000); }
    };

    return (
        <div className="flex items-center justify-center">
            <div className="bg-white rounded-[3rem] p-6 md:p-12 w-full max-w-[1600px] shadow-2xl relative flex flex-col min-h-[800px]">
                <div className="mb-8 md:mb-10 relative z-20">
                    <div className="mb-6"><h1 className="text-2xl md:text-4xl font-bold text-gray-900 inline-block border-b border-gray-200 pb-4">บันทึกประจำวันการฝึกประสบการณ์วิชาชีพ</h1></div>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="relative w-full md:w-auto">
                            <DatePicker selected={selectedDate} onChange={() => {}} dateFormat="eee d MMMM yyyy" disabled className="bg-blue-50 text-blue-900 font-bold py-3 pl-12 pr-6 rounded-full border-none text-base md:text-lg w-full md:w-[280px]" />
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={24} />
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                            <div className="relative w-full sm:w-auto">
                                <DatePicker selected={startTime} onChange={(date) => setStartTime(date)} showTimeSelect showTimeSelectOnly timeIntervals={15} timeCaption="Time" dateFormat="HH:mm" placeholderText="เวลาเข้า" className="bg-white text-gray-700 font-medium py-3 pl-12 pr-6 rounded-full border border-gray-200 focus:ring-2 focus:ring-blue-500/20 text-base md:text-lg w-full sm:w-[160px] shadow-sm" />
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 pointer-events-none" size={20} />
                            </div>
                            <span className="text-gray-400 font-bold hidden sm:inline">ถึง</span>
                            <div className="relative w-full sm:w-auto">
                                <DatePicker selected={endTime} onChange={(date) => setEndTime(date)} showTimeSelect showTimeSelectOnly timeIntervals={15} timeCaption="Time" dateFormat="HH:mm" placeholderText="เวลาออก" className="bg-white text-gray-700 font-medium py-3 pl-12 pr-6 rounded-full border border-gray-200 focus:ring-2 focus:ring-blue-500/20 text-base md:text-lg w-full sm:w-[160px] shadow-sm" />
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 pointer-events-none" size={20} />
                            </div>
                        </div>
                    </div>
                </div>
                {message && <div className={`mb-4 p-3 rounded-xl text-center font-bold ${messageType === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{message}</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12 flex-1 relative z-10">
                    <div className="bg-[#f8fafc] rounded-3xl p-6 md:p-8 flex flex-col h-full border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <label className="text-lg md:text-xl font-bold text-gray-800 mb-2">กิจกรรมประจำวัน</label>
                        <p className="text-gray-400 text-sm mb-4">สรุปสิ่งที่ทำ เช่น ออกแบบหน้าเว็บ, เขียนโค้ด, ประชุม</p>
                        <textarea value={activities} onChange={(e) => setActivities(e.target.value)} className="w-full flex-1 bg-white rounded-2xl p-4 md:p-6 text-base md:text-lg text-gray-700 placeholder-gray-300 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none focus:outline-none min-h-[200px]" placeholder="พิมพ์รายละเอียดกิจกรรมที่นี่..." />
                    </div>
                    <div className="bg-[#f8fafc] rounded-3xl p-6 md:p-8 flex flex-col h-full border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <label className="text-lg md:text-xl font-bold text-gray-800 mb-2">ปัญหาและข้อเสนอแนะ</label>
                        <p className="text-gray-400 text-sm mb-4">ปัญหาที่พบ + ข้อเสนอแนะเพื่อการปรับปรุง</p>
                        <textarea value={problems} onChange={(e) => setProblems(e.target.value)} className="w-full flex-1 bg-white rounded-2xl p-4 md:p-6 text-base md:text-lg text-gray-700 placeholder-gray-300 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none focus:outline-none min-h-[200px]" placeholder="พิมพ์รายละเอียดปัญหาและข้อเสนอแนะที่นี่..." />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-auto pt-8 border-t border-gray-100">
                    <Link to="/daily-log-history" className="flex items-center gap-2 text-[#4472c4] font-bold text-base md:text-lg hover:opacity-80 transition-opacity px-4 py-2 rounded-xl hover:bg-blue-50"><History size={24} />ดูประวัติทั้งหมด</Link>
                    <button onClick={handleSave} disabled={loading} className="flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-[#5cc945] hover:bg-[#4db83a] disabled:bg-gray-400 text-white font-bold text-lg shadow-[0_4px_15px_rgba(92,201,69,0.3)] transition-all hover:-translate-y-1 w-full md:w-auto"><Save size={24} />{loading ? 'กำลังบันทึก...' : 'บันทึก'}</button>
                </div>
            </div>
        </div>
    );
};

export default DailyLogPage;
