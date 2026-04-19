import { Outlet, NavLink, useParams } from 'react-router-dom';
import { FileText, Clock, History, Users } from 'lucide-react';

const CompanySignatureSidebar = () => {
    const { studentId } = useParams();
    const basePath = `/company/signatures/${studentId}`;

    const menuItems = [
        { icon: Clock, label: 'ลงเวลาปฏิบัติงาน', path: `${basePath}/daily` },
        { icon: FileText, label: 'บันทึกการฝึกประสบการณ์วิชาชีพ', path: `${basePath}/experience` },
        { icon: History, label: 'ประวัติการลงเวลาเข้า-ออกงาน', path: `${basePath}/history` },
        { icon: Users, label: 'ช่องทางติดต่อผู้ปกครอง', path: `${basePath}/guardian` },
    ];

    return (
        <div className="w-full xl:w-72 bg-white rounded-3xl shadow-xl p-6 h-fit">
            <h3 className="text-lg font-bold text-[#032B68] mb-6 px-4">เมนูการตรวจสอบ</h3>
            <div className="flex flex-col gap-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 font-bold
                            ${isActive
                                ? 'bg-[#032B68] text-white shadow-md shadow-[#032B68]/30'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-[#032B68]'
                            }
                        `}
                    >
                        <item.icon size={20} strokeWidth={2} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </div>
            <div className="mt-8 pt-8 border-t border-gray-100 px-4">
                <p className="text-xs text-gray-400 font-medium">
                    โปรดตรวจสอบข้อมูลให้ถูกต้องครบถ้วนก่อนทำการลงลายเซ็นรับรอง
                </p>
            </div>
        </div>
    );
};

const CompanySignatureLayout = () => {
    return (
        <div className="flex items-center justify-center min-h-screen p-6">
            <div className="w-full max-w-[1600px] flex flex-col xl:flex-row gap-8">
                {/* Sidebar */}
                <aside className="xl:sticky xl:top-6 h-fit z-10">
                    <CompanySignatureSidebar />
                </aside>
                {/* Main Content Area */}
                <main className="flex-1 bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 min-h-[800px] relative">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default CompanySignatureLayout;
