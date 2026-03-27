// 1. Mock Data สำหรับข้อมูลแผนก (กราฟโดนัท)
export const deptDistribution = [
  { name: "Production & Operation", value: 150 },
  { name: "IT & Development", value: 45 },
  { name: "Sales & Marketing", value: 65 },
  { name: "Human Resources", value: 20 },
  { name: "Finance & Accounting", value: 25 },
  { name: "Admin & Support", value: 37 },
];

// 2. Mock Data สำหรับภาพรวมการเข้างาน (กราฟแท่ง)
export const attendanceByStatus = [
  { name: "มาปกติ (Present)", value: 280, fill: "#10b981" }, // สีเขียว
  { name: "สาย (Late)", value: 35, fill: "#f59e0b" }, // สีเหลือง
  { name: "ขาด/ลา (Absent)", value: 12, fill: "#ef4444" }, // สีแดง
  { name: "WFH", value: 15, fill: "#3b82f6" }, // สีน้ำเงิน
];

// 3. Mock Data สำหรับการ์ดตัวเลข 6 กล่องด้านบน
export const statCards = [
  {
    label: "จำนวนพนักงานทั้งหมด (คน)",
    value: 342,
    icon: "Users",
    color: "text-blue-600 bg-blue-100",
  },
  {
    label: "พนักงานที่มาทำงานวันนี้ (คน)",
    value: 300,
    icon: "UserCheck",
    color: "text-emerald-600 bg-emerald-100",
  },
  {
    label: "จำนวนพนักงานที่ลา (คน/วัน)",
    value: 40,
    icon: "LogOut",
    color: "text-rose-600 bg-rose-100",
  },
  {
    label: "จำนวน OT ทั้งหมด (ชั่งโมง)",
    value: 1250,
    icon: "ClockPlus",
    color: "text-amber-600 bg-amber-100",
  },
  {
    label: "สัญญาหมดอายุ (คน)",
    value: 5,
    icon: "FileWarning",
    color: "text-orange-600 bg-orange-100",
  },
  {
    label: "รอการอนุมัติ (คน)",
    value: 24,
    icon: "AlertCircle",
    color: "text-purple-600 bg-purple-100",
  },
];

export const mockLeaveQuotas = [
  { type: "ลาป่วย", used: 2, total: 30 },
  { type: "ลากิจ", used: 1, total: 6 },
  { type: "ลาพักร้อน", used: 3, total: 10 },
];
export const mockOtRequests = [
  {
    id: 1,
    date: "11 มี.ค. 2026",
    time: "17:30 - 20:30",
    hours: 3,
    reason: "เคลียร์ระบบขึ้น Production",
    status: "pending",
  },
  {
    id: 2,
    date: "05 มี.ค. 2026",
    time: "18:00 - 20:00",
    hours: 2,
    reason: "ทำรายงานสรุปบัญชีประจำเดือน",
    status: "approved",
  },
  {
    id: 3,
    date: "01 มี.ค. 2026",
    time: "17:30 - 21:30",
    hours: 4,
    reason: "ซ่อมแซมเซิร์ฟเวอร์ฉุกเฉิน",
    status: "approved",
  },
  {
    id: 4,
    date: "25 ก.พ. 2026",
    time: "17:30 - 19:30",
    hours: 2,
    reason: "สะสางงาน Routine ทั่วไป",
    status: "rejected", // เทสต์ UI สีแดง (ไม่อนุมัติ)
  },
  {
    id: 5,
    date: "14 ก.พ. 2026",
    time: "09:00 - 17:00",
    hours: 8,
    reason: "ซัพพอร์ตงาน Event นอกสถานที่ (วันหยุด)",
    status: "approved",
  },
];
