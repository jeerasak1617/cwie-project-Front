import { useState, useEffect } from 'react';
import { Users, GraduationCap, BookOpen, Building2, UserCheck, Clock, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const AdminDashboardPage = () => {
    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dashRes, usersRes] = await Promise.all([
                    api.get('/admin/dashboard'),
                    api.get('/admin/users', { params: { per_page: 100 } }),
                ]);
                setDashboard(dashRes.data);
                setUsers(usersRes.data.users || []);
            } catch (err) {
                console.error('Failed to fetch:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-64 text-gray-500">กำลังโหลด...</div>;

    const studentCount = users.filter(u => u.sys_role === 'student').length;
    const teacherCount = users.filter(u => u.sys_role === 'advisor').length;
    const companyCount = users.filter(u => u.sys_role === 'supervisor').length;
    const totalCount = users.length;
    const pendingCount = users.filter(u => u.status === 'pending').length;

    const stats = [
        { label: 'นักศึกษาฝึกงาน', value: studentCount, icon: GraduationCap, gradient: 'from-[#4472c4] to-[#032B68]', lightText: 'text-[#4472c4]', shadow: 'shadow-[#032B68]/15', hoverBg: 'group-hover:bg-[#4472c4]/[0.12]', link: '/admin/users?tab=student' },
        { label: 'อาจารย์นิเทศ', value: teacherCount, icon: BookOpen, gradient: 'from-emerald-400 to-teal-600', lightText: 'text-emerald-600', shadow: 'shadow-emerald-500/15', hoverBg: 'group-hover:bg-emerald-500/[0.12]', link: '/admin/users?tab=teacher' },
        { label: 'สถานประกอบการ', value: companyCount, icon: Building2, gradient: 'from-amber-400 to-orange-500', lightText: 'text-amber-600', shadow: 'shadow-amber-500/15', hoverBg: 'group-hover:bg-amber-500/[0.12]', link: '/admin/users?tab=company' },
        { label: 'ผู้ใช้ทั้งหมด', value: totalCount, icon: Users, gradient: 'from-violet-500 to-purple-600', lightText: 'text-violet-600', shadow: 'shadow-violet-500/15', hoverBg: 'group-hover:bg-violet-500/[0.06]', link: '/admin/users' },
    ];

    const recentRegistrations = [...users]
        .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
        .slice(0, 6);

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'approved': case 'active': return { label: 'อนุมัติแล้ว', text: 'text-emerald-600', dot: 'bg-emerald-400' };
            case 'rejected': return { label: 'ปฏิเสธ', text: 'text-red-500', dot: 'bg-red-400' };
            default: return { label: 'รอตรวจสอบ', text: 'text-amber-600', dot: 'bg-amber-400' };
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'advisor': return { label: 'อาจารย์', bg: 'bg-emerald-50', text: 'text-emerald-600' };
            case 'supervisor': return { label: 'สถานประกอบการ', bg: 'bg-amber-50', text: 'text-amber-600' };
            default: return { label: 'นักศึกษา', bg: 'bg-blue-50', text: 'text-[#032B68]' };
        }
    };

    const roleDistribution = [
        { role: 'นักศึกษา', count: studentCount, percentage: totalCount > 0 ? Math.round((studentCount / totalCount) * 100) : 0, color: '#4472c4', bgColor: 'bg-blue-100', textColor: 'text-[#032B68]' },
        { role: 'อาจารย์', count: teacherCount, percentage: totalCount > 0 ? Math.round((teacherCount / totalCount) * 100) : 0, color: '#10b981', bgColor: 'bg-emerald-100', textColor: 'text-emerald-600' },
        { role: 'สถานประกอบการ', count: companyCount, percentage: totalCount > 0 ? Math.round((companyCount / totalCount) * 100) : 0, color: '#f59e0b', bgColor: 'bg-amber-100', textColor: 'text-amber-600' },
    ];

    const s = roleDistribution[0].percentage, t = roleDistribution[1].percentage, c = roleDistribution[2].percentage;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((stat, index) => (
                    <div key={index} onClick={() => navigate(stat.link)} className="group bg-white/70 backdrop-blur-sm rounded-3xl border border-white/80 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer relative overflow-hidden">
                        <div className={`absolute inset-0 ${stat.hoverBg} transition-all duration-500 rounded-3xl`}></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg ${stat.shadow}`}><stat.icon size={22} /></div>
                                <div className={`flex items-center gap-1 ${stat.lightText} text-xs font-semibold`}><ArrowUpRight size={14} /></div>
                            </div>
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{stat.label}</p>
                            <p className="text-4xl font-black text-slate-800 mt-1 tracking-tight">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Registrations */}
                <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-3xl border border-white/80 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-100/80 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center"><Clock size={16} className="text-[#4472c4]" /></div>
                            <h2 className="text-base font-bold text-slate-700">ผู้ใช้งานล่าสุด</h2>
                        </div>
                        {pendingCount > 0 && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200/50 rounded-full">
                                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span></span>
                                <span className="text-xs font-semibold text-amber-700">{pendingCount} รออนุมัติ</span>
                            </div>
                        )}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead><tr className="bg-slate-50/50"><th className="text-left px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ชื่อ-นามสกุล</th><th className="text-left px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase">บทบาท</th><th className="text-left px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase">สถานะ</th></tr></thead>
                            <tbody className="divide-y divide-slate-50">
                                {recentRegistrations.map((reg) => {
                                    const sc = getStatusConfig(reg.status);
                                    const rb = getRoleBadge(reg.sys_role);
                                    return (
                                        <tr key={reg.id} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 bg-gradient-to-br from-[#4472c4] to-[#032B68] rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md">{(reg.first_name_th || reg.username || '?')[0]}</div>
                                                    <span className="text-sm font-semibold text-slate-700">{reg.first_name_th || ''} {reg.last_name_th || reg.username || ''}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4"><span className={`text-[11px] px-2.5 py-1 rounded-lg font-bold ${rb.bg} ${rb.text}`}>{rb.label}</span></td>
                                            <td className="px-6 py-4"><span className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg font-bold ${sc.text}`}><span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></span>{sc.label}</span></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* User Distribution */}
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/80 p-6 shadow-sm">
                    <div className="flex items-center gap-2.5 mb-6">
                        <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center"><UserCheck size={16} className="text-[#4472c4]" /></div>
                        <h2 className="text-base font-bold text-slate-700">สัดส่วนผู้ใช้งาน</h2>
                    </div>
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative w-44 h-44">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                                <circle cx="50" cy="50" r="38" fill="none" stroke="#4472c4" strokeWidth="10" strokeDasharray={`${s * 2.39} ${100 * 2.39}`} strokeDashoffset="0" strokeLinecap="round" />
                                <circle cx="50" cy="50" r="38" fill="none" stroke="#10b981" strokeWidth="10" strokeDasharray={`${t * 2.39} ${100 * 2.39}`} strokeDashoffset={`${-s * 2.39}`} strokeLinecap="round" />
                                <circle cx="50" cy="50" r="38" fill="none" stroke="#f59e0b" strokeWidth="10" strokeDasharray={`${c * 2.39} ${100 * 2.39}`} strokeDashoffset={`${-(s + t) * 2.39}`} strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-black text-slate-800">{totalCount}</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ทั้งหมด</span>
                            </div>
                        </div>
                        <div className="w-full space-y-3">
                            {roleDistribution.map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div><span className="text-sm text-slate-600 font-medium">{item.role}</span></div>
                                    <div className="flex items-center gap-2"><span className={`text-sm font-bold ${item.textColor}`}>{item.count}</span><span className={`text-[10px] px-2.5 py-0.5 rounded-lg font-bold ${item.bgColor} ${item.textColor}`}>{item.percentage}%</span></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
