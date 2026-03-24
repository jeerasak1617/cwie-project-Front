
import { Outlet } from 'react-router-dom';
// Using a simple layout without sidebar for now, or I could import a sidebar if one existed.
// Given the teacher layout has a sidebar, maybe company needs one too?
// For now, I'll make it a full width card like the TeacherSignatureLayout minus sidebar if appropriate,
// OR keep the sidebar if the user wants navigation between "Daily" and "Experience".
// The Mockup showed "Evaluation -> List". When clicking list -> Detail.
// Usually detail has tabs or sidebar.
// Let's copy TeacherSignatureLayout structure but maybe without sidebar or with a dummy one.
// Actually, for Company, they probably just need to see the document.
// Let's assume a similar sidebar is useful for switching between "Daily Log" and "Experience Plan" for that student.

import { FileText, Clock, History } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const CompanySignatureSidebar = () => {
    const menuItems = [
        { icon: Clock, label: 'ลงเวลาปฏิบัติงาน', path: 'daily' },
        { icon: FileText, label: 'บันทึกการฝึกประสบการณ์วิชาชีพ', path: 'experience' },
        { icon: History, label: 'ประวัติการลงเวลาเข้า-ออกงาน', path: 'history' },
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
                <aside className="xl:sticky xl:top-6 h-fit z-10 hidden xl:block">
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
