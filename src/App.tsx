import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import TimeAttendancePage from './pages/TimeAttendancePage';
import ExperiencePage from './pages/ExperiencePage';
import DailyLogPage from './pages/DailyLogPage';
import InternshipPlanPage from './pages/InternshipPlanPage';
import ProfilePage from './pages/ProfilePage';
import HistoryPage from './pages/HistoryPage';
import InternshipPlanHistoryPage from './pages/InternshipPlanHistoryPage';
import DailyLogHistoryPage from './pages/DailyLogHistoryPage';
import TeacherDashboardPage from './pages/teacher/TeacherDashboardPage';
import ScheduleSupervisionPage from './pages/teacher/ScheduleSupervisionPage';
import SupervisionHistoryPage from './pages/teacher/SupervisionHistoryPage';
import StudentManagementPage from './pages/teacher/StudentManagementPage';
import SupervisionRecordPage from './pages/teacher/SupervisionRecordPage';
import TeacherSignatureLayout from './components/layout/TeacherSignatureLayout';
import TeacherVerifyDailyHistoryPage from './pages/teacher/TeacherVerifyDailyHistoryPage';
import TeacherVerifyExperiencePage from './pages/teacher/TeacherVerifyExperiencePage';
import TeacherProfilePage from './pages/teacher/TeacherProfilePage';
import EvaluationPage from './pages/teacher/EvaluationPage';
import CompanyLayout from './components/layout/CompanyLayout';
import CompanyDashboardPage from './pages/company/CompanyDashboardPage';
import CompanyEvaluationPage from './pages/company/CompanyEvaluationPage';
import CompanySignaturesPage from './pages/company/CompanySignaturesPage';
import CompanySignatureLayout from './components/layout/CompanySignatureLayout';
import CompanyVerifyDailyHistoryPage from './pages/company/CompanyVerifyDailyHistoryPage';
import CompanyVerifyExperiencePage from './pages/company/CompanyVerifyExperiencePage';
import CompanyVerifyAttendanceHistoryPage from './pages/company/CompanyVerifyAttendanceHistoryPage';
import CompanyProfilePage from './pages/company/CompanyProfilePage';
import CompanyEvaluationDetailPage from './pages/company/CompanyEvaluationDetailPage';
import StudentRegistrationPage from './pages/StudentRegistrationPage';
import TeacherRegistrationPage from './pages/TeacherRegistrationPage';
import MentorRegistrationPage from './pages/MentorRegistrationPage';
import PendingApprovalPage from './pages/PendingApprovalPage';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUserManagementPage from './pages/admin/AdminUserManagementPage';

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/select-role" element={<RoleSelectionPage />} />
            <Route path="/register/student" element={<StudentRegistrationPage />} />
            <Route path="/register/teacher" element={<TeacherRegistrationPage />} />
            <Route path="/register/mentor" element={<MentorRegistrationPage />} />
            <Route path="/pending-approval" element={<PendingApprovalPage />} />

            <Route path="/*" element={
                <MainLayout>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/time-attendance" element={<TimeAttendancePage />} />
                        <Route path="/experience" element={<ExperiencePage />} />
                        <Route path="/daily-log" element={<DailyLogPage />} />
                        <Route path="/internship-plan" element={<InternshipPlanPage />} />
                        <Route path="/profile/*" element={<ProfilePage />} />
                        <Route path="/history" element={<HistoryPage />} />
                        <Route path="/internship-plan-history" element={<InternshipPlanHistoryPage />} />
                        <Route path="/daily-log-history" element={<DailyLogHistoryPage />} />
                        <Route path="/teacher" element={<TeacherDashboardPage />} />
                        <Route path="/teacher/schedule" element={<ScheduleSupervisionPage />} />
                        <Route path="/teacher/history" element={<SupervisionHistoryPage />} />
                        <Route path="/teacher/students" element={<StudentManagementPage />} />
                        <Route path="/teacher/profile" element={<TeacherProfilePage />} />
                        <Route path="/teacher/supervision/:studentId" element={<SupervisionRecordPage />} />
                        <Route path="/teacher/evaluation/:studentId" element={<EvaluationPage />} />
                        <Route path="/company" element={<CompanyLayout />}>
                            <Route index element={<CompanyDashboardPage />} />
                            <Route path="evaluation" element={<CompanyEvaluationPage />} />
                            <Route path="signatures" element={<CompanySignaturesPage />} />
                            <Route path="signatures/:studentId" element={<CompanySignatureLayout />}>
                                <Route index element={<CompanyVerifyDailyHistoryPage />} />
                                <Route path="daily" element={<CompanyVerifyDailyHistoryPage />} />
                                <Route path="experience" element={<CompanyVerifyExperiencePage />} />
                                <Route path="history" element={<CompanyVerifyAttendanceHistoryPage />} />
                            </Route>
                            <Route path="profile" element={<CompanyProfilePage />} />
                            <Route path="evaluation/:studentId" element={<CompanyEvaluationDetailPage />} />
                        </Route>
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<AdminDashboardPage />} />
                            <Route path="users" element={<AdminUserManagementPage />} />
                        </Route>
                        <Route path="/teacher/verify/:studentId" element={<TeacherSignatureLayout />}>
                            <Route path="daily" element={<TeacherVerifyDailyHistoryPage />} />
                            <Route path="experience" element={<TeacherVerifyExperiencePage />} />
                        </Route>
                    </Routes>
                </MainLayout>
            } />
        </Routes>
    );
}

export default App;
