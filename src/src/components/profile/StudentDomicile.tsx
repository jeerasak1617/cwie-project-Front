import { useState } from 'react';

const StudentDomicile = () => {
    const [formData, setFormData] = useState({
        houseNo: '',
        road: '',
        subdistrict: '',
        district: '',
        province: '',
        postalCode: '',
        phone: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="h-full flex flex-col">
            <div className="mb-1">
                <h1 className="text-3xl font-bold text-gray-900 inline-block border-b border-gray-200 pb-2">ภูมิลำเนานักศึกษา</h1>
            </div>
            <p className="text-base text-gray-400 mb-8 font-medium">ที่อยู่ตามบัตรประชาชน ใช้สำหรับเอกสารราชการและการติดต่อฉุกเฉิน</p>

            <form className="space-y-6 flex-1">
                {/* Row 1: House No, Road */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-base font-bold text-gray-900 mb-2">บ้านเลขที่</label>
                        <input
                            type="text"
                            name="houseNo"
                            value={formData.houseNo}
                            onChange={handleChange}
                            placeholder="บ้านเลขที่ / หมู่บ้าน / อาคาร"
                            className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-base"
                        />
                    </div>
                    <div>
                        <label className="block text-base font-bold text-gray-900 mb-2">ถนน / ซอย</label>
                        <input
                            type="text"
                            name="road"
                            value={formData.road}
                            onChange={handleChange}
                            placeholder="ถนน / ซอย"
                            className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-base"
                        />
                    </div>
                </div>

                {/* Row 2: Subdistrict, District */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-base font-bold text-gray-900 mb-2">ตำบล / แขวง</label>
                        <input
                            type="text"
                            name="subdistrict"
                            value={formData.subdistrict}
                            onChange={handleChange}
                            placeholder="ตำบล / แขวง"
                            className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-base"
                        />
                    </div>
                    <div>
                        <label className="block text-base font-bold text-gray-900 mb-2">อำเภอ / เขต</label>
                        <input
                            type="text"
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                            placeholder="อำเภอ / เขต"
                            className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-base"
                        />
                    </div>
                </div>

                {/* Row 3: Province, Postal Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-base font-bold text-gray-900 mb-2">จังหวัด</label>
                        <input
                            type="text"
                            name="province"
                            value={formData.province}
                            onChange={handleChange}
                            placeholder="จังหวัด"
                            className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-base"
                        />
                    </div>
                    <div>
                        <label className="block text-base font-bold text-gray-900 mb-2">รหัสไปรษณีย์</label>
                        <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            placeholder="เช่น 10305"
                            className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-base"
                        />
                    </div>
                </div>

                {/* Row 4: Phone and Button */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div>
                        <label className="block text-base font-bold text-gray-900 mb-2">เบอร์โทรศัพท์ที่ติดต่อได้</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="เช่น 08x-xxx-xxxx"
                            className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-base"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="px-10 py-3 bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                        >
                            บันทึก
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default StudentDomicile;
