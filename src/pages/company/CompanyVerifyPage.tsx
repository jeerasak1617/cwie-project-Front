import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, XCircle, FileText, User } from 'lucide-react';
import api from '../../api';

const CompanyVerifyPage = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [signed, setSigned] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await api.get('/supervisor/students');
                setStudents(data.students || []);
            } catch {} finally { setLoading(false); }
        };
        fetch();
    }, []);

    const handleSign = async () => {
        if (!selectedStudent) return;
        try {
            await api.post('/supervisor/sign-experience', null, {
                params: { internship_id: selectedStudent.internship_id }
            });
            setSigned(true);
            setMsg('ลงลายเซ็นรับรองสำเร็จ');
            setTimeout(() => setMsg(''), 3000);
        } catch (err: any) { setMsg(err.response?.data?.detail || 'เกิดข้อผิดพลาด'); }
    };

    const handleUnsign = async () => {
        if (!selectedStudent) return;
        try {
            await api.post('/supervisor/unsign-experience', null, {
                params: { internship_id: selectedStudent.internship_id }
            });
            setSigned(false);
            setMsg('ยกเลิกการเซ็นสำเร็จ');
            setTimeout(() => setMsg(''), 3000);
        } catch (err: any) { setMsg(err.response?.data?.detail || 'เกิดข้อผิดพลาด'); }
    };

    if (loading) return <div className="flex justify-center items-center h-64 text-gray-500">กำลังโหลด...</div>;

    if (!selectedStudent) {
        return (
            <div className="max-w-4xl mx-auto py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">เซ็นรับรอง</h1>
                <p className="text-gray-500 mb-8">เลือกนักศึกษาเพื่อตรวจสอบข้อมูลและลงลายเซ็นรับรอง</p>
                <div className="space-y-4">
                    {students.length === 0 && <p className="text-center text-gray-400 py-8">ไม่มีนักศึกษาในระบบ</p>}
                    {students.map(s => (
                        <div key={s.internship_id} onClick={() => { setSelectedStudent(s); setSigned(false); }} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all flex justify-between items-center">
                            <div>
                                <p className="font-bold text-gray-900 text-lg">{s.full_name}</p>
                                <p className="text-gray-500">{s.student_code} | {s.job_title || '-'}</p>
                            </div>
                            <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-bold text-sm">ตรวจสอบ</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm">
                <button onClick={() => setSelectedStudent(null)} className="text-gray-400 hover:text-blue-600 font-medium mb-6 inline-flex items-center">← ย้อนกลับ</button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">บันทึกการฝึกประสบการณ์วิชาชีพ</h1>
                        <p className="text-gray-500 mb-8">ตรวจสอบข้อมูลและลงลายเซ็นรับรอง (รหัส: {selectedStudent.student_code})</p>

                        <div className="space-y-8">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><User size={20} /> ข้อมูลนักศึกษา</h2>
                                <div className="bg-gray-50 rounded-2xl p-6 grid grid-cols-2 gap-4">
                                    <div><p className="text-gray-400 text-sm">ชื่อ-นามสกุล</p><p className="font-bold text-gray-900">{selectedStudent.full_name}</p></div>
                                    <div><p className="text-gray-400 text-sm">รหัสนักศึกษา</p><p className="font-bold text-gray-900">{selectedStudent.student_code}</p></div>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><FileText size={20} /> ข้อมูลการฝึกงาน</h2>
                                <div className="bg-gray-50 rounded-2xl p-6 grid grid-cols-2 gap-4">
                                    <div><p className="text-gray-400 text-sm">ตำแหน่ง</p><p className="font-bold text-gray-900">{selectedStudent.job_title || '-'}</p></div>
                                    <div><p className="text-gray-400 text-sm">ชั่วโมงสะสม</p><p className="font-bold text-gray-900">{selectedStudent.completed_hours || 0} / {selectedStudent.required_hours || 450} ชม.</p></div>
                                    <div><p className="text-gray-400 text-sm">วันเริ่ม</p><p>{selectedStudent.start_date ? new Date(selectedStudent.start_date).toLocaleDateString('th-TH') : '-'}</p></div>
                                    <div><p className="text-gray-400 text-sm">วันสิ้นสุด</p><p>{selectedStudent.end_date ? new Date(selectedStudent.end_date).toLocaleDateString('th-TH') : '-'}</p></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ส่วนเซ็นรับรอง */}
                    <div className="bg-white border-2 border-blue-100 rounded-3xl p-6 flex flex-col items-center">
                        <h3 className="font-bold text-gray-900 mb-6">การรับรอง</h3>

                        <div className={`w-48 h-32 rounded-2xl border-2 flex flex-col items-center justify-center mb-4 ${signed ? 'border-green-300 bg-green-50' : 'border-dashed border-gray-200 bg-gray-50'}`}>
                            {signed ? (
                                <><CheckCircle2 size={32} className="text-green-500 mb-1" /><p className="text-green-600 font-bold text-sm">เซ็นเรียบร้อยแล้ว</p></>
                            ) : <p className="text-gray-400 text-sm">ยังไม่ได้เซ็น</p>}
                        </div>

                        {msg && <div className={`mb-4 p-2 rounded-xl text-center text-sm font-bold ${msg.includes('สำเร็จ') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{msg}</div>}

                        {signed ? (
                            <button onClick={handleUnsign} className="w-full py-3 bg-red-50 text-red-600 border border-red-200 rounded-2xl font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2">
                                <XCircle size={20} /> ยกเลิกการเซ็น
                            </button>
                        ) : (
                            <>
                                <p className="text-amber-600 text-xs text-center mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3">กรุณาตรวจสอบข้อมูลให้ถูกต้องครบถ้วนก่อนลงนาม</p>
                                <button onClick={handleSign} className="w-full py-3 bg-[#4472c4] hover:bg-[#3561b3] text-white rounded-2xl font-bold shadow-md transition-all">ลงลายเซ็นรับรอง</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CompanyVerifyPage;
