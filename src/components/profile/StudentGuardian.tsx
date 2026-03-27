import { useState, useEffect } from 'react';
import api from '../../api';

const inputClass = "w-full px-5 py-3 rounded-full border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-base";

const StudentGuardian = () => {
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [formData, setFormData] = useState({
        guardianFirstName: '', guardianLastName: '', guardianOccupation: '', guardianPhone: '',
        fatherFirstName: '', fatherLastName: '', fatherOccupation: '', fatherPhone: '',
        motherFirstName: '', motherLastName: '', motherOccupation: '', motherPhone: ''
    });

    // โหลดข้อมูลเดิมจาก API
    useEffect(() => {
        api.get('/student/profile/family').then(res => {
            const families = res.data.families || [];
            families.forEach((f: any) => {
                if (f.relation_type === 'guardian') {
                    setFormData(prev => ({ ...prev, guardianFirstName: f.first_name, guardianLastName: f.last_name, guardianOccupation: f.occupation, guardianPhone: f.phone }));
                } else if (f.relation_type === 'father') {
                    setFormData(prev => ({ ...prev, fatherFirstName: f.first_name, fatherLastName: f.last_name, fatherOccupation: f.occupation, fatherPhone: f.phone }));
                } else if (f.relation_type === 'mother') {
                    setFormData(prev => ({ ...prev, motherFirstName: f.first_name, motherLastName: f.last_name, motherOccupation: f.occupation, motherPhone: f.phone }));
                }
            });
        }).catch(() => {});
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSave = async () => {
        setSaving(true); setSaveMsg('');
        try {
            await api.post('/student/profile/save-family', {
                families: [
                    { relation_type: 'guardian', first_name: formData.guardianFirstName, last_name: formData.guardianLastName, occupation: formData.guardianOccupation, phone: formData.guardianPhone },
                    { relation_type: 'father', first_name: formData.fatherFirstName, last_name: formData.fatherLastName, occupation: formData.fatherOccupation, phone: formData.fatherPhone },
                    { relation_type: 'mother', first_name: formData.motherFirstName, last_name: formData.motherLastName, occupation: formData.motherOccupation, phone: formData.motherPhone },
                ]
            });
            setSaveMsg('บันทึกข้อมูลผู้ปกครองเรียบร้อย');
            setTimeout(() => setSaveMsg(''), 3000);
        } catch { setSaveMsg('เกิดข้อผิดพลาดในการบันทึก'); }
        finally { setSaving(false); }
    };

    const hasData = Object.values(formData).some(v => v.trim() !== '');

    return (
        <div className="h-full flex flex-col">
            <div className="mb-1"><h1 className="text-3xl font-bold text-gray-900 inline-block border-b border-gray-200 pb-2">ข้อมูลผู้ปกครอง</h1></div>
            <p className="text-base text-gray-400 mb-8 font-medium">ระบุข้อมูลผู้ปกครองสำหรับติดต่อกรณีฉุกเฉิน</p>
            {saveMsg && <div className={`mb-4 p-3 rounded-lg text-sm text-center font-medium ${saveMsg.includes('เรียบร้อย') ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>{saveMsg}</div>}

            <form className="space-y-6 flex-1">
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-[#032B68]">ผู้ปกครอง</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label className="block text-base font-bold text-gray-900 mb-2">ชื่อจริงผู้ปกครอง</label><input type="text" name="guardianFirstName" value={formData.guardianFirstName} onChange={handleChange} placeholder="ชื่อผู้ปกครอง" className={inputClass} /></div>
                        <div><label className="block text-base font-bold text-gray-900 mb-2">นามสกุล</label><input type="text" name="guardianLastName" value={formData.guardianLastName} onChange={handleChange} placeholder="นามสกุล" className={inputClass} /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label className="block text-base font-bold text-gray-900 mb-2">อาชีพ</label><input type="text" name="guardianOccupation" value={formData.guardianOccupation} onChange={handleChange} placeholder="เช่น ข้าราชการ" className={inputClass} /></div>
                        <div><label className="block text-base font-bold text-gray-900 mb-2">โทรศัพท์</label><input type="text" name="guardianPhone" value={formData.guardianPhone} onChange={handleChange} placeholder="เช่น 08x-xxx-xxxx" className={inputClass} /></div>
                    </div>
                </div>
                <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h2 className="text-lg font-bold text-[#032B68]">บิดา</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label className="block text-base font-bold text-gray-900 mb-2">ชื่อจริงบิดา</label><input type="text" name="fatherFirstName" value={formData.fatherFirstName} onChange={handleChange} placeholder="ชื่อบิดา" className={inputClass} /></div>
                        <div><label className="block text-base font-bold text-gray-900 mb-2">นามสกุล</label><input type="text" name="fatherLastName" value={formData.fatherLastName} onChange={handleChange} placeholder="นามสกุล" className={inputClass} /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label className="block text-base font-bold text-gray-900 mb-2">อาชีพ</label><input type="text" name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} placeholder="เช่น ข้าราชการ" className={inputClass} /></div>
                        <div><label className="block text-base font-bold text-gray-900 mb-2">โทรศัพท์</label><input type="text" name="fatherPhone" value={formData.fatherPhone} onChange={handleChange} placeholder="เช่น 08x-xxx-xxxx" className={inputClass} /></div>
                    </div>
                </div>
                <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h2 className="text-lg font-bold text-[#032B68]">มารดา</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label className="block text-base font-bold text-gray-900 mb-2">ชื่อจริงมารดา</label><input type="text" name="motherFirstName" value={formData.motherFirstName} onChange={handleChange} placeholder="ชื่อมารดา" className={inputClass} /></div>
                        <div><label className="block text-base font-bold text-gray-900 mb-2">นามสกุล</label><input type="text" name="motherLastName" value={formData.motherLastName} onChange={handleChange} placeholder="นามสกุล" className={inputClass} /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label className="block text-base font-bold text-gray-900 mb-2">อาชีพ</label><input type="text" name="motherOccupation" value={formData.motherOccupation} onChange={handleChange} placeholder="เช่น ข้าราชการ" className={inputClass} /></div>
                        <div><label className="block text-base font-bold text-gray-900 mb-2">โทรศัพท์</label><input type="text" name="motherPhone" value={formData.motherPhone} onChange={handleChange} placeholder="เช่น 08x-xxx-xxxx" className={inputClass} /></div>
                    </div>
                </div>

                {hasData && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                        <p className="text-sm font-bold text-blue-900 mb-2">ข้อมูลที่กรอก:</p>
                        <div className="text-sm text-blue-800 space-y-1">
                            {formData.guardianFirstName && <p>ผู้ปกครอง: {formData.guardianFirstName} {formData.guardianLastName} {formData.guardianOccupation && `| ${formData.guardianOccupation}`} {formData.guardianPhone && `| ${formData.guardianPhone}`}</p>}
                            {formData.fatherFirstName && <p>บิดา: {formData.fatherFirstName} {formData.fatherLastName} {formData.fatherOccupation && `| ${formData.fatherOccupation}`} {formData.fatherPhone && `| ${formData.fatherPhone}`}</p>}
                            {formData.motherFirstName && <p>มารดา: {formData.motherFirstName} {formData.motherLastName} {formData.motherOccupation && `| ${formData.motherOccupation}`} {formData.motherPhone && `| ${formData.motherPhone}`}</p>}
                        </div>
                    </div>
                )}

                <div className="flex justify-end pt-8 mt-auto">
                    <button type="button" onClick={handleSave} disabled={saving} className="px-10 py-3 bg-[#5cb85c] hover:bg-[#4cae4c] disabled:bg-gray-400 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all">{saving ? 'กำลังบันทึก...' : 'บันทึก'}</button>
                </div>
            </form>
        </div>
    );
};
export default StudentGuardian;
