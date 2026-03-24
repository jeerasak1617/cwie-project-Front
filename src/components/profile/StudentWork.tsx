import { useState } from 'react';

const StudentWork = () => {
    const [formData, setFormData] = useState({
        workplaceName: '',
        phone: '',
        position: '',
        otherContact: '',
        experience: '',
        characteristics: '',
        skills: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="h-full flex flex-col">
            <div className="mb-1">
                <h1 className="text-3xl font-bold text-gray-900 inline-block border-b border-gray-200 pb-2">ข้อมูลการทำงาน</h1>
            </div>
            <p className="text-base text-gray-400 mb-8 font-medium">ระบุสถานที่ทำงาน ตำแหน่ง ประสบการณ์ และความสามารถพิเศษของนักศึกษา</p>

            <form className="space-y-6 flex-1">
                {/* Row 1: Workplace, Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-base font-bold text-gray-900 mb-2">สถานที่ทำงาน</label>
                        <input
                            type="text"
                            name="workplaceName"
                            value={formData.workplaceName}
                            onChange={handleChange}
                            placeholder="เช่น บริษัท เอ บี ซี จำกัด"
                            className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-base"
                        />
                    </div>
                    <div>
                        <label className="block text-base font-bold text-gray-900 mb-2">โทรศัพท์</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="เช่น 02-xxx-xxxx หรือ 08x-xxx-xxxx"
                            className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-base"
                        />
                    </div>
                </div>

                {/* Row 2: Position, Other Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-base font-bold text-gray-900 mb-2">ตำแหน่ง</label>
                        <input
                            type="text"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            placeholder="เช่น เจ้าหน้าที่ฝึกงาน / พนักงานขาย"
                            className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-base"
                        />
                    </div>
                    <div>
                        <label className="block text-base font-bold text-gray-900 mb-2">ช่องทางการติดต่ออื่น (ถ้ามี)</label>
                        <input
                            type="text"
                            name="otherContact"
                            value={formData.otherContact}
                            onChange={handleChange}
                            placeholder="เช่น Line ID หรือ อีเมลที่ทำงาน"
                            className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-base"
                        />
                    </div>
                </div>

                {/* Row 3: Experience, Characteristics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-base font-bold text-gray-900 mb-2">ประสบการณ์ในการทำงาน</label>
                        <textarea
                            name="experience"
                            rows={5}
                            value={formData.experience}
                            onChange={handleChange}
                            placeholder="เช่น เคยฝึกงานฝ่ายไอที ดูแลระบบคอมพิวเตอร์ประจำแผนก"
                            className="w-full px-5 py-4 rounded-2xl border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none font-medium text-base h-32"
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-base font-bold text-gray-900 mb-2">ลักษณะนิสัยของนักศึกษา</label>
                        <textarea
                            name="characteristics"
                            rows={5}
                            value={formData.characteristics}
                            onChange={handleChange}
                            placeholder="เช่น มีความรับผิดชอบสูง"
                            className="w-full px-5 py-4 rounded-2xl border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none font-medium text-base h-32"
                        ></textarea>
                    </div>
                </div>

                {/* Row 4: Skills */}
                <div>
                    <label className="block text-base font-bold text-gray-900 mb-2">ความรู้ความสามารถของนักศึกษา</label>
                    <textarea
                        name="skills"
                        rows={4}
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="เช่น ในโปรแกรม Excel / Power BI"
                        className="w-full px-5 py-4 rounded-2xl border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none font-medium text-base h-32"
                    ></textarea>
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

export default StudentWork;
