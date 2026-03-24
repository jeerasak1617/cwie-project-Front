export interface StudentProfile {
    id: string;
    studentId: string;
    name: string;
    prefix: string;
    faculty: string;
    major: string;
    section: string;
    company: string;
    advisor: string;
    supervisor: string;
    position: string;
    address: string;
    jobDescription: string;
}

export const students: StudentProfile[] = [
    {
        id: '1',
        studentId: '6611502025',
        name: 'จีรศักดิ์',
        prefix: 'นาย',
        faculty: 'คณะวิทยาศาสตร์',
        major: 'สาขาวิชาวิทยาการคอมพิวเตอร์และปัญญาประดิษฐ์',
        section: 'ภาคในเวลาราชการ',
        company: 'บริษัท เอ บี ซี จำกัด',
        advisor: 'ดร. สมชาย ใจดี',
        supervisor: 'นาย สมศักดิ์ หัวหน้างาน',
        position: 'Backend Developer',
        address: '123 ถ.สุขุมวิท กรุงเทพฯ',
        jobDescription: 'พัฒนา API ด้วย Node.js และ Express\nดูแลระบบฐานข้อมูล PostgreSQL'
    },
    {
        id: '2',
        studentId: '6611502026',
        name: 'วิวัฒน์ชัย',
        prefix: 'นาย',
        faculty: 'คณะวิทยาศาสตร์',
        major: 'สาขาวิชาวิทยาการคอมพิวเตอร์และปัญญาประดิษฐ์',
        section: 'ภาคในเวลาราชการ',
        company: 'บริษัท เทคโซลูชั่น จำกัด',
        advisor: 'ดร. สมชาย ใจดี',
        supervisor: 'นาย วิชัย บังคับบัญชา',
        position: 'Frontend Developer',
        address: '456 ถ.สีลม กรุงเทพฯ',
        jobDescription: 'พัฒนาเว็บแอปพลิเคชันด้วย React\nออกแบบ UI/UX เบื้องต้น'
    },
    {
        id: '3',
        studentId: '6611502025',
        name: 'อชิรญา รักษายศ',
        prefix: 'นางสาว',
        faculty: 'คณะวิทยาศาสตร์',
        major: 'สาขาวิชาวิทยาการคอมพิวเตอร์และปัญญาประดิษฐ์',
        section: 'ภาคในเวลาราชการ',
        company: 'บริษัท XYZ จำกัด',
        advisor: 'ดร. สมชาย ใจดี',
        supervisor: 'นางสาว สมหญิง ผู้จัดการ',
        position: 'Data Analyst',
        address: '789 ถ.พระราม 9 กรุงเทพฯ',
        jobDescription: 'วิเคราะห์ข้อมูลการใช้งานระบบ\nทำ Dashboard ด้วย Power BI'
    }
];

export const getStudentById = (id: string | undefined): StudentProfile | undefined => {
    return students.find(s => s.id === id);
};
