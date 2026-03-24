import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, Clock } from 'lucide-react';
import api from '../../api';

const ScheduleSupervisionPage = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [workplace, setWorkplace] = useState('');
    const [supervisionDate, setSupervisionDate] = useState<Date | null>(null);
    const [supervisionTime, setSupervisionTime] = useState<Date | null>(null);
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => { api.get('/advisor/students').then(res => setStudents(res.data.students || [])).catch(() => {}); }, []);

    const handleSave = async () => {
        if (!selectedStudentId || !supervisionDate) { setMessage('กรุณาเลือกนักศึกษาและวันที่'); return; }
        setLoading(true);
        try {
            const params: any = {
                internship_id: parseInt(selectedStudentId),
                scheduled_date: supervisionDate.toISOString().split('T')[0],
                note: note.trim() || undefined,
                location: workplace.trim() || undefined,
            };
            if (supervisionTime) params.scheduled_time = supervisionTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
            await api.post('/advisor/visit-schedule', null, { params });
            setMessage('บันทึกวันนิเทศสำเร็จ!');
            setTimeout(() => navigate('/teacher'), 1500);
        } catch (e: any) { setMessage(e.response?.data?.detail || 'เกิดข้อผิดพลาด'); }
        finally { setLoading(false); }
    };

    return (
        <div className="flex items-center justify-center">
            <div className="bg-white rounded-[3rem] p-6 md:p-12 w-full max-w-5xl shadow-2xl border border-gray-100 relative flex flex-col">
                <h1 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-8">ลงวันนิเทศ</h1>
                {message && <div className={`mb-4 p-3 rounded-xl text-center font-bold ${message.includes('สำเร็จ') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{message}</div>}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-gray-900 font-bold block">ชื่อนักศึกษา</label>
                        <select value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)} className="w-full bg-transparent border-b border-gray-300 py-2 text-gray-700 focus:outline-none focus:border-[#4472c4]">
                            <option value="">เลือกนักศึกษา</option>
                            {students.map((s: any) => <option key={s.internship_id} value={s.internship_id}>{s.student_name || `นักศึกษา #${s.internship_id}`}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-gray-900 font-bold block">วันที่นิเทศ</label>
                            <div className="relative">
                                <DatePicker selected={supervisionDate} onChange={d => setSupervisionDate(d)} placeholderText="วัน / เดือน / ปี" className="w-full bg-transparent border-b border-gray-300 py-2 text-gray-700 focus:outline-none focus:border-[#4472c4] rounded-none" wrapperClassName="w-full" />
                                <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-gray-900 font-bold block">เวลานิเทศ</label>
                            <div className="relative">
                                <DatePicker selected={supervisionTime} onChange={d => setSupervisionTime(d)} showTimeSelect showTimeSelectOnly timeIntervals={15} dateFormat="HH:mm" placeholderText="เช่น 09:30" className="w-full bg-transparent border-b border-gray-300 py-2 text-gray-700 focus:outline-none focus:border-[#4472c4] rounded-none" wrapperClassName="w-full" />
                                <Clock className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-gray-900 font-bold block">สถานประกอบการ</label>
                        <input type="text" value={workplace} onChange={e => setWorkplace(e.target.value)} placeholder="ระบุสถานประกอบการ" className="w-full bg-transparent border-b border-gray-300 py-2 text-gray-700 focus:outline-none focus:border-[#4472c4] rounded-none placeholder-gray-400" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-gray-900 font-bold block">หมายเหตุเพิ่มเติม</label>
                        <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="เช่น นัดช่วงเช้า" className="w-full bg-transparent border-b border-gray-300 py-2 text-gray-700 focus:outline-none focus:border-[#4472c4] rounded-none placeholder-gray-400 resize-none" />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-10">
                    <Link to="/teacher/history" className="text-[#4472c4] font-bold hover:underline">ดูประวัติ / แก้ไข การลงวันนิเทศน์</Link>
                    <button onClick={handleSave} disabled={loading} className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#5cc945] disabled:bg-gray-400 text-white font-bold hover:bg-[#4db83a] shadow-lg transition-all transform hover:-translate-y-1">{loading ? 'กำลังบันทึก...' : 'บันทึกวันนิเทศ'}</button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleSupervisionPage;
