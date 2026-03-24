
import { NavLink } from 'react-router-dom';
import { FileText, PenTool, User } from 'lucide-react';

const CompanySidebar = () => {
    // Hardcoded for now, or could come from context/auth
    const basePath = `/company`;

    const menuItems = [
        {
            label: "ประเมินนักศึกษา",
            path: `${basePath}/evaluation`,
            icon: FileText,
            color: "text-blue-500" // Adjust color to match design if needed
        },
        {
            label: "เซ็นรับรอง",
            path: `${basePath}/signatures`,
            icon: PenTool,
            color: "text-orange-500"
        },
        {
            label: "โปรไฟล์",
            path: `${basePath}/profile`,
            icon: User,
            color: "text-green-500"
        },
    ];

    return (
        <div className="bg-white rounded-[30px] p-6 shadow-xl h-full flex flex-col gap-4 w-full xl:w-80 min-h-fit xl:min-h-[600px]">
            {menuItems.map((item, index) => (
                <NavLink
                    key={index}
                    to={item.path}
                    className={({ isActive }) => `
                        w-full text-left px-5 py-4 rounded-xl font-bold text-base transition-all duration-200 flex items-center gap-3
                        ${isActive
                            ? 'bg-[#fff5d0] text-[#032B68] shadow-sm translate-x-1'
                            : 'text-gray-500 hover:bg-[#fff5d0] hover:text-[#032B68] hover:translate-x-1'}
                    `}
                >
                    {({ isActive }) => (
                        <>
                            <div className={`p-2 rounded-full ${isActive ? 'bg-[#032B68]/10' : 'bg-gray-50'}`}>
                                <item.icon
                                    size={24}
                                    className={item.color}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                            </div>
                            <span className={isActive ? "font-bold" : "font-medium"}>{item.label}</span>
                        </>
                    )}
                </NavLink>
            ))}
        </div>
    );
};

export default CompanySidebar;
