import { useState } from 'react';
import { KeyRound, Search, Eye, EyeOff, RefreshCw, Shield, GraduationCap, BookOpen, Building2, X, Check, Sparkles } from 'lucide-react';
import { useRegisteredUsers, type RegisteredUser } from '../../contexts/RegisteredUsersContext';

const AdminPasswordManagementPage = () => {
    const { users, resetPassword } = useRegisteredUsers();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<RegisteredUser | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'teacher': return BookOpen;
            case 'company': return Building2;
            default: return GraduationCap;
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'teacher': return 'อาจารย์';
            case 'company': return 'สถานประกอบการ';
            default: return 'นักศึกษา';
        }
    };

    const getRoleBadgeStyle = (role: string) => {
        switch (role) {
            case 'teacher': return 'bg-emerald-50 text-emerald-600';
            case 'company': return 'bg-amber-50 text-amber-600';
            default: return 'bg-blue-50 text-blue-600';
        }
    };

    const getRoleGradient = (role: string) => {
        switch (role) {
            case 'teacher': return 'from-emerald-400 to-teal-600';
            case 'company': return 'from-amber-400 to-orange-500';
            default: return 'from-[#4472c4] to-[#032B68]';
        }
    };

    const getIdentifier = (user: RegisteredUser) => {
        if (user.role === 'student') return user.studentId || '-';
        if (user.role === 'teacher') return user.department || '-';
        return user.company || '-';
    };

    const filteredUsers = users.filter(
        (user) =>
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.studentId && user.studentId.includes(searchTerm)) ||
            (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.company && user.company.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const openResetModal = (user: RegisteredUser) => {
        setSelectedUser(user);
        setNewPassword('');
        setConfirmPassword('');
        setShowNewPass(false);
        setShowConfirmPass(false);
        setShowModal(true);
    };

    const handleResetPassword = () => {
        if (!newPassword || newPassword !== confirmPassword || !selectedUser) return;
        resetPassword(selectedUser.id, newPassword);
        setShowModal(false);
        setSuccessMessage(`เปลี่ยนรหัสผ่านสำหรับ ${selectedUser.firstName} ${selectedUser.lastName} สำเร็จ`);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const isFormValid = newPassword.length >= 6 && newPassword === confirmPassword;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-gradient-to-br from-[#4472c4] to-[#032B68] rounded-xl flex items-center justify-center shadow-lg shadow-[#032B68]/20">
                    <KeyRound size={16} className="text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                        จัดการรหัสผ่าน
                    </h1>
                </div>
            </div>
            <p className="text-slate-400 text-sm ml-10 -mt-4">ค้นหาและรีเซ็ตรหัสผ่านผู้ใช้งานในระบบ</p>

            {/* Success Message */}
            {successMessage && (
                <div className="bg-emerald-50 border border-emerald-200/50 rounded-2xl px-5 py-4 flex items-center gap-3 shadow-sm animate-pulse">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                        <Check size={16} className="text-white" />
                    </div>
                    <span className="text-sm font-bold text-emerald-700">{successMessage}</span>
                </div>
            )}

            {/* Search & Users Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/80 shadow-sm overflow-hidden">
                {/* Search Bar */}
                <div className="p-5 border-b border-slate-100/80">
                    <div className="relative max-w-lg">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input
                            type="text"
                            placeholder="ค้นหาด้วยชื่อ, อีเมล, รหัสนักศึกษา, สาขา, สถานที่..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4472c4]/30 focus:border-[#4472c4]/50 text-sm text-slate-700 placeholder-slate-300 transition-all"
                        />
                    </div>
                </div>

                {/* User Cards */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredUsers.length === 0 ? (
                        <div className="col-span-2 flex flex-col items-center justify-center py-16 gap-3">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
                                <Search size={24} className="text-slate-300" />
                            </div>
                            <p className="text-sm text-slate-400 font-medium">ไม่พบผู้ใช้งานที่ค้นหา</p>
                        </div>
                    ) : (
                        filteredUsers.map((user) => {
                            const RoleIcon = getRoleIcon(user.role);
                            return (
                                <div
                                    key={user.id}
                                    className="group relative bg-white/80 rounded-2xl border border-slate-100/80 p-4 hover:shadow-lg hover:shadow-blue-100/30 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                                >
                                    {/* Decorative accent */}
                                    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${getRoleGradient(user.role)} rounded-full opacity-[0.04] group-hover:opacity-[0.1] group-hover:scale-150 transition-all duration-500 -translate-y-1/2 translate-x-1/2`}></div>

                                    <div className="relative flex items-center justify-between">
                                        <div className="flex items-center gap-3.5">
                                            {/* Avatar */}
                                            <div className={`w-12 h-12 bg-gradient-to-br ${getRoleGradient(user.role)} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                                                {user.firstName.charAt(0)}
                                            </div>
                                            {/* Info */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="text-sm font-bold text-slate-700">{user.firstName} {user.lastName}</span>
                                                    <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold flex items-center gap-0.5 ${getRoleBadgeStyle(user.role)}`}>
                                                        <RoleIcon size={9} />
                                                        {getRoleLabel(user.role)}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-slate-400">{user.email} · {getIdentifier(user)}</p>
                                            </div>
                                        </div>
                                        {/* Reset Button */}
                                        <button
                                            onClick={() => openResetModal(user)}
                                            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-gradient-to-r hover:from-[#4472c4] hover:to-[#032B68] text-[#4472c4] hover:text-white rounded-xl text-xs font-bold transition-all duration-300 hover:shadow-lg hover:shadow-[#032B68]/20"
                                        >
                                            <RefreshCw size={14} />
                                            <span className="hidden sm:inline">รีเซ็ต</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Reset Password Modal */}
            {showModal && selectedUser && (
                <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200 w-full max-w-md overflow-hidden border border-slate-100" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className={`bg-gradient-to-r ${getRoleGradient(selectedUser.role)} p-6 text-white relative overflow-hidden`}>
                            <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>

                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <div className="flex items-center gap-2">
                                    <Shield size={18} />
                                    <h3 className="text-lg font-bold">รีเซ็ตรหัสผ่าน</h3>
                                </div>
                                <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-white/20 rounded-xl transition-colors">
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-xl font-bold border border-white/20">
                                    {selectedUser.firstName.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold">{selectedUser.firstName} {selectedUser.lastName}</p>
                                    <p className="text-white/70 text-sm">{getRoleLabel(selectedUser.role)} · {selectedUser.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4">
                            {/* New Password */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">รหัสผ่านใหม่</label>
                                <div className="relative">
                                    <input
                                        type={showNewPass ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="อย่างน้อย 6 ตัวอักษร"
                                        className="w-full px-4 py-3.5 pr-12 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300 text-sm text-slate-700 placeholder-slate-300 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPass(!showNewPass)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                                    >
                                        {showNewPass ? <EyeOff size={17} /> : <Eye size={17} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ยืนยันรหัสผ่าน</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPass ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="ระบุรหัสผ่านอีกครั้ง"
                                        className="w-full px-4 py-3.5 pr-12 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300 text-sm text-slate-700 placeholder-slate-300 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                                    >
                                        {showConfirmPass ? <EyeOff size={17} /> : <Eye size={17} />}
                                    </button>
                                </div>
                                {confirmPassword && newPassword !== confirmPassword && (
                                    <p className="text-[11px] text-red-400 mt-1.5 font-medium">รหัสผ่านไม่ตรงกัน</p>
                                )}
                                {newPassword && newPassword.length < 6 && (
                                    <p className="text-[11px] text-amber-400 mt-1.5 font-medium">รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleResetPassword}
                                disabled={!isFormValid}
                                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 ${isFormValid
                                    ? 'bg-gradient-to-r from-[#032B68] to-[#4472c4] text-white shadow-lg shadow-[#032B68]/20 hover:shadow-xl hover:-translate-y-0.5'
                                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                    }`}
                            >
                                <Sparkles size={16} />
                                ยืนยันเปลี่ยนรหัสผ่าน
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPasswordManagementPage;
