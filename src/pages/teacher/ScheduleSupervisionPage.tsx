import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, Clock } from 'lucide-react';
import CustomDropdown from '../../components/ui/CustomDropdown';
import AutoResizeTextarea from '../../components/ui/AutoResizeTextarea';
import api from '../../api';

const ScheduleSupervisionPage = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedInternshipId, setSelectedInternshipId] = useState<number | null>(null);
    const [workplace, setWorkplace] = useState('');
    const [supervisionDate, setSupervisionDate] = useState<Date | null>(null);
    const [supervisionTime, setSupervisionTime] = useState<Date | null>(null);
    const [note, setNote] = useState('');
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const { data } = await api.get('/advisor/students');
                setStudents(data.students || []);
            } catch (err) {
                console.error('Failed to fetch students:', err);
            }
        };
        fetchStudents();
    }, []);

    const handleStudentChange = (studentName: string) => {
        setSelectedStudent(studentName);
        const student = students.find(s => s.full_name === studentName);
        if (student) {
            setSelectedInternshipId(student.internship_id);
            setWorkplace(`บริษัท ID: ${student.company_id || '-'}`);
        } else {
            setSelectedInternshipId(null);
            setWorkplace('');
        }
    };

    const handleSave = async () => {
        if (!selectedInternshipId || !supervisionDate) {
            alert('กรุณาเลือกนักศึกษาและวันที่นิเทศ');
            return;
        }
        setSaving(true);
        try {
            const timeStr = supervisionTime
                ? `${supervisionTime.getHours().toString().padStart(2, '0')}:${supervisionTime.getMinutes().toString().padStart(2, '0')}`
                : undefined;

            await api.post('/advisor/visit-schedule', null, {
                params: {
                    internship_id: selectedInternshipId,
                    semester_id: 1, // TODO: get current semester
                    scheduled_date: supervisionDate.toISOString().split('T')[0],
                    scheduled_time: timeStr,
                    notes: note || undefined,
                }
            });
            alert('บันทึกวันนิเทศเรียบร้อยแล้ว');
            navigate('/teacher');
        } catch (err: any) {
            console.error('Failed to save:', err);
            alert(err.response?.data?.detail || 'ไม่สามารถบันทึกได้');
        } finally {
            setSaving(false);
        }
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const advisorName = user.first_name_th ? `${user.prefix_th || ''} ${user.first_name_th} ${user.last_name_th || ''}` : 'อาจารย์';

    return (
        <div className="flex items-center justify-center">
            <div className="bg-white rounded-[3rem] p-6 md:p-12 w-full max-w-5xl shadow-2xl border border-gray-100 relative flex flex-col">
                <h1 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-8">ลงวันนิเทศ</h1>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-gray-900 font-bold block">ชื่อนักศึกษา</label>
                        <CustomDropdown
                            value={selectedStudent}
                            onChange={handleStudentChange}
                            options={students.map(s => s.full_name)}
                            placeholder="เลือกนักศึกษา"
                            variant="underline"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-gray-900 font-bold block">วันที่นิเทศ</label>
                            <div className="relative">
                                <DatePicker
                                    selected={supervisionDate}
                                    onChange={(date) => setSupervisionDate(date)}
                                    placeholderText="วัน / เดือน / ปี"
                                    className="w-full bg-transparent border-b border-gray-300 py-2 text-gray-700 focus:outline-none focus:border-[#4472c4] transition-colors rounded-none placeholder-gray-400"
                                    wrapperClassName="w-full"
                                />
                                <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-gray-900 font-bold block">เวลานิเทศ</label>
                            <div className="relative">
                                <DatePicker
                                    selected={supervisionTime}
                                    onChange={(date) => setSupervisionTime(date)}
                                    showTimeSelect showTimeSelectOnly timeIntervals={15} timeCaption="Time" dateFormat="h:mm aa"
                                    placeholderText="เช่น 9:30"
                                    className="w-full bg-transparent border-b border-gray-300 py-2 text-gray-700 focus:outline-none focus:border-[#4472c4] transition-colors rounded-none placeholder-gray-400"
                                    wrapperClassName="w-full"
                                />
                                <Clock className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-gray-900 font-bold block">อาจารย์นิเทศ</label>
                            <input type="text" value={advisorName} disabled className="w-full bg-transparent border-b border-gray-300 py-2 text-gray-500 focus:outline-none rounded-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-gray-900 font-bold block">สถานประกอบการ</label>
                            <input type="text" value={workplace} onChange={(e) => setWorkplace(e.target.value)} placeholder="ระบุสถานประกอบการ" className="w-full bg-transparent border-b border-gray-300 py-2 text-gray-700 focus:outline-none focus:border-[#4472c4] transition-colors rounded-none placeholder-gray-400" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-gray-900 font-bold block">หมายเหตุเพิ่มเติม</label>
                        <AutoResizeTextarea value={note} onChange={(e) => setNote(e.target.value)} rows={1} placeholder="เช่น นัดช่วงเช้า" variant="underline" />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-10">
                    <Link to="/teacher/history" className="text-[#4472c4] font-bold hover:underline">ดูประวัติ / แก้ไข การลงวันนิเทศน์</Link>
                    <button onClick={handleSave} disabled={saving} className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#5cc945] text-white font-bold hover:bg-[#4db83a] shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                        {saving ? 'กำลังบันทึก...' : 'บันทึกวันนิเทศ'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleSupervisionPage;
