import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';

interface PlanRecord {
    id: number;
    week_number: number | null;
    task_name: string;
    task_description: string | null;
    location: string | null;
    start_date: string | null;
    end_date: string | null;
    planned_hours: number | null;
    actual_hours: number | null;
    completion_percentage: number;
    supervisor_approved: boolean;
    supervisor_comment: string | null;
}

const InternshipPlanHistoryPage = () => {
    const [plans, setPlans] = useState<PlanRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadPlans(); }, []);

    const loadPlans = async () => {
        setLoading(true);
        try {
            const res = await api.get('/student/internship-plans');
            setPlans(res.data.plans || []);
        } catch {} finally { setLoading(false); }
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
    };

    return (
        <div className="flex items-center justify-center">
            <div className="bg-white rounded-[2.5rem] p-6 md:p-12 w-full max-w-[1600px] shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/internship-plan" className="text-[#4472c4] hover:bg-blue-50 p-2 rounded-full"><ArrowLeft size={24} /></Link>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">ประวัติแผนฝึกงาน</h1>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-gray-400">กำลังโหลด...</div>
                ) : plans.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">ยังไม่มีแผนฝึกงาน</div>
                ) : (
                    <div className="space-y-4">
                        {plans.map((p) => (
                            <div key={p.id} className="bg-[#f8fafc] rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">{p.task_name}</h3>
                                        {p.location && <p className="text-gray-500 text-sm">{p.location}</p>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {p.supervisor_approved ? (
                                            <span className="px-3 py-1 rounded-full text-sm font-bold text-green-600 bg-green-50">อนุมัติแล้ว</span>
                                        ) : (
                                            <span className="px-3 py-1 rounded-full text-sm font-bold text-yellow-600 bg-yellow-50">รอตรวจ</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-6 text-sm text-gray-500 mb-2">
                                    <span>{formatDate(p.start_date)} - {formatDate(p.end_date)}</span>
                                    {p.planned_hours && <span>{p.planned_hours} ชม.</span>}
                                    <span>เสร็จ {p.completion_percentage}%</span>
                                </div>
                                {p.task_description && <p className="text-gray-600 text-sm mt-2">{p.task_description}</p>}
                                {p.supervisor_comment && (
                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                        <p className="text-orange-600 font-medium text-sm">ความเห็นพี่เลี้ยง: {p.supervisor_comment}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InternshipPlanHistoryPage;
