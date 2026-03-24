import { useState } from 'react';
import DatePicker from "react-datepicker";
import { Calendar, Clock } from 'lucide-react';
import api from '../../api';

interface OffsiteWorkModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const OffsiteWorkModal = ({ isOpen, onClose }: OffsiteWorkModalProps) => {
    const [date, setDate] = useState<Date | null>(null);
    const [timeOut, setTimeOut] = useState<Date | null>(null);
    const [timeReturn, setTimeReturn] = useState<Date | null>(null);
    const [destination, setDestination] = useState('');
    const [purpose, setPurpose] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!date || !destination.trim() || !purpose.trim()) { setMessage('กรุณากรอกข้อมูลให้ครบ'); return; }
        setLoading(true);
        try {
            const params: any = {
                off_site_date: date.toISOString().split('T')[0],
                destination: destination.trim(),
                purpose: purpose.trim(),
            };
            if (timeOut) params.departure_time = timeOut.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
            if (timeReturn) params.return_time = timeReturn.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
            await api.post('/student/off-site-request', null, { params });
            setMessage('ส่งคำขอสำเร็จ!');
            setTimeout(() => { onClose(); setMessage(''); setDestination(''); setPurpose(''); setDate(null); setTimeOut(null); setTimeReturn(null); }, 1500);
        } catch (err: any) { setMessage(err.response?.data?.detail || 'เกิดข้อผิดพลาด'); }
        finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="relative bg-white rounded-[2rem] w-full max-w-2xl p-8 md:p-10 shadow-2xl transform transition-all">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">ปฏิบัติงานนอกสถานที่</h2>
                    <p className="text-gray-400 text-sm">ระบุวันที่ เวลา สถานที่ และเหตุผล</p>
                </div>
                {message && <div className={`mb-4 p-3 rounded-xl text-center font-bold ${message.includes('สำเร็จ') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{message}</div>}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-gray-900 font-bold block">วันที่</label>
                        <div className="relative">
                            <DatePicker selected={date} onChange={(d) => setDate(d)} placeholderText="เลือกวันที่" className="w-full bg-white border border-gray-200 rounded-full py-3 px-6 text-gray-700 focus:outline-none focus:border-[#4472c4]" wrapperClassName="w-full" />
                            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-gray-900 font-bold block">เวลาออก</label>
                            <div className="relative">
                                <DatePicker selected={timeOut} onChange={(d) => setTimeOut(d)} showTimeSelect showTimeSelectOnly timeIntervals={15} dateFormat="HH:mm" placeholderText="เวลาออก" className="w-full bg-white border border-gray-200 rounded-full py-3 px-6 text-gray-700 focus:outline-none focus:border-[#4472c4]" />
                                <Clock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-gray-900 font-bold block">เวลากลับ</label>
                            <div className="relative">
                                <DatePicker selected={timeReturn} onChange={(d) => setTimeReturn(d)} showTimeSelect showTimeSelectOnly timeIntervals={15} dateFormat="HH:mm" placeholderText="เวลากลับ" className="w-full bg-white border border-gray-200 rounded-full py-3 px-6 text-gray-700 focus:outline-none focus:border-[#4472c4]" />
                                <Clock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-gray-900 font-bold block">สถานที่</label>
                        <input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="ระบุสถานที่ปฏิบัติงาน" className="w-full bg-white border border-gray-200 rounded-full py-3 px-6 text-gray-700 focus:outline-none focus:border-[#4472c4]" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-gray-900 font-bold block">เหตุผล</label>
                        <textarea rows={3} value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="ระบุเหตุผลในการออกนอกสถานที่" className="w-full bg-white border border-gray-200 rounded-[1.5rem] py-4 px-6 text-gray-700 focus:outline-none focus:border-[#4472c4] resize-none"></textarea>
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-10">
                    <button onClick={onClose} className="px-8 py-3 rounded-full border border-[#4472c4] text-[#4472c4] font-bold hover:bg-blue-50 transition-colors">ยกเลิก</button>
                    <button onClick={handleSubmit} disabled={loading} className="px-8 py-3 rounded-full bg-[#5cc945] disabled:bg-gray-400 text-white font-bold hover:bg-[#4db83a] shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">{loading ? 'กำลังส่ง...' : 'บันทึก'}</button>
                </div>
            </div>
        </div>
    );
};

export default OffsiteWorkModal;
