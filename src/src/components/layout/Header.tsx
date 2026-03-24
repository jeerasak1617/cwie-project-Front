import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CircleUserRound, Menu, X, ChevronRight, LogOut } from 'lucide-react';
import logoUniversity from '../../assets/logo-university.png';
import logoScience from '../../assets/logo-science.png';
import logoWie from '../../assets/1765445181194.png';

interface UserProfile {
    name: string;
    role?: string;
}

const Header = () => {
    const location = useLocation();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const isTeacherSection = location.pathname.startsWith('/teacher');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 500));

                if (isTeacherSection) {
                    setUserProfile({
                        name: "อาจารย์สมชาย", // Mock Teacher Name
                        role: "teacher"
                    });
                } else if (location.pathname.toLowerCase().startsWith('/company')) {
                    setUserProfile({
                        name: "บริษัทตัวอย่าง",
                        role: "company"
                    });
                } else {
                    setUserProfile({
                        name: "จีรศักดิ์",
                        role: "student"
                    });
                }
            } catch (error) {
                console.error("Failed to fetch user profile", error);
                setUserProfile({ name: "Guest" });
            }
        };

        fetchProfile();
    }, [location.pathname, isTeacherSection]);

    // Close menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMobileMenuOpen]);

    const studentMenuItems = [
        { label: "ลงเวลาปฏิบัติงาน", path: "/time-attendance" },
        { label: "สถานที่ฝึกประสบการณ์", path: "/experience" },
        { label: "บันทึกประจำวันการฝึก", path: "/daily-log" },
        { label: "แผนงานการฝึก", path: "/internship-plan" },
        { label: "วิธีการใช้งาน", path: "#" },
    ];

    const teacherMenuItems = [
        { label: "ลงวันนิเทศ", path: "/teacher/schedule" },
        { label: "จัดการนักศึกษา", path: "/teacher/students" },
    ];

    const companyMenuItems = [
        { label: "ประเมินนักศึกษา", path: "/company/evaluation" },
        { label: "เซ็นรับรอง", path: "/company/signatures" },
    ];

    const isCompanySection = location.pathname.toLowerCase().startsWith('/company');
    const isAdminSection = location.pathname.startsWith('/admin');
    const showLogoutInNav = isTeacherSection || isCompanySection;

    const handleLogout = () => {
        setShowLogoutModal(false);
        navigate('/login');
    };

    let menuItems = studentMenuItems;
    if (isTeacherSection) {
        menuItems = teacherMenuItems;
    } else if (isCompanySection) {
        menuItems = companyMenuItems;
    }

    return (
        <header className="w-full shadow-sm bg-[#032B68] text-white overflow-hidden">
            {/* Top Bar with Logos */}
            <div className="py-4 xl:py-0 px-4 xl:px-12 border-b border-white/10 bg-[#032B68]">
                <div className="w-full flex flex-col xl:flex-row items-center justify-between gap-6 xl:gap-10 text-center xl:text-right">

                    {/* Header Top Row: Logos & Hamburger (Mobile) */}
                    <div className="w-full flex items-center justify-between xl:w-auto xl:justify-start">
                        {/* Logos */}
                        <Link to="/" className="flex items-center gap-2 sm:gap-4 hover:opacity-95 transition-opacity">
                            <img
                                src={logoUniversity}
                                alt="University Logo"
                                className="h-14 sm:h-20 md:h-28 w-auto object-contain"
                            />
                            <div className="h-8 sm:h-12 md:h-16 w-[1px] bg-white/20 mx-1"></div>
                            <img
                                src={logoScience}
                                alt="Faculty Logo"
                                className="h-16 sm:h-24 md:h-36 w-auto object-contain"
                            />
                            <div className="h-8 sm:h-12 md:h-16 w-[1px] bg-white/20 mx-1"></div>
                            <img
                                src={logoWie}
                                alt="WIE Logo"
                                className="h-8 sm:h-12 md:h-15 w-auto object-contain"
                            />
                        </Link>

                        {/* Mobile Hamburger Button */}
                        {!isAdminSection && (
                            <button
                                className="xl:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                                onClick={() => setIsMobileMenuOpen(true)}
                            >
                                <Menu size={32} />
                            </button>
                        )}
                    </div>

                    {/* System Name (Desktop Only Right) */}
                    <Link to="/" className="hidden xl:flex flex-col items-end hover:opacity-95 transition-opacity">
                        <h1 className="text-lg md:text-3xl font-bold text-white leading-tight">
                            ระบบฝึกประสบการณ์วิชาชีพและสหกิจศึกษา
                        </h1>
                        <p className="text-xs md:text-base text-white/90 font-medium mt-1">
                            มหาวิทยาลัยราชภัฏจันทรเกษม | Chandrakasem Rajabhat University
                        </p>
                    </Link>

                    {/* System Name (Mobile Only Centered) */}
                    <div className="xl:hidden text-center mt-2">
                        <h1 className="text-xl font-bold text-white leading-tight">
                            ระบบฝึกประสบการณ์วิชาชีพ
                        </h1>
                        <p className="text-[10px] text-white/80 font-medium mt-1">
                            มหาวิทยาลัยราชภัฏจันทรเกษม | Chandrakasem Rajabhat University
                        </p>
                    </div>
                </div>
            </div>

            {/* Desktop Navigation (Hidden on Mobile and Admin) */}
            {!isAdminSection && (
                <nav className="hidden xl:block bg-[#4472c4] text-white py-4">
                    <div className="w-full px-4 md:px-12">
                        <div className="flex items-center w-full gap-2">
                            {menuItems.map((item, index) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={index}
                                        to={item.path}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors text-lg md:text-xl font-medium whitespace-nowrap
                                        ${isActive ? 'text-[#ffd700]' : 'hover:text-[#ffd700]'}
                                    `}
                                    >
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}

                            {/* User Profile */}
                            <Link
                                to={isTeacherSection ? "/teacher/profile" : (isCompanySection ? "/company/profile" : "/profile")}
                                className="flex-1 flex items-center justify-center gap-2 cursor-pointer hover:text-[#ffd700] py-2 rounded-lg transition-colors text-lg md:text-xl"
                            >
                                <CircleUserRound size={24} strokeWidth={1.5} />
                                <span className="font-medium whitespace-nowrap">{userProfile ? userProfile.name : "..."}</span>
                            </Link>

                            {/* Logout Button (Teacher & Company) */}
                            {showLogoutInNav && (
                                <button
                                    onClick={() => setShowLogoutModal(true)}
                                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors text-lg md:text-xl text-white/80 hover:text-red-300 hover:bg-white/10 whitespace-nowrap"
                                >
                                    <LogOut size={22} strokeWidth={1.5} />
                                    <span className="font-medium">ออกจากระบบ</span>
                                </button>
                            )}
                        </div>
                    </div>
                </nav>
            )}

            {/* Mobile Navigation Drawer (Hidden on Admin) */}
            {!isAdminSection && (
                <div className={`xl:hidden fixed inset-0 z-[100] transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Drawer Content */}
                    <div className={`absolute top-0 right-0 w-[85%] max-w-[320px] h-full bg-white shadow-2xl transition-transform duration-300 ease-out transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                        <div className="flex flex-col h-full">
                            {/* Drawer Header */}
                            <div className="bg-[#032B68] text-white p-6 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold">เมนูหลัก</h2>
                                    <p className="text-xs text-white/70 mt-1">CWIE System</p>
                                </div>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Menu Links */}
                            <div className="flex-1 overflow-y-auto py-2">
                                {/* Profile Item (Moved into list) */}
                                <Link
                                    to={isTeacherSection ? "/teacher/profile" : (isCompanySection ? "/company/profile" : "/profile")}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center justify-between px-6 py-4 border-b border-gray-100 transition-colors text-gray-700 hover:bg-gray-50`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-[#032B68]">
                                            <CircleUserRound size={24} />
                                        </div>
                                        <span className="text-base font-bold text-[#032B68]">{userProfile ? userProfile.name : "..."}</span>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-400" />
                                </Link>

                                {menuItems.map((item, index) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={index}
                                            to={item.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`flex items-center justify-between px-6 py-4 border-b border-gray-100 transition-colors
                                            ${isActive ? 'bg-blue-50 text-[#032B68] font-bold border-l-4 border-l-[#032B68]' : 'text-gray-700 hover:bg-gray-50'}
                                        `}
                                        >
                                            <span className="text-base">{item.label}</span>
                                            <ChevronRight size={18} className="text-gray-400" />
                                        </Link>
                                    );
                                })}

                                {/* Logout (Mobile - Teacher & Company) */}
                                {showLogoutInNav && (
                                    <button
                                        onClick={() => { setIsMobileMenuOpen(false); setShowLogoutModal(true); }}
                                        className="flex items-center justify-between px-6 py-4 border-t border-gray-100 transition-colors text-red-400 hover:bg-red-50 w-full mt-auto"
                                    >
                                        <div className="flex items-center gap-3">
                                            <LogOut size={24} />
                                            <span className="text-base font-bold">ออกจากระบบ</span>
                                        </div>
                                        <ChevronRight size={18} className="text-red-300" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={() => setShowLogoutModal(false)}>
                    <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200 w-full max-w-sm overflow-hidden border border-slate-100" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end p-4 pb-0">
                            <button onClick={() => setShowLogoutModal(false)} className="p-1.5 text-slate-300 hover:text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
                                <X size={18} />
                            </button>
                        </div>
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
        </header>
    );
};

export default Header;
