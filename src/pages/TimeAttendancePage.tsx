import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import LeaveRequestModal from '../components/leave/LeaveRequestModal';
import OffsiteWorkModal from '../components/offsite/OffsiteWorkModal';

const TimeAttendancePage = () => {
    const [time, setTime] = useState(new Date());
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [isOffsiteModalOpen, setIsOffsiteModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({ totalDays: 0, lateDays: 0, earlyDays: 0, totalHours: 0, leaveDays: 0, absentDays: 0 });
    const [companyName, setCompanyName] = useState('สถานที่ฝึกงาน');

    useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
    useEffect(() => { loadStats(); loadInternship(); }, []);

    const loadInternship = async () => {
        try {
            const res = await api.get('/student/internship');
            if (res.data.company_id) {
                try { const c = await api.get(`/master/companies/${res.data.company_id}`); setCompanyName(c.data.name_th || c.data.name_en || 'สถานที่ฝึกงาน'); } catch {}
            }
        } catch {}
    };

    const loadStats = async () => {
        try {
            const now = new Date();
            const res = await api.get('/student/attendance', { params: { month: now.getMonth() + 1, year: now.getFullYear() } });
            const records = res.data.records || [];
            let totalHours = 0, lateDays = 0;
            records.forEach((r: any) => { if (r.hours_worked) totalHours += r.hours_worked; if (r.late_minutes > 0) lateDays++; });
            setStats(prev => ({ ...prev, totalDays: records.length, totalHours: Math.round(totalHours * 10) / 10, lateDays }));
        } catch {}
    };

    const showMsg = (msg: string, type: 'success' | 'error') => { setMessage(msg); setMessageType(type); setTimeout(() => setMessage(''), 3000); };

    const getGPS = async () => {
        try {
            const pos = await new Promise<GeolocationPosition>((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 }));
            return { lat: pos.coords.latitude, lng: pos.coords.longitude };
        } catch { return { lat: undefined, lng: undefined }; }
    };

    const handleCheckIn = async () => {
        setLoading(true);
        try { const { lat, lng } = await getGPS(); const res = await api.post('/student/attendance/check-in', null, { params: { latitude: lat, longitude: lng } }); showMsg(res.data.message, 'success'); loadStats(); }
        catch (e: any) { showMsg(e.response?.data?.detail || 'เกิดข้อผิดพลาด', 'error'); } finally { setLoading(false); }
    };

    const handleCheckOut = async () => {
        setLoading(true);
        try { const { lat, lng } = await getGPS(); const res = await api.post('/student/attendance/check-out', null, { params: { latitude: lat, longitude: lng } }); showMsg(res.data.message, 'success'); loadStats(); }
        catch (e: any) { showMsg(e.response?.data?.detail || 'เกิดข้อผิดพลาด', 'error'); } finally { setLoading(false); }
    };

    const fmt = (d: Date) => d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });
    const fmtD = (d: Date) => d.toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });

    return (
        <div className="flex items-center justify-center">
            <div className="bg-white rounded-[2.5rem] p-6 md:p-12 w-full max-w-7xl shadow-2xl relative">
                <div className="mb-8 md:mb-10"><h1 className="text-2xl md:text-3xl font-bold text-gray-900 border-b-2 border-gray-100 pb-4 inline-block">{companyName}</h1></div>
                <div className="bg-gray-50 rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-sm mb-8 md:mb-12">
                    <div className="flex-1 text-center mb-6 md:mb-0"><span className="text-6xl md:text-9xl font-bold text-[#2d4a8a] tracking-wider block">{fmt(time)}</span></div>
                    <div className="w-full h-px md:w-px md:h-24 bg-gray-300 block mx-0 md:mx-8 mb-6 md:mb-0"></div>
                    <div className="flex-1 text-center"><span className="text-xl md:text-4xl font-bold text-[#4472c4]">{fmtD(time)}</span></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
                    <button onClick={handleCheckIn} disabled={loading} className="bg-[#5cc945] hover:bg-[#4db83a] disabled:bg-gray-400 text-white py-4 px-6 rounded-full shadow-[0_4px_15px_rgba(92,201,69,0.4)] transition-transform transform hover:-translate-y-1 font-bold text-lg">บันทึกเวลาเข้า</button>
                    <button onClick={handleCheckOut} disabled={loading} className="bg-[#4472c4] hover:bg-[#325eb5] disabled:bg-gray-400 text-white py-4 px-6 rounded-full shadow-[0_4px_15px_rgba(68,114,196,0.4)] transition-transform transform hover:-translate-y-1 font-bold text-lg">บันทึกเวลาออก</button>
                    <button onClick={() => setIsLeaveModalOpen(true)} className="bg-white border-2 border-[#4472c4] text-[#4472c4] hover:bg-blue-50 py-4 px-6 rounded-full shadow-[0_4px_15px_rgba(68,114,196,0.2)] transition-transform transform hover:-translate-y-1 font-bold text-lg">ลากิจ/ลาป่วย</button>
                    <button onClick={() => setIsOffsiteModalOpen(true)} className="bg-white border-2 border-orange-400 text-orange-500 hover:bg-orange-50 py-4 px-6 rounded-full shadow-[0_4px_15px_rgba(251,146,60,0.3)] transition-transform transform hover:-translate-y-1 font-bold text-lg">ปฏิบัติงานนอกสถานที่</button>
                </div>
                <div className="text-center mb-8 md:mb-10 h-8">
                    {message && <span className={`font-bold text-lg animate-pulse ${messageType === 'success' ? 'text-[#5cc945]' : 'text-red-500'}`}>{message}</span>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
                    <div className="bg-[#fcfcfc] rounded-3xl p-6 flex justify-center items-center shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 min-h-[100px]"><span className="font-bold text-gray-700">รวมวันที่ปฏิบัติงาน {stats.totalDays} วัน</span></div>
                    <div className="bg-[#fcfcfc] rounded-3xl p-6 flex justify-center items-center shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 min-h-[100px]"><span className="font-bold text-gray-700">มาสาย {stats.lateDays} วัน</span></div>
                    <div className="bg-[#fcfcfc] rounded-3xl p-6 flex justify-center items-center shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 min-h-[100px]"><span className="font-bold text-gray-700">กลับก่อน {stats.earlyDays} วัน</span></div>
                    <div className="bg-[#fcfcfc] rounded-3xl p-6 flex justify-center items-center shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 min-h-[100px]"><span className="font-bold text-gray-700">รวมชั่วโมง {stats.totalHours} ชม.</span></div>
                    <div className="bg-[#fcfcfc] rounded-3xl p-6 flex justify-center items-center shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 min-h-[100px]"><span className="font-bold text-gray-700">ลา {stats.leaveDays} วัน</span></div>
                    <div className="bg-[#fcfcfc] rounded-3xl p-6 flex justify-center items-center shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 min-h-[100px]"><span className="font-bold text-gray-700">ขาด {stats.absentDays} วัน</span></div>
                </div>
                <div className="text-left mt-8"><Link to="/history" className="inline-flex items-center text-[#4472c4] font-bold text-lg hover:underline decoration-2 underline-offset-4">ดูประวัติ</Link></div>
                <LeaveRequestModal isOpen={isLeaveModalOpen} onClose={() => setIsLeaveModalOpen(false)} />
                <OffsiteWorkModal isOpen={isOffsiteModalOpen} onClose={() => setIsOffsiteModalOpen(false)} />
            </div>
        </div>
    );
};

export default TimeAttendancePage;
