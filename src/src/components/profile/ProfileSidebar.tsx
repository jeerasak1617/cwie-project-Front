import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User, Home, Users, LogOut, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ProfileSidebar = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        setShowLogoutModal(false);
        logout();
        navigate('/login');
    };

    const menuItems = [
        { label: "ประวัตินักศึกษา", path: "/profile", icon: User, color: "text-blue-500" },
        { label: "ภูมิลำเนานักศึกษา", path: "/profile/domicile", icon: Home, color: "text-orange-500" },
        { label: "ข้อมูลผู้ปกครอง", path: "/profile/guardian", icon: Users, color: "text-green-500" },
    ];

    return (
        <>
            <div className="bg-white rounded-[30px] p-6 shadow-xl h-full flex flex-col gap-4">
                {menuItems.map((item, index) => (
                    <NavLink key={index} to={item.path} end={item.path === '/profile'}
                        className={({ isActive }) => `w-full text-left px-5 py-3 rounded-xl font-bold text-base md:text-lg transition-all duration-200 flex items-center gap-3 ${isActive ? 'bg-[#fff5d0] text-[#032B68] shadow-sm translate-x-1' : 'text-gray-500 hover:bg-[#fff5d0] hover:text-[#032B68] hover:translate-x-1'}`}>
                        {({ isActive }) => (<><item.icon size={28} className={item.color} strokeWidth={isActive ? 2.5 : 2} /><span className={isActive ? "font-bold" : "font-medium"}>{item.label}</span></>)}
                    </NavLink>
                ))}
                <div className="border-t border-gray-200 my-2"></div>
                <button onClick={() => setShowLogoutModal(true)} className="w-full text-left px-5 py-3 rounded-xl font-bold text-base md:text-lg transition-all duration-200 flex items-center gap-3 text-red-400 hover:bg-red-50 hover:text-red-500">
                    <LogOut size={28} strokeWidth={2} /><span className="font-medium">ออกจากระบบ</span>
                </button>
            </div>
            {showLogoutModal && (
                <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowLogoutModal(false)}>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-100" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-end p-4 pb-0"><button onClick={() => setShowLogoutModal(false)} className="p-1.5 text-slate-300 hover:text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"><X size={18} /></button></div>
                        <div className="px-6 pb-6 text-center">
                            <h3 className="text-lg font-bold text-slate-800 mb-1">ยืนยันการออกจากระบบ</h3>
                            <p className="text-sm text-slate-400 mb-6">คุณต้องการออกจากระบบใช่หรือไม่?</p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-500 font-semibold text-sm hover:bg-slate-50 transition-all">ยกเลิก</button>
                                <button onClick={handleLogout} className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-red-400 to-rose-500 text-white font-semibold text-sm shadow-lg shadow-red-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all">ออกจากระบบ</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfileSidebar;
