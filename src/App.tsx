import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import LineCallbackPage from './pages/LineCallbackPage';
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
            {/* === Public Routes (ไม่ต้อง login) === */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/line/callback" element={<LineCallbackPage />} />
            <Route path="/select-role" element={<RoleSelectionPage />} />
            <Route path="/register/student" element={<StudentRegistrationPage />} />
            <Route path="/register/teacher" element={<TeacherRegistrationPage />} />
            <Route path="/register/mentor" element={<MentorRegistrationPage />} />
            <Route path="/pending-approval" element={<PendingApprovalPage />} />

            {/* === Protected Routes (ต้อง login) === */}
            <Route path="/*" element={
                <PrivateRoute>
                    <MainLayout>
                        <Routes>
                            {/* หน้าหลัก - ทุก role เข้าได้ */}
                            <Route path="/" element={<HomePage />} />

                            {/* === นักศึกษา === */}
                            <Route path="/time-attendance" element={
                                <PrivateRoute roles={['student']}><TimeAttendancePage /></PrivateRoute>
                            } />
                            <Route path="/experience" element={
                                <PrivateRoute roles={['student']}><ExperiencePage /></PrivateRoute>
                            } />
                            <Route path="/daily-log" element={
                                <PrivateRoute roles={['student']}><DailyLogPage /></PrivateRoute>
                            } />
                            <Route path="/internship-plan" element={
                                <PrivateRoute roles={['student']}><InternshipPlanPage /></PrivateRoute>
                            } />
                            <Route path="/profile/*" element={
                                <PrivateRoute roles={['student']}><ProfilePage /></PrivateRoute>
                            } />
                            <Route path="/history" element={
                                <PrivateRoute roles={['student']}><HistoryPage /></PrivateRoute>
                            } />
                            <Route path="/internship-plan-history" element={
                                <PrivateRoute roles={['student']}><InternshipPlanHistoryPage /></PrivateRoute>
                            } />
                            <Route path="/daily-log-history" element={
                                <PrivateRoute roles={['student']}><DailyLogHistoryPage /></PrivateRoute>
                            } />

                            {/* === อาจารย์นิเทศก์ === */}
                            <Route path="/teacher" element={
                                <PrivateRoute roles={['advisor']}><TeacherDashboardPage /></PrivateRoute>
                            } />
                            <Route path="/teacher/schedule" element={
                                <PrivateRoute roles={['advisor']}><ScheduleSupervisionPage /></PrivateRoute>
                            } />
                            <Route path="/teacher/history" element={
                                <PrivateRoute roles={['advisor']}><SupervisionHistoryPage /></PrivateRoute>
                            } />
                            <Route path="/teacher/students" element={
                                <PrivateRoute roles={['advisor']}><StudentManagementPage /></PrivateRoute>
                            } />
                            <Route path="/teacher/profile" element={
                                <PrivateRoute roles={['advisor']}><TeacherProfilePage /></PrivateRoute>
                            } />
                            <Route path="/teacher/supervision/:studentId" element={
                                <PrivateRoute roles={['advisor']}><SupervisionRecordPage /></PrivateRoute>
                            } />
                            <Route path="/teacher/evaluation/:studentId" element={
                                <PrivateRoute roles={['advisor']}><EvaluationPage /></PrivateRoute>
                            } />
                            <Route path="/teacher/verify/:studentId" element={
                                <PrivateRoute roles={['advisor']}><TeacherSignatureLayout /></PrivateRoute>
                            }>
                                <Route path="daily" element={<TeacherVerifyDailyHistoryPage />} />
                                <Route path="experience" element={<TeacherVerifyExperiencePage />} />
                            </Route>

                            {/* === พี่เลี้ยง/สถานประกอบการ === */}
                            <Route path="/company" element={
                                <PrivateRoute roles={['supervisor']}><CompanyLayout /></PrivateRoute>
                            }>
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

                            {/* === Admin === */}
                            <Route path="/admin" element={
                                <PrivateRoute roles={['admin']}><AdminLayout /></PrivateRoute>
                            }>
                                <Route index element={<AdminDashboardPage />} />
                                <Route path="users" element={<AdminUserManagementPage />} />
                            </Route>
                        </Routes>
                    </MainLayout>
                </PrivateRoute>
            } />
        </Routes>
    );
}

export default App;
