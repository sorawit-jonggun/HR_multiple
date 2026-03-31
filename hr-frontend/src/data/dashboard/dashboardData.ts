import { 
  getTotalEmployeeCount, 
  getEmployeesByCompany,
  contractExpiring,
  headcountByDepartment 
} from "../mockData";

// 1. ฟังก์ชันสำหรับ Stat Cards (6 กล่องด้านบน)
export const getStatCards = (companyId: string) => {
  // ดึงจำนวนพนักงานจริง (หลักแสน) จาก Helper ใน mockData
  const totalCount = getTotalEmployeeCount(companyId);
  
  // กรองจำนวนสัญญาจ้างที่กำลังจะหมดอายุ (จำลองสถิติ 1% ของพนักงาน)
  const expiringCount = Math.ceil(totalCount * 0.015);

  return [
    {
      label: "พนักงานทั้งหมด",
      value: totalCount,
      icon: "Users",
      color: "text-blue-600 bg-blue-100",
    },
    {
      label: "มาทำงานวันนี้",
      value: Math.floor(totalCount * 0.95), // สถิติ 95%
      icon: "UserCheck",
      color: "text-emerald-600 bg-emerald-100",
    },
    {
      label: "ลาวันนี้",
      value: Math.floor(totalCount * 0.03), // สถิติ 3%
      icon: "LogOut",
      color: "text-rose-600 bg-rose-100",
    },
    {
      label: "OT สะสม (ชม.)",
      value: totalCount * 8, // สมมติคนละ 8 ชม.
      icon: "ClockPlus",
      color: "text-amber-600 bg-amber-100",
    },
    {
      label: "สัญญาหมดอายุ",
      value: expiringCount,
      icon: "FileWarning",
      color: "text-orange-600 bg-orange-100",
    },
    {
      label: "รออนุมัติ",
      value: Math.floor(totalCount * 0.02), // สถิติ 2%
      icon: "AlertCircle",
      color: "text-purple-600 bg-purple-100",
    },
  ];
};

// 2. ข้อมูลพนักงานแยกตามสถานะ (กราฟแท่ง Attendance)
export const getAttendanceByStatus = (companyId: string) => {
  const total = getTotalEmployeeCount(companyId);

  return [
    { name: "มาปกติ (Present)", value: Math.floor(total * 0.85), fill: "#10b981" },
    { name: "สาย (Late)", value: Math.floor(total * 0.07), fill: "#f59e0b" },
    { name: "ขาด/ลา (Absent)", value: Math.floor(total * 0.05), fill: "#ef4444" },
    { name: "WFH", value: Math.floor(total * 0.03), fill: "#3b82f6" },
  ];
};

// 3. ข้อมูลพนักงานแยกตามแผนก (กราฟ Polar Area)
export const getDeptDistribution = (companyId: string) => {
  if (companyId === "all") {
    const all = Object.values(headcountByDepartment).flat();
    const merged = all.reduce((acc: any, curr) => {
      acc[curr.department] = (acc[curr.department] || 0) + curr.count;
      return acc;
    }, {});
    // ปรับตัวเลขแผนกให้ล้อตามสเกลหลักแสน (คูณด้วยตัวเลขสมมติ)
    return Object.keys(merged).map(name => ({ name, value: merged[name] * 800 }));
  }
  
  const depts = headcountByDepartment[companyId as keyof typeof headcountByDepartment] || [];
  return depts.map(d => ({
    name: d.department,
    value: d.count * 800
  }));
};

// --- Mock Data อื่นๆ (คงที่) ---

export const mockLeaveQuotas = [
  { type: "ลาป่วย", used: 2, total: 30 },
  { type: "ลากิจ", used: 1, total: 6 },
  { type: "ลาพักร้อน", used: 3, total: 10 },
];

export const mockOtRequests = [
  { id: 1, date: "11 มี.ค. 2026", time: "17:30 - 20:30", hours: 3, reason: "เคลียร์ระบบขึ้น Production", status: "pending" },
  { id: 2, date: "05 มี.ค. 2026", time: "18:00 - 20:00", hours: 2, reason: "ทำรายงานสรุปบัญชีประจำเดือน", status: "approved" },
  { id: 3, date: "01 มี.ค. 2026", time: "17:30 - 21:30", hours: 4, reason: "ซ่อมแซมเซิร์ฟเวอร์ฉุกเฉิน", status: "approved" },
  { id: 4, date: "25 ก.พ. 2026", time: "17:30 - 19:30", hours: 2, reason: "สะสางงาน Routine ทั่วไป", status: "rejected" },
  { id: 5, date: "14 ก.พ. 2026", time: "09:00 - 17:00", hours: 8, reason: "ซัพพอร์ตงาน Event นอกสถานที่ (วันหยุด)", status: "approved" },
];