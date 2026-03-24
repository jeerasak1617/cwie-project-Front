const StepCard = ({ number, title, description }: { number: number, title: string, description: string }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-[2rem] p-6 md:p-8 flex items-start md:items-center gap-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#325eb5] text-white flex items-center justify-center font-bold text-xl shadow-md">
                {number}
            </div>
            <div className="flex flex-col md:flex-row md:items-center w-full gap-2">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
                    <p className="text-base text-gray-500 font-light">{description}</p>
                </div>
            </div>
        </div>
    );
};

const SystemSteps = () => {
    const steps = [
        {
            title: "เข้าสู่ระบบ",
            description: "เข้าสู่ระบบด้วยบัญชีนักศึกษา"
        },
        {
            title: "เลือกสถานประกอบการและแผนการฝึก",
            description: "เลือกตำแหน่งหรือสถานที่ฝึกงานที่สนใจ"
        },
        {
            title: "ลงเวลาและบันทึกประจำวัน",
            description: "บันทึกเวลา เข้า-ออก และสรุปสิ่งที่ได้ทำในแต่ละวัน เพื่อง่ายต่อการติดตามและประเมิน"
        },
        {
            title: "ส่งรายงานและรับการประเมินผล",
            description: "จัดทำรายงานสรุป ส่งเอกสารผ่านระบบ และตรวจสอบผลการประเมินจากอาจารย์และพี่เลี้ยง"
        }
    ];

    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-[85%] mx-auto px-4 md:px-8">
                <div className="bg-white rounded-[3rem] p-8 md:p-14 shadow-sm">
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">ขั้นตอนการใช้งานระบบ</h2>
                        <p className="text-gray-500 text-lg font-light">ออกแบบให้ใช้งานง่าย แบ่งเป็นขั้นตอนชัดเจนทั้งสำหรับนักศึกษา อาจารย์นิเทศ และสถานประกอบการ</p>
                    </div>

                    <div className="space-y-6">
                        {steps.map((step, index) => (
                            <StepCard
                                key={index}
                                number={index + 1}
                                title={step.title}
                                description={step.description}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SystemSteps;
