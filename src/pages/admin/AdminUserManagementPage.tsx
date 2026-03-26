import { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle, XCircle, X, GraduationCap, BookOpen, Building2, Filter } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api';

type RoleTab = 'student' | 'teacher' | 'company';

const AdminUserManagementPage = () => {
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState<RoleTab>('student');
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'student' || tab === 'teacher' || tab === 'company') setActiveTab(tab);
    }, [searchParams]);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const roleMap: Record<RoleTab, string> = { student: 'student', teacher: 'advisor', company: 'supervisor' };
                const { data } = await api.get('/admin/users', { params: { role: roleMap[activeTab], per_page: 100 } });
                setUsers(data.users || []);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchUsers();
    }, [activeTab]);

    const handleApprove = async (userId: number) => {
        try {
            await api.post(`/admin/users/${userId}/approve`);
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'active' } : u));
            if (selectedUser?.id === userId) setSelectedUser((p: any) => p ? { ...p, status: 'active' } : null);
        } catch (err: any) { alert(err.response?.data?.detail || 'ไม่สามารถอนุมัติได้'); }
    };

    const handleReject = async (userId: number) => {
        try {
            await api.post(`/admin/users/${userId}/reject`, null, { params: { reason: 'ปฏิเสธโดยแอดมิน' } });
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'rejected' } : u));
            if (selectedUser?.id === userId) setSelectedUser((p: any) => p ? { ...p, status: 'rejected' } : null);
        } catch (err: any) { alert(err.response?.data?.detail || 'ไม่สามารถปฏิเสธได้'); }
    };

    const tabs = [
        { key: 'student' as RoleTab, label: 'นักศึกษา', icon: GraduationCap, gradient: 'from-[#4472c4] to-[#032B68]' },
        { key: 'teacher' as RoleTab, label: 'อาจารย์', icon: BookOpen, gradient: 'from-emerald-400 to-teal-600' },
        { key: 'company' as RoleTab, label: 'สถานประกอบการ', icon: Building2, gradient: 'from-amber-400 to-orange-500' },
    ];

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'approved': case 'active': return { label: 'อนุมัติแล้ว', text: 'text-emerald-600', dot: 'bg-emerald-400' };
            case 'rejected': return { label: 'ปฏิเสธ', text: 'text-red-500', dot: 'bg-red-400' };
            default: return { label: 'รอตรวจสอบ', text: 'text-amber-600', dot: 'bg-amber-400' };
        }
    };

    const filtered = users.filter(u => {
        const name = `${u.first_name_th || ''} ${u.last_name_th || ''} ${u.username || ''}`.toLowerCase();
        return name.includes(searchTerm.toLowerCase()) || (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) || (u.student_code || '').includes(searchTerm);
    });

    const activeTabConfig = tabs.find(t => t.key === activeTab)!;

    return (
        <div className="space-y-6">
            <div className="flex gap-3">
                {tabs.map(tab => {
                    const isActive = activeTab === tab.key;
                    const count = isActive ? users.length : '...';
                    return (
                        <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSearchTerm(''); }}
                            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 border ${isActive ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg border-transparent` : 'bg-white/70 text-slate-500 hover:bg-white border-white/80 hover:shadow-md'}`}>
                            <tab.icon size={18} /><span>{tab.label}</span><span className={`ml-0.5 text-xs px-2 py-0.5 rounded-lg font-bold ${isActive ? 'bg-white/25' : 'bg-slate-100 text-slate-500'}`}>{count}</span>
                        </button>
                    );
                })}
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/80 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100/80 flex items-center gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input type="text" placeholder="ค้นหาชื่อ, อีเมล, รหัส..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4472c4]/30 text-sm text-slate-700 placeholder-slate-300" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead><tr className="bg-slate-50/40"><th className="text-left px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase">ชื่อ-นามสกุล</th><th className="text-left px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase">อีเมล</th><th className="text-left px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase">สถานะ</th><th className="text-center px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase">จัดการ</th></tr></thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan={4} className="py-12 text-center text-slate-400">กำลังโหลด...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={4} className="py-12 text-center text-slate-400">ไม่พบข้อมูล</td></tr>
                            ) : filtered.map(user => {
                                const sc = getStatusConfig(user.status);
                                return (
                                    <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 bg-gradient-to-br ${activeTabConfig.gradient} rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md`}>{(user.first_name_th || user.username || '?')[0]}</div>
                                                <div><span className="text-sm font-semibold text-slate-700 block">{user.first_name_th || ''} {user.last_name_th || user.username || ''}</span>{user.student_code && <span className="text-[11px] text-slate-400">{user.student_code}</span>}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400">{user.email || '-'}</td>
                                        <td className="px-6 py-4"><span className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg font-bold ${sc.text}`}><span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></span>{sc.label}</span></td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <button onClick={() => { setSelectedUser(user); setShowDetailModal(true); }} className="p-2 text-slate-300 hover:text-[#4472c4] hover:bg-blue-50 rounded-xl"><Eye size={17} /></button>
                                                {user.status === 'pending' && (<>
                                                    <button onClick={() => handleApprove(user.id)} className="p-2 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl"><CheckCircle size={17} /></button>
                                                    <button onClick={() => handleReject(user.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl"><XCircle size={17} /></button>
                                                </>)}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedUser && (
                <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDetailModal(false)}>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100" onClick={e => e.stopPropagation()}>
                        <div className={`bg-gradient-to-br ${activeTabConfig.gradient} px-6 pt-5 pb-10 text-white relative`}>
                            <div className="flex items-center justify-between mb-1"><h3 className="text-base font-bold">ข้อมูลผู้ใช้</h3><button onClick={() => setShowDetailModal(false)} className="p-1.5 hover:bg-white/20 rounded-xl"><X size={18} /></button></div>
                        </div>
                        <div className="flex flex-col items-center -mt-8 relative z-10">
                            <div className={`w-16 h-16 bg-gradient-to-br ${activeTabConfig.gradient} rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-xl ring-4 ring-white`}>{(selectedUser.first_name_th || selectedUser.username || '?')[0]}</div>
                            <p className="text-lg font-extrabold text-slate-800 mt-3">{selectedUser.first_name_th || ''} {selectedUser.last_name_th || selectedUser.username || ''}</p>
                            <span className={`inline-flex items-center gap-1.5 mt-2 text-xs px-3 py-1 rounded-full font-bold ${getStatusConfig(selectedUser.status).text}`}>
                                <span className={`w-2 h-2 rounded-full ${getStatusConfig(selectedUser.status).dot}`}></span>{getStatusConfig(selectedUser.status).label}
                            </span>
                        </div>
                        <div className="px-6 pt-5 pb-6">
                            <div className="space-y-0 divide-y divide-slate-100">
                                {[{ label: 'อีเมล', value: selectedUser.email || '-' }, { label: 'เบอร์โทร', value: selectedUser.phone || '-' }, { label: 'Role', value: selectedUser.role }].map((f, i) => (
                                    <div key={i} className="flex items-center justify-between py-3.5"><span className="text-xs text-slate-400 font-semibold uppercase">{f.label}</span><span className="text-sm font-semibold text-slate-700">{f.value}</span></div>
                                ))}
                            </div>
                            {selectedUser.status === 'pending' && (
                                <div className="mt-5 flex gap-3">
                                    <button onClick={() => handleApprove(selectedUser.id)} className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-bold py-3.5 rounded-2xl shadow-lg text-sm"><CheckCircle size={17} /> อนุมัติ</button>
                                    <button onClick={() => handleReject(selectedUser.id)} className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-400 to-rose-500 text-white font-bold py-3.5 rounded-2xl shadow-lg text-sm"><XCircle size={17} /> ปฏิเสธ</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUserManagementPage;
