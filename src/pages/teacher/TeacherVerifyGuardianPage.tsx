import { useState, useEffect } from 'react';
import { Users, Phone, Briefcase, UserCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import api from '../../api';

interface FamilyMember {
    relation_type: string;
    first_name: string;
    last_name: string;
    occupation: string;
    phone: string;
}

const relationLabels: Record<string, { label: string; color: string; bgColor: string }> = {
    guardian: { label: 'ผู้ปกครอง', color: 'text-purple-700', bgColor: 'bg-purple-50 border-purple-100' },
    father: { label: 'บิดา', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-100' },
    mother: { label: 'มารดา', color: 'text-pink-700', bgColor: 'bg-pink-50 border-pink-100' },
};

const TeacherVerifyGuardianPage = () => {
    const { studentId } = useParams();
    const [families, setFamilies] = useState<FamilyMember[]>([]);
    const [studentInfo, setStudentInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [studentRes, familyRes] = await Promise.all([
                    api.get(`/advisor/students/${studentId}`),
                    api.get(`/advisor/students/${studentId}/family`).catch(() => ({ data: { families: [] } })),
                ]);
                setStudentInfo(studentRes.data);
                setFamilies(familyRes.data.families || []);
            } catch (err) {
                console.error('Failed to fetch:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [studentId]);

    if (loading) {
        return <div className="flex justify-center items-center h-64 text-gray-500">กำลังโหลดข้อมูล...</div>;
    }

    const student = studentInfo?.student || {};
    const hasAnyData = families.some(f => f.first_name || f.last_name || f.phone);

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="mb-8 border-b border-gray-100 pb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <Users className="text-green-500" size={32} />
                    ช่องทางติดต่อผู้ปกครอง
                </h1>
                <p className="text-gray-500">
                    ข้อมูลผู้ปกครองของนักศึกษา: <span className="text-gray-800 font-bold">{student.full_name}</span>
                    {student.student_code && ` (${student.student_code})`}
                </p>
            </div>

            {!hasAnyData ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-8 text-center">
                    <Users className="mx-auto text-yellow-400 mb-3" size={48} />
                    <p className="text-yellow-800 font-bold text-lg">ยังไม่มีข้อมูลผู้ปกครอง</p>
                    <p className="text-yellow-600 text-sm mt-2">นักศึกษายังไม่ได้กรอกข้อมูลผู้ปกครองในระบบ</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {['guardian', 'father', 'mother'].map((type) => {
                        const member = families.find(f => f.relation_type === type);
                        const config = relationLabels[type];
                        const hasData = member && (member.first_name || member.last_name || member.phone);

                        return (
                            <div
                                key={type}
                                className={`rounded-3xl p-6 border ${hasData ? config.bgColor : 'bg-gray-50 border-gray-100 opacity-60'}`}
                            >
                                <div className="flex items-center gap-3 mb-5">
                                    <div className={`p-3 rounded-2xl bg-white shadow-sm ${config.color}`}>
                                        <UserCircle size={28} />
                                    </div>
                                    <div>
                                        <h3 className={`font-bold text-lg ${hasData ? config.color : 'text-gray-400'}`}>
                                            {config.label}
                                        </h3>
                                        {!hasData && <p className="text-xs text-gray-400">ไม่มีข้อมูล</p>}
                                    </div>
                                </div>

                                {hasData && member ? (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase block mb-1">ชื่อ-นามสกุล</label>
                                            <p className="font-bold text-gray-900 text-lg">
                                                {member.first_name || '-'} {member.last_name || ''}
                                            </p>
                                        </div>

                                        {member.occupation && (
                                            <div className="flex items-start gap-2 pt-2">
                                                <Briefcase size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase block">อาชีพ</label>
                                                    <p className="text-gray-700">{member.occupation}</p>
                                                </div>
                                            </div>
                                        )}

                                        {member.phone && (
                                            <div className="flex items-start gap-2 pt-2">
                                                <Phone size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase block">เบอร์โทร</label>
                                                    <a
                                                        href={`tel:${member.phone}`}
                                                        className="text-[#4472c4] font-bold hover:underline"
                                                    >
                                                        {member.phone}
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 text-center py-4">—</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Hint ส่วนล่าง */}
            <div className="mt-8 p-5 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
                <Phone className="text-blue-500 mt-0.5 flex-shrink-0" size={20} />
                <div>
                    <p className="text-blue-900 font-bold text-sm mb-1">หมายเหตุ</p>
                    <p className="text-blue-700 text-sm">
                        ข้อมูลนี้ใช้สำหรับติดต่อผู้ปกครองในกรณีฉุกเฉินเท่านั้น กรุณาใช้ข้อมูลอย่างเหมาะสม
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TeacherVerifyGuardianPage;
