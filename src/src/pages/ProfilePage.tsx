import { Routes, Route } from 'react-router-dom';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import StudentHistory from '../components/profile/StudentHistory';
import StudentDomicile from '../components/profile/StudentDomicile';
import StudentGuardian from '../components/profile/StudentGuardian';


const ProfilePage = () => {
    return (
        <div className="">
            <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-7">
                {/* Sidebar - Fixed width */}
                <aside className="w-full xl:w-80 flex-shrink-0">
                    <ProfileSidebar />
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 bg-white rounded-[30px] p-8 xl:p-12 shadow-xl min-w-0">
                    <Routes>
                        <Route path="/" element={<StudentHistory />} />
                        <Route path="domicile" element={<StudentDomicile />} />
                        <Route path="guardian" element={<StudentGuardian />} />

                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default ProfilePage;
