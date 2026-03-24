import { useState } from 'react';
import DatePicker from "react-datepicker";
import { Calendar } from 'lucide-react';
import api from '../../api';

interface LeaveRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LeaveRequestModal = ({ isOpen, onClose }: LeaveRequestModalProps) => {
    const [leaveType, setLeaveType] = useState<'personal' | 'sick'>('personal');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!startDate || !endDate || !reason.trim()) { setMessage('กรุณากรอกข้อมูลให้ครบ'); return; }
        setLoading(true);
        try {
            const leaveTypeId = leaveType === 'personal' ? 1 : 2;
            const diffDays = Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000) + 1;
            await api.post('/student/leave-request', null, {
                params: {
                    leave_type_id: leaveTypeId,
                    start_date: startDate.toISOString().split('T')[0],
                    end_date: endDate.toISOString().split('T')[0],
                    reason: reason.trim(),
                    total_days: diffDays,
                }
            });
            setMessage('ส่งคำขอลาสำเร็จ!');
            setTimeout(() => { onClose(); setMessage(''); setReason(''); setStartDate(null); setEndDate(null); }, 1500);
        } catch (err: any) { setMessage(err.response?.data?.detail || 'เกิดข้อผิดพลาด'); }
        finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="relative bg-white rounded-[2rem] w-full max-w-2xl p-8 md:p-10 shadow-2xl transform transition-all">
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">บันทึกการลา</h2>
                        <p className="text-gray-400 text-sm font-light">เลือกประเภทการลา ระบุวันที่ <br className="hidden md:block" />และเหตุผลให้ชัดเจน</p>
                    </div>
                    <div className="bg-gray-100 p-1 rounded-full flex items-center shadow-inner self-start">
                        <button onClick={() => setLeaveType('personal')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${leaveType === 'personal' ? 'bg-white text-[#4472c4] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>ลากิจ</button>
                        <button onClick={() => setLeaveType('sick')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${leaveType === 'sick' ? 'bg-white text-[#4472c4] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>ลาป่วย</button>
                    </div>
                </div>
                {message && <div className={`mb-4 p-3 rounded-xl text-center font-bold ${message.includes('สำเร็จ') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{message}</div>}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-gray-900 font-bold block">วันที่เริ่มลา</label>
                            <div className="relative">
                                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} placeholderText="เลือกวันที่" className="w-full bg-white border border-gray-200 rounded-full py-3 px-6 text-gray-700 focus:outline-none focus:border-[#4472c4] transition-colors" wrapperClassName="w-full" />
                                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-gray-900 font-bold block">ถึงวันที่</label>
                            <div className="relative">
                                <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} placeholderText="เลือกวันที่" className="w-full bg-white border border-gray-200 rounded-full py-3 px-6 text-gray-700 focus:outline-none focus:border-[#4472c4] transition-colors" wrapperClassName="w-full" />
                                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-gray-900 font-bold block">เหตุผลการลา</label>
                        <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder={leaveType === 'personal' ? "เช่น ไปทำธุระเรื่องเอกสารราชการ" : "เช่น มีไข้ขึ้นสูงต้องพบแพทย์"} className="w-full bg-white border border-gray-200 rounded-[1.5rem] py-4 px-6 text-gray-700 focus:outline-none focus:border-[#4472c4] resize-none transition-colors"></textarea>
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-10">
                    <button onClick={onClose} className="px-8 py-3 rounded-full border border-[#4472c4] text-[#4472c4] font-bold hover:bg-blue-50 transition-colors">ยกเลิก</button>
                    <button onClick={handleSubmit} disabled={loading} className="px-8 py-3 rounded-full bg-[#5cc945] disabled:bg-gray-400 text-white font-bold hover:bg-[#4db83a] shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">{loading ? 'กำลังส่ง...' : 'บันทึกการลา'}</button>
                </div>
            </div>
        </div>
    );
};

export default LeaveRequestModal;
