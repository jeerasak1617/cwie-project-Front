import { Phone, Mail, Facebook, Globe } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-100">
            {/* Blue Accent Bar - Increased height */}
            <div className="w-full h-4 bg-[#4472c4]"></div>

            <div className="w-full px-4 md:px-12 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Column 1: University Info */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-[#324b82] border-l-4 border-[#324b82] pl-3">
                        ระบบฝึกประสบการณ์วิชาชีพและสหกิจศึกษา
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        มหาวิทยาลัยราชภัฏจันทรเกษม<br />
                        39/1 ถ.รัชดาภิเษก แขวงจันทรเกษม <br />
                        เขตจตุจักร กรุงเทพฯ 10900
                    </p>
                </div>

                {/* Column 2: Contact Info */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-[#324b82] border-l-4 border-[#324b82] pl-3">
                        ข้อมูลการติดต่อ
                    </h3>
                    <div className="text-sm text-gray-600 space-y-2">
                        <p className="flex items-center gap-2">
                            <Phone size={16} className="text-[#324b82]" />
                            <span>0 2942 5800, 0 2942 6800</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="font-semibold text-[#324b82] w-4">Fx</span>
                            <span>0 2541 7113</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <Mail size={16} className="text-[#324b82]" />
                            <span>saraban@chandra.ac.th</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="font-bold text-[#06c755]">LINE</span>
                            <span>@cruhome</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <Facebook size={16} className="text-[#1877f2]" />
                            <span>มหาวิทยาลัยราชภัฏจันทรเกษม CRU</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <Globe size={16} className="text-[#324b82]" />
                            <span>มหาวิทยาลัยราชภัฏจันทรเกษม</span>
                        </p>
                    </div>
                </div>

                {/* Column 3: Map */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-[#324b82] border-l-4 border-[#324b82] pl-3">
                        แผนที่
                    </h3>
                    <div className="w-full h-48 bg-gray-300 rounded-lg overflow-hidden shadow-sm relative group">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3874.195133642277!2d100.5721113148316!3d13.818815990299696!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29d0046e7e3bf%3A0x629555c1c828972e!2z4Lih4Lir4Liy4Lin4Li04LiX4Lii4Liy4Lil4Lix4Lii4Lij4Liy4LiK4Lig4Lix4LiP4LiI4Lix4LiZ4LiX4Lij4LmA4LiB4Lip4Lih!5e0!3m2!1sth!2sth!4v1677648347285!5m2!1sth!2sth"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Chandrakasem Rajabhat University Map"
                        ></iframe>
                        {/* Overlay link for whole map click if preferred, but iframe interaction is usually better.
                            Keeping the iframe interactive but adding a clear title link above.
                        */}
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="py-4 bg-[#f8f9fa] border-t border-gray-200 text-center text-sm text-gray-500">
                @ 2023 ระบบฝึกงานนักศึกษา
            </div>
        </footer>
    );
};

export default Footer;
