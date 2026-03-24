import { useState } from 'react';

const StudentGuardian = () => {
    const [formData, setFormData] = useState({
        guardianFirstName: '',
        guardianLastName: '',
        guardianOccupation: '',
        guardianPhone: '',
        fatherFirstName: '',
        fatherLastName: '',
        fatherOccupation: '',
        fatherPhone: '',
        motherFirstName: '',
        motherLastName: '',
        motherOccupation: '',
        motherPhone: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="h-full flex flex-col">
            <div className="mb-1">
                <h1 className="text-3xl font-bold text-gray-900 inline-block border-b border-gray-200 pb-2">ข้อมูลผู้ปกครอง</h1>
            </div>
            <p className="text-base text-gray-400 mb-8 font-medium">ระบุข้อมูลผู้ปกครองสำหรับติดต่อกรณีฉุกเฉิน และใช้ประกอบการจัดทำเอกสารฝึกประสบการณ์</p>

            <form className="space-y-6 flex-1">
                {/* Guardian Section */}
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-base font-bold text-gray-900 mb-2">ชื่อจริงผู้ปกครอง</label>
                            <input
                                type="text"
                                name="guardianFirstName"
                                value={formData.guardianFirstName}
                                onChange={handleChange}
                                placeholder="ชื่อผู้ปกครอง"
                                className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-base"
                            />
                        </div>
                        <div>
                            <label className="block text-base font-bold text-gray-900 mb-2">นามสกุล</label>
                            <input
                                type="text"
                                name="guardianLastName"
                                value={formData.guardianLastName}
                                onChange={handleChange}
                                placeholder="นามสกุล"
                                className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-base"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-base font-bold text-gray-900 mb-2">อาชีพ</label>
                            <input
                                type="text"
                                name="guardianOccupation"
                                value={formData.guardianOccupation}
                                onChange={handleChange}
                                placeholder="เช่น ข้าราชการ หรือ พนักงานบริษัท"
                                className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-base"
                            />
                        </div>
                        <div>
                            <label className="block text-base font-bold text-gray-900 mb-2">โทรศัพท์</label>
                            <input
                                type="text"
                                name="guardianPhone"
                                value={formData.guardianPhone}
                                onChange={handleChange}
                                placeholder="เช่น 08x-xxx-xxxx"
                                className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-base"
                            />
                        </div>
                    </div>
                </div>

                {/* Father Section */}
                <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-base font-bold text-gray-900 mb-2">ชื่อจริงบิดา</label>
                            <input
                                type="text"
                                name="fatherFirstName"
                                value={formData.fatherFirstName}
                                onChange={handleChange}
                                placeholder="ชื่อบิดา"
                                className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-base"
                            />
                        </div>
                        <div>
                            <label className="block text-base font-bold text-gray-900 mb-2">นามสกุล</label>
                            <input
                                type="text"
                                name="fatherLastName"
                                value={formData.fatherLastName}
                                onChange={handleChange}
                                placeholder="นามสกุล"
                                className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-base"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-base font-bold text-gray-900 mb-2">อาชีพ</label>
                            <input
                                type="text"
                                name="fatherOccupation"
                                value={formData.fatherOccupation}
                                onChange={handleChange}
                                placeholder="เช่น ข้าราชการ หรือ พนักงานบริษัท"
                                className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-base"
                            />
                        </div>
                        <div>
                            <label className="block text-base font-bold text-gray-900 mb-2">โทรศัพท์</label>
                            <input
                                type="text"
                                name="fatherPhone"
                                value={formData.fatherPhone}
                                onChange={handleChange}
                                placeholder="เช่น 08x-xxx-xxxx"
                                className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-base"
                            />
                        </div>
                    </div>
                </div>

                {/* Mother Section */}
                <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-base font-bold text-gray-900 mb-2">ชื่อจริงมารดา</label>
                            <input
                                type="text"
                                name="motherFirstName"
                                value={formData.motherFirstName}
                                onChange={handleChange}
                                placeholder="ชื่อมารดา"
                                className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-base"
                            />
                        </div>
                        <div>
                            <label className="block text-base font-bold text-gray-900 mb-2">นามสกุล</label>
                            <input
                                type="text"
                                name="motherLastName"
                                value={formData.motherLastName}
                                onChange={handleChange}
                                placeholder="นามสกุล"
                                className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-base"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-base font-bold text-gray-900 mb-2">อาชีพ</label>
                            <input
                                type="text"
                                name="motherOccupation"
                                value={formData.motherOccupation}
                                onChange={handleChange}
                                placeholder="เช่น ข้าราชการ หรือ พนักงานบริษัท"
                                className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-base"
                            />
                        </div>
                        <div>
                            <label className="block text-base font-bold text-gray-900 mb-2">โทรศัพท์</label>
                            <input
                                type="text"
                                name="motherPhone"
                                value={formData.motherPhone}
                                onChange={handleChange}
                                placeholder="เช่น 08x-xxx-xxxx"
                                className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-base"
                            />
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-end pt-8 mt-auto">
                    <button
                        type="button"
                        className="px-10 py-3 bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                    >
                        บันทึก
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StudentGuardian;
