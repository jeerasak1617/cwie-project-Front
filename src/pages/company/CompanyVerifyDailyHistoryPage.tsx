import { useState, useEffect } from 'react';
import { User, PenTool, CheckCircle2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import api from '../../api';

const CompanyVerifyDailyHistoryPage = () => {
    const { studentId } = useParams(); // internship_id
    const [logs, setLogs] = useState<any[]>([]);
    const [studentInfo, setStudentInfo] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSigned, setIsSigned] = useState(false);
    const [activeMonth, setActiveMonth] = useState<number>(new Date().getMonth() + 1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await api.get(`/supervisor/daily-logs/${studentId}`, { params: { per_page: 100 } });
                setLogs(data.logs || []);
            } catch (err) { console.error(err); }
        };
        fetchData();
    }, [studentId]);

    useEffect(() => {
        setIsLoading(false); // logs loaded above
    }, [logs]);

    const filteredLogs = logs.filter(l => new Date(l.log_date).getMonth() + 1 === activeMonth);
    const availableMonths = [...new Set(logs.map(l => new Date(l.log_date).getMonth() + 1))].sort();
    if (availableMonths.length === 0) availableMonths.push(activeMonth);

    const thaiMonths = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];

    const formatDate = (d: string) => new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
    const getDayName = (d: string) => ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'][new Date(d).getDay()];

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">ประวัติบันทึกประจำวัน</h1>
                    <p className="text-gray-400">ตรวจสอบบันทึกรายวันของนักศึกษา (Internship #{studentId})</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => setIsSigned(!isSigned)}
                        className={`border rounded-3xl p-5 min-w-[200px] flex gap-3 shadow-md transition-all active:scale-95 text-left ${isSigned ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-[#4472c4]'}`}>
                        <div className={`p-2.5 rounded-full h-fit ${isSigned ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-500'}`}>
                            {isSigned ? <CheckCircle2 size={24} /> : <PenTool size={24} />}
                        </div>
                        <div className="flex-1 min-h-[60px]">
                            <p className="font-bold text-gray-800 text-sm mb-2">พี่เลี้ยง</p>
                            {isSigned ? <p className="text-xs font-bold text-green-600">ลงลายเซ็นแล้ว</p> : <p className="text-xs text-[#4472c4] font-medium">คลิกเพื่อลงลายเซ็น</p>}
                        </div>
                    </button>
                </div>
            </div>

            <div className="flex gap-8 border-b border-gray-100 mb-8 overflow-x-auto">
                {availableMonths.map(m => (
                    <button key={m} onClick={() => setActiveMonth(m)}
                        className={`pb-4 px-2 text-lg font-bold transition-colors relative whitespace-nowrap ${activeMonth === m ? 'text-[#4472c4]' : 'text-gray-400 hover:text-gray-600'}`}>
                        {thaiMonths[m - 1]}
                        {activeMonth === m && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#4472c4] rounded-t-full"></div>}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-x-auto">
                <table className="w-full min-w-[1000px] border-collapse bg-[#f8fafc] rounded-2xl overflow-hidden">
                    <thead>
                        <tr className="text-left text-gray-600 font-bold border-b border-gray-200">
                            <th className="py-6 pl-8 w-[20%]">วันที่</th>
                            <th className="py-6 w-[40%]">กิจกรรม</th>
                            <th className="py-6 w-[10%]">ชั่วโมง</th>
                            <th className="py-6 w-[15%]">comment อาจารย์</th>
                            <th className="py-6 w-[15%]">สถานะ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {filteredLogs.length === 0 ? (
                            <tr><td colSpan={5} className="py-8 text-center text-gray-500">ไม่พบข้อมูล</td></tr>
                        ) : filteredLogs.map(row => (
                            <tr key={row.id} className="hover:bg-gray-50">
                                <td className="py-6 pl-8"><div className="font-bold text-gray-800">{formatDate(row.log_date)}</div><div className="text-sm text-gray-500">{getDayName(row.log_date)}</div></td>
                                <td className="py-6 text-gray-800 pr-4">{row.activities || '-'}</td>
                                <td className="py-6 text-gray-600">{row.hours_spent ?? '-'}</td>
                                <td className="py-6 text-sm text-gray-500">{row.advisor_comment || '-'}</td>
                                <td className="py-6">{row.supervisor_comment ? <span className="text-sm font-bold text-green-600">ตรวจแล้ว</span> : <span className="text-sm font-bold text-orange-500">รอตรวจ</span>}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CompanyVerifyDailyHistoryPage;
