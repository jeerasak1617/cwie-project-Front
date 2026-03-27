import { useState, useEffect } from 'react';
import api from '../../api';

interface Province { id: number; code: string; name_th: string; }
interface District { id: number; code: string; name_th: string; }
interface Subdistrict { id: number; code: string; name_th: string; postal_code: string | null; }

const selectClass = "w-full px-5 py-3 rounded-full border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-base appearance-none cursor-pointer bg-white";
const inputClass = "w-full px-5 py-3 rounded-full border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-base";
const disabledClass = "w-full px-5 py-3 rounded-full border border-gray-200 text-gray-400 bg-gray-50 font-medium text-base cursor-not-allowed";

const StudentDomicile = () => {
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [subdistricts, setSubdistricts] = useState<Subdistrict[]>([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedSubdistrict, setSelectedSubdistrict] = useState('');
    const [formData, setFormData] = useState({ houseNo: '', road: '', postalCode: '', phone: '' });
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [loaded, setLoaded] = useState(false);

    // โหลดจังหวัด
    useEffect(() => { api.get('/master/provinces').then(res => setProvinces(res.data || [])).catch(() => {}); }, []);

    // โหลดข้อมูลที่อยู่เดิม
    useEffect(() => {
        const load = async () => {
            try {
                const profileRes = await api.get('/student/profile');
                if (profileRes.data.phone) setFormData(prev => ({ ...prev, phone: profileRes.data.phone }));

                const addrRes = await api.get('/student/profile/address');
                const addr = addrRes.data.address;
                if (addr) {
                    setFormData(prev => ({ ...prev, houseNo: addr.houseNo || '', road: addr.road || '', postalCode: addr.postalCode || '' }));
                    if (addr.province_id) setSelectedProvince(String(addr.province_id));
                    // district/subdistrict จะโหลดจาก useEffect ด้านล่าง
                    setTimeout(() => { if (addr.district_id) setSelectedDistrict(String(addr.district_id)); }, 600);
                    setTimeout(() => { if (addr.subdistrict_id) setSelectedSubdistrict(String(addr.subdistrict_id)); }, 1200);
                }
            } catch {} finally { setLoaded(true); }
        };
        load();
    }, []);

    // โหลดอำเภอตามจังหวัด
    useEffect(() => {
        if (!selectedProvince) { setDistricts([]); return; }
        api.get(`/master/districts/${selectedProvince}`).then(res => setDistricts(res.data || [])).catch(() => setDistricts([]));
        if (loaded) { setSelectedDistrict(''); setSubdistricts([]); setSelectedSubdistrict(''); setFormData(prev => ({ ...prev, postalCode: '' })); }
    }, [selectedProvince]);

    // โหลดตำบลตามอำเภอ
    useEffect(() => {
        if (!selectedDistrict) { setSubdistricts([]); return; }
        api.get(`/master/subdistricts/${selectedDistrict}`).then(res => setSubdistricts(res.data || [])).catch(() => setSubdistricts([]));
        if (loaded) { setSelectedSubdistrict(''); setFormData(prev => ({ ...prev, postalCode: '' })); }
    }, [selectedDistrict]);

    // เลือกตำบล → ใส่รหัสไปรษณีย์อัตโนมัติ
    useEffect(() => {
        if (selectedSubdistrict) {
            const sub = subdistricts.find(s => String(s.id) === selectedSubdistrict);
            if (sub?.postal_code) setFormData(prev => ({ ...prev, postalCode: sub.postal_code || '' }));
        }
    }, [selectedSubdistrict, subdistricts]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSave = async () => {
        setSaving(true); setSaveMsg('');
        try {
            await api.post('/student/profile/save-address', {
                houseNo: formData.houseNo, road: formData.road, postalCode: formData.postalCode,
                province_id: selectedProvince, district_id: selectedDistrict, subdistrict_id: selectedSubdistrict,
                phone: formData.phone,
            });
            setSaveMsg('บันทึกข้อมูลเรียบร้อย');
            setTimeout(() => setSaveMsg(''), 3000);
        } catch { setSaveMsg('เกิดข้อผิดพลาดในการบันทึก'); }
        finally { setSaving(false); }
    };

    const provinceName = provinces.find(p => String(p.id) === selectedProvince)?.name_th || '';
    const districtName = districts.find(d => String(d.id) === selectedDistrict)?.name_th || '';
    const subdistrictName = subdistricts.find(s => String(s.id) === selectedSubdistrict)?.name_th || '';

    return (
        <div className="h-full flex flex-col">
            <div className="mb-1"><h1 className="text-3xl font-bold text-gray-900 inline-block border-b border-gray-200 pb-2">ภูมิลำเนานักศึกษา</h1></div>
            <p className="text-base text-gray-400 mb-8 font-medium">ที่อยู่ตามบัตรประชาชน ใช้สำหรับเอกสารราชการและการติดต่อฉุกเฉิน</p>

            {saveMsg && <div className={`mb-4 p-3 rounded-lg text-sm text-center font-medium ${saveMsg.includes('เรียบร้อย') ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>{saveMsg}</div>}

            <form className="space-y-6 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-base font-bold text-gray-900 mb-2">บ้านเลขที่</label><input type="text" name="houseNo" value={formData.houseNo} onChange={handleChange} placeholder="บ้านเลขที่ / หมู่บ้าน / อาคาร" className={inputClass} /></div>
                    <div><label className="block text-base font-bold text-gray-900 mb-2">ถนน / ซอย</label><input type="text" name="road" value={formData.road} onChange={handleChange} placeholder="ถนน / ซอย" className={inputClass} /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-base font-bold text-gray-900 mb-2">จังหวัด</label>
                        <select value={selectedProvince} onChange={e => setSelectedProvince(e.target.value)} className={selectClass}><option value="">-- เลือกจังหวัด --</option>{provinces.map(p => <option key={p.id} value={p.id}>{p.name_th}</option>)}</select></div>
                    <div><label className="block text-base font-bold text-gray-900 mb-2">อำเภอ / เขต</label>
                        {selectedProvince ? <select value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)} className={selectClass}><option value="">-- เลือกอำเภอ --</option>{districts.map(d => <option key={d.id} value={d.id}>{d.name_th}</option>)}</select> : <div className={disabledClass}>เลือกจังหวัดก่อน</div>}</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-base font-bold text-gray-900 mb-2">ตำบล / แขวง</label>
                        {selectedDistrict ? <select value={selectedSubdistrict} onChange={e => setSelectedSubdistrict(e.target.value)} className={selectClass}><option value="">-- เลือกตำบล --</option>{subdistricts.map(s => <option key={s.id} value={s.id}>{s.name_th}</option>)}</select> : <div className={disabledClass}>เลือกอำเภอก่อน</div>}</div>
                    <div><label className="block text-base font-bold text-gray-900 mb-2">รหัสไปรษณีย์</label><input type="text" value={formData.postalCode} readOnly placeholder="เลือกตำบลก่อน" className={`${inputClass} bg-gray-50`} /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div><label className="block text-base font-bold text-gray-900 mb-2">เบอร์โทรศัพท์ที่ติดต่อได้</label><input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="เช่น 08x-xxx-xxxx" className={inputClass} /></div>
                    <div className="flex justify-end"><button type="button" onClick={handleSave} disabled={saving} className="px-10 py-3 bg-[#5cb85c] hover:bg-[#4cae4c] disabled:bg-gray-400 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all">{saving ? 'กำลังบันทึก...' : 'บันทึก'}</button></div>
                </div>
                {(formData.houseNo || formData.road || formData.phone || provinceName) && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                        <p className="text-sm font-bold text-blue-900 mb-1">ข้อมูลที่กรอก:</p>
                        <div className="text-sm text-blue-800 space-y-1">
                            {(formData.houseNo || formData.road) && <p>ที่อยู่: {formData.houseNo} {formData.road}</p>}
                            {provinceName && <p>{subdistrictName && `ต.${subdistrictName} `}{districtName && `อ.${districtName} `}จ.{provinceName} {formData.postalCode}</p>}
                            {formData.phone && <p>โทร: {formData.phone}</p>}
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};
export default StudentDomicile;
