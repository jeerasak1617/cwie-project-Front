import { NavLink, useParams } from 'react-router-dom';
import { FileClock, FileCheck } from 'lucide-react';

const SignatureSidebar = () => {
    const { studentId } = useParams();
    const basePath = `/teacher/verify/${studentId}`;

    const menuItems = [
        {
            label: "ประวัติบันทึกประจำวันการฝึกวิชาชีพ",
            path: `${basePath}/daily`,
            icon: FileClock,
            color: "text-blue-500"
        },
        {
            label: "บันทึกการฝึกประสบการณ์วิชาชีพ",
            path: `${basePath}/experience`,
            icon: FileCheck,
            color: "text-orange-500"
        },
    ];

    return (
        <div className="w-full xl:w-72 bg-white rounded-3xl shadow-xl p-6 h-fit">
            <h3 className="text-lg font-bold text-[#032B68] mb-6 px-4">เมนูการตรวจสอบ</h3>
            <div className="flex flex-col gap-2">
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 font-bold
                            ${isActive
                                ? 'bg-[#032B68] text-white shadow-md shadow-[#032B68]/30'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-[#032B68]'}
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

export default SignatureSidebar;
