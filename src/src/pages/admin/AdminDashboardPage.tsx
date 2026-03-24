import { useState, useEffect } from 'react';
import { Users, GraduationCap, BookOpen, Building2, UserCheck, Clock, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const AdminDashboardPage = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({ total: 0, students: 0, advisors: 0, supervisors: 0, pending: 0, active: 0 });

    useEffect(() => {
        api.get('/admin/dashboard').then(res => {
            const d = res.data;
            setData({
                total: d.total_users || 0, students: d.students || 0, advisors: d.advisors || 0,
                supervisors: d.supervisors || 0, pending: d.pending || 0, active: d.active || 0,
            });
        }).catch(() => {});
    }, []);

    const stats = [
        { label: 'นักศึกษาฝึกงาน', value: data.students, icon: GraduationCap, gradient: 'from-[#4472c4] to-[#032B68]' },
        { label: 'อาจารย์นิเทศก์', value: data.advisors, icon: BookOpen, gradient: 'from-[#FBC02D] to-[#F9A825]' },
        { label: 'พี่เลี้ยง/สถานประกอบการ', value: data.supervisors, icon: Building2, gradient: 'from-[#66BB6A] to-[#388E3C]' },
        { label: 'ผู้ใช้ทั้งหมด', value: data.total, icon: Users, gradient: 'from-[#7E57C2] to-[#4527A0]' },
    ];

    return (
        <div className="p-6 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">แดชบอร์ด</h1>
                {data.pending > 0 && (
                    <button onClick={() => navigate('/admin/users?tab=student')} className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-full font-bold border border-yellow-200 hover:bg-yellow-100 transition">
                        <Clock size={18} /> รออนุมัติ {data.pending} คน <ArrowUpRight size={16} />
                    </button>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <div key={i} className={`bg-gradient-to-br ${s.gradient} rounded-3xl p-6 text-white shadow-lg`}>
                        <div className="flex justify-between items-start mb-4">
                            <s.icon size={32} className="opacity-80" />
                            <UserCheck size={20} className="opacity-60" />
                        </div>
                        <p className="text-4xl font-bold mb-1">{s.value}</p>
                        <p className="text-sm opacity-80">{s.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboardPage;
