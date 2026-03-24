import { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle, XCircle, X, GraduationCap, BookOpen, Building2, Filter } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api';

type RoleTab = 'student' | 'advisor' | 'supervisor';

interface UserItem {
    id: number;
    username: string;
    full_name: string;
    email: string;
    sys_role: string;
    status: string;
    student_code?: string;
}

const AdminUserManagementPage = () => {
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState<RoleTab>('student');
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<UserItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'student' || tab === 'advisor' || tab === 'supervisor') setActiveTab(tab as RoleTab);
    }, [searchParams]);

    useEffect(() => { loadUsers(); }, [activeTab, searchTerm]);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/users', { params: { role: activeTab, search: searchTerm || undefined } });
            setUsers(res.data.users || []);
        } catch {} finally { setLoading(false); }
    };

    const handleApprove = async (id: number) => {
        try { await api.post(`/admin/users/${id}/approve`); loadUsers(); } catch {}
    };

    const handleReject = async (id: number) => {
        try { await api.post(`/admin/users/${id}/reject`); loadUsers(); } catch {}
    };

    const tabs = [
        { key: 'student' as RoleTab, label: 'นักศึกษา', icon: GraduationCap },
        { key: 'advisor' as RoleTab, label: 'อาจารย์', icon: BookOpen },
        { key: 'supervisor' as RoleTab, label: 'สถานประกอบการ', icon: Building2 },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600">อนุมัติแล้ว</span>;
            case 'pending': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-50 text-yellow-600">รออนุมัติ</span>;
            case 'rejected': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600">ปฏิเสธ</span>;
            default: return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-50 text-gray-600">{status}</span>;
        }
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">จัดการผู้ใช้งาน</h1>
            <div className="flex gap-2">
                {tabs.map(t => (
                    <button key={t.key} onClick={() => setActiveTab(t.key)} className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold transition ${activeTab === t.key ? 'bg-[#032B68] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        <t.icon size={18} /> {t.label}
                    </button>
                ))}
            </div>
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="ค้นหาชื่อ, รหัส, อีเมล..." className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-full border border-gray-200 focus:outline-none focus:border-[#4472c4]" />
            </div>
            {loading ? <div className="text-center py-12 text-gray-400">กำลังโหลด...</div> : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead><tr className="border-b-2 border-gray-100">
                            <th className="text-left py-3 px-4 text-gray-500 font-bold">ชื่อ</th>
                            <th className="text-left py-3 px-4 text-gray-500 font-bold">อีเมล</th>
                            <th className="text-center py-3 px-4 text-gray-500 font-bold">สถานะ</th>
                            <th className="text-center py-3 px-4 text-gray-500 font-bold">จัดการ</th>
                        </tr></thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                    <td className="py-3 px-4"><div className="font-medium text-gray-800">{u.full_name || u.username}</div>{u.student_code && <div className="text-gray-400 text-sm">{u.student_code}</div>}</td>
                                    <td className="py-3 px-4 text-gray-600">{u.email || '-'}</td>
                                    <td className="py-3 px-4 text-center">{getStatusBadge(u.status)}</td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => { setSelectedUser(u); setShowDetailModal(true); }} className="p-2 rounded-full hover:bg-blue-50 text-blue-500"><Eye size={18} /></button>
                                            {u.status === 'pending' && <>
                                                <button onClick={() => handleApprove(u.id)} className="p-2 rounded-full hover:bg-green-50 text-green-500"><CheckCircle size={18} /></button>
                                                <button onClick={() => handleReject(u.id)} className="p-2 rounded-full hover:bg-red-50 text-red-500"><XCircle size={18} /></button>
                                            </>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && <tr><td colSpan={4} className="text-center py-8 text-gray-400">ไม่พบข้อมูล</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}
            {showDetailModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowDetailModal(false)}></div>
                    <div className="relative bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                        <button onClick={() => setShowDetailModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                        <h2 className="text-2xl font-bold mb-4">{selectedUser.full_name || selectedUser.username}</h2>
                        <div className="space-y-2 text-gray-600">
                            <p>Username: {selectedUser.username}</p>
                            <p>อีเมล: {selectedUser.email || '-'}</p>
                            <p>Role: {selectedUser.sys_role}</p>
                            <p>สถานะ: {selectedUser.status}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUserManagementPage;
