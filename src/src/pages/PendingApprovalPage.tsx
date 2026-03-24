import { useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, ShieldCheck } from 'lucide-react';

const PendingApprovalPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex flex-col items-center justify-center px-4 py-8">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 w-full max-w-lg text-center">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl flex items-center justify-center">
                            <Clock size={40} className="text-amber-500" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                            <ShieldCheck size={16} className="text-white" />
                        </div>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
                    ลงทะเบียนสำเร็จ!
                </h1>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                    ข้อมูลของคุณถูกส่งเรียบร้อยแล้ว<br />
                    กรุณารอ <span className="text-[#4472c4] font-semibold">Admin</span> ตรวจสอบและอนุมัติก่อนเข้าใช้งานระบบ
                </p>

                {/* Status indicator */}
                <div className="bg-amber-50/80 border border-amber-200/60 rounded-2xl p-4 mb-8">
                    <div className="flex items-center justify-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                        </span>
                        <span className="text-amber-700 font-semibold text-sm">รอการตรวจสอบ</span>
                    </div>
                </div>

                {/* Back to Login Button */}
                <button
                    onClick={() => navigate('/login')}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#4472c4] to-[#032B68] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#032B68]/20 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 text-base"
                >
                    <ArrowLeft size={18} />
                    กลับไปหน้าเข้าสู่ระบบ
                </button>
            </div>
        </div>
    );
};

export default PendingApprovalPage;
