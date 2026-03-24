import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Shield, LogOut, X } from 'lucide-react';

const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'แดชบอร์ด', end: true },
    { to: '/admin/users', icon: Users, label: 'จัดการผู้ใช้งาน', end: false },
];

const AdminLayout = () => {
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        setShowLogoutModal(false);
        navigate('/login');
    };

    return (
        <div className="min-h-[calc(100vh-180px)]">
            {/* Sticky Top Navigation Bar — flush under header */}
            <div className="sticky top-0 z-40 -mx-4 md:-mx-12 mb-6">
                <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm shadow-slate-200/30">
                    <div className="px-4 md:px-12 flex items-center justify-between h-16">
                        {/* Left: Brand + Nav Items */}
                        <div className="flex items-center gap-2">
                            {/* Brand */}
                            <div className="flex items-center gap-3 pr-6 mr-3 border-r border-slate-200/60">
                                <div className="w-10 h-10 bg-gradient-to-br from-[#032B68] to-[#4472c4] rounded-xl flex items-center justify-center shadow-md shadow-[#032B68]/15">
                                    <Shield size={20} className="text-white" />
                                </div>
                                <span className="text-base font-bold text-[#032B68] hidden sm:block">Admin Panel</span>
                            </div>

                            {/* Navigation Links */}
                            <nav className="flex items-center gap-1.5">
                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        end={item.end}
                                        className={({ isActive }) =>
                                            `flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 text-[15px] ${isActive
                                                ? 'bg-gradient-to-r from-[#032B68] to-[#4472c4] text-white shadow-md shadow-[#032B68]/15'
                                                : 'text-slate-500 hover:bg-blue-50/80 hover:text-[#032B68]'
                                            }`
                                        }
                                    >
                                        <item.icon size={19} />
                                        <span>{item.label}</span>
                                    </NavLink>
                                ))}
                            </nav>
                        </div>

                        {/* Right: Logout */}
                        <button
                            onClick={() => setShowLogoutModal(true)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 text-[15px] font-medium"
                        >
                            <LogOut size={19} />
                            <span className="hidden sm:inline">ออกจากระบบ</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main>
                <Outlet />
            </main>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowLogoutModal(false)}>
                    <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200 w-full max-w-sm overflow-hidden border border-slate-100" onClick={(e) => e.stopPropagation()}>
                        {/* Close Button */}
                        <div className="flex justify-end p-4 pb-0">
                            <button onClick={() => setShowLogoutModal(false)} className="p-1.5 text-slate-300 hover:text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-6 pb-6 text-center">
                            <h3 className="text-lg font-bold text-slate-800 mb-1">ยืนยันการออกจากระบบ</h3>
                            <p className="text-sm text-slate-400 mb-6">คุณต้องการออกจากระบบใช่หรือไม่?</p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-500 font-semibold text-sm hover:bg-slate-50 transition-all"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-red-400 to-rose-500 text-white font-semibold text-sm shadow-lg shadow-red-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                                >
                                    ออกจากระบบ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLayout;
