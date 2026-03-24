import { Outlet } from 'react-router-dom';
import SignatureSidebar from '../teacher/SignatureSidebar';

const TeacherSignatureLayout = () => {
    return (
        <div className="flex items-center justify-center min-h-screen p-6">
            <div className="w-full max-w-[1600px] flex flex-col xl:flex-row gap-8">
                {/* Sidebar */}
                <aside className="xl:sticky xl:top-6 h-fit z-10">
                    <SignatureSidebar />
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 min-h-[800px] relative">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default TeacherSignatureLayout;
