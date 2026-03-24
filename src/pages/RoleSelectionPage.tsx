import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GraduationCap, User, Building2, Check } from 'lucide-react';

const roles = [
    { id: 'student', name: 'นักศึกษา', description: 'นักศึกษาฝึกงานและส่งรายงานประจำวัน', icon: GraduationCap, path: '/register/student' },
    { id: 'teacher', name: 'อาจารย์', description: 'ตรวจบันทึกและตรวจความคืบหน้านักศึกษา', icon: User, path: '/register/teacher' },
    { id: 'mentor', name: 'พี่เลี้ยง', description: 'ดูแลนักศึกษา ณ สถานประกอบการ', icon: Building2, path: '/register/mentor' },
];

const RoleSelectionPage = () => {
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';
    const name = searchParams.get('name') || 'ผู้ใช้งาน';

    const handleContinue = () => {
        const role = roles.find(r => r.id === selectedRole);
        if (role) {
            navigate(`${role.path}?token=${encodeURIComponent(token)}&name=${encodeURIComponent(name)}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#f0f4f8] flex flex-col items-center justify-center px-4 py-8">
            <div className="mb-8 text-center">
                <span className="text-[#06c755] font-bold text-lg">LINE</span>
                <span className="text-gray-700 font-medium ml-2">{decodeURIComponent(name)}</span>
            </div>
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 w-full max-w-lg">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">คุณคือใคร ?</h1>
                    <p className="text-gray-400 text-sm">กรุณาเลือกสถานะของคุณเพื่อเข้าสู่ระบบ</p>
                </div>
                <div className="space-y-4">
                    {roles.map((role) => (
                        <button key={role.id} onClick={() => setSelectedRole(role.id)}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 ${selectedRole === role.id ? 'border-[#4472c4] bg-blue-50 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'}`}>
                            <role.icon className={`w-10 h-10 ${selectedRole === role.id ? 'text-[#4472c4]' : 'text-gray-400'}`} />
                            <div className="flex-1 text-left">
                                <h3 className={`text-xl font-bold ${selectedRole === role.id ? 'text-[#4472c4]' : 'text-gray-800'}`}>{role.name}</h3>
                                <p className={`text-sm ${selectedRole === role.id ? 'text-[#4472c4]/70' : 'text-gray-400'}`}>{role.description}</p>
                            </div>
                            {selectedRole === role.id && <div className="w-8 h-8 bg-[#4472c4] rounded-full flex items-center justify-center"><Check className="w-5 h-5 text-white" /></div>}
                        </button>
                    ))}
                </div>
                <button onClick={handleContinue} disabled={!selectedRole}
                    className={`w-full mt-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 ${selectedRole ? 'bg-[#4472c4] text-white hover:bg-[#3561b3] shadow-lg hover:shadow-xl' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                    ดำเนินการต่อ
                </button>
            </div>
        </div>
    );
};

export default RoleSelectionPage;
