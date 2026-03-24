import { useState, useEffect } from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import api from '../../api';

const SupervisionHistoryPage = () => {
    const [schedules, setSchedules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/advisor/visit-schedules').then(res => setSchedules(res.data.schedules || [])).catch(() => {}).finally(() => setLoading(false));
    }, []);

    return (
        <div className="flex items-center justify-center py-8 px-4">
            <div className="bg-white rounded-[2rem] p-8 md:p-12 w-full max-w-6xl shadow-xl">
                <div className="mb-10 pb-6 border-b border-gray-100">
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">ประวัติการนิเทศ</h1>
                    <p className="text-gray-500 font-medium">รายการนัดหมายและบันทึกการนิเทศทั้งหมด</p>
                </div>
                {loading ? <div className="text-center py-12 text-gray-400">กำลังโหลด...</div> : schedules.length === 0 ? <div className="text-center py-12 text-gray-400">ยังไม่มีประวัติการนิเทศ</div> : (
                    <div className="space-y-4">
                        {schedules.map((item: any) => (
                            <div key={item.id} className="group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 bg-white border border-gray-100 rounded-2xl md:rounded-full items-center transition-all duration-300 hover:shadow-lg hover:border-blue-100">
                                <div className="col-span-1 md:col-span-3 flex items-center gap-3">
                                    <span className="font-bold text-gray-900">{item.scheduled_date || '-'}</span>
                                    {item.scheduled_time && <div className="flex items-center gap-1 text-sm text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded-md"><Clock size={12} />{item.scheduled_time} น.</div>}
                                </div>
                                <div className="col-span-1 md:col-span-3 flex md:justify-center">
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">{item.location || 'ไม่ระบุสถานที่'}</span>
                                </div>
                                <div className="col-span-1 md:col-span-4 font-bold text-gray-800">{item.student_name || `นักศึกษา #${item.internship_id}`}</div>
                                <div className="col-span-1 md:col-span-2 flex justify-end">
                                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"><ArrowRight size={20} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupervisionHistoryPage;
