import {
  employees,
  headcountByDepartment,
  getTotalEmployeeCount,
} from "../mockData";

// ฟังก์ชันกรองและนับ Attendance ตามสถานะพนักงานจริงในบริษัทนั้นๆ
export const getAttendanceByStatus = (companyId: string) => {
  const total = getTotalEmployeeCount(companyId);

  // คำนวณสัดส่วน % ให้สมจริง (รวมกันต้องได้ 100%)
  const present = Math.floor(total * 0.88); 
  const late = Math.floor(total * 0.05);
  const absent = Math.floor(total * 0.04); 
  const wfh = total - (present + late + absent); 

  return [
    { name: "มาปกติ (Present)", value: present, fill: "#10b981" },
    { name: "สาย (Late)", value: late, fill: "#f59e0b" },
    { name: "ขาด/ลา (Absent)", value: absent, fill: "#ef4444" },
    { name: "WFH", value: wfh, fill: "#3b82f6" },
  ];
};

// ฟังก์ชันดึงแผนกตามบริษัทจาก headcountByDepartment
export const getDeptDistribution = (companyId: string) => {
  if (companyId === "all") {
    // ยุบรวมแผนกจากทุกบริษัทเข้าด้วยกัน
    const all = Object.values(headcountByDepartment).flat();
    const merged = all.reduce((acc: any, curr) => {
      acc[curr.department] = (acc[curr.department] || 0) + curr.count;
      return acc;
    }, {});
    return Object.keys(merged).map((name) => ({ name, value: merged[name] }));
  }

  return (
    headcountByDepartment[companyId as keyof typeof headcountByDepartment] || []
  ).map((d) => ({
    name: d.department,
    value: d.count,
  }));
};

// ข้อมูลการลา (จำลองตามขนาดบริษัท)
export const getLeaveDataByCompany = (companyId: string) => {
  const total = getTotalEmployeeCount(companyId);

  // จำลองว่าในหนึ่งวันจะมีคนลาประมาณ 3-5% ของพนักงานทั้งหมด
  const totalLeaveToday = Math.floor(total * 0.03);

  return [
    {
      label: "Sick Leave",
      value: Math.floor(totalLeaveToday * 0.4),
      color: "#f87171",
    }, // 40% ของคนลา
    {
      label: "Annual Leave",
      value: Math.floor(totalLeaveToday * 0.3),
      color: "#60a5fa",
    }, // 30%
    {
      label: "Personal Leave",
      value: Math.floor(totalLeaveToday * 0.2),
      color: "#fbbf24",
    }, // 20%
    {
      label: "Other",
      value: totalLeaveToday - Math.floor(totalLeaveToday * 0.9),
      color: "#10b981",
    }, // 10%
  ];
};

// ข้อมูล OT (ดึงตามแผนกของบริษัทนั้นๆ)
export const getOTDataByCompany = (companyId: string) => {
  const depts = getDeptDistribution(companyId);
  return depts.map((d) => ({
    dept: d.name,
    hours: Math.floor(Math.random() * 50) + 10,
  }));
};

export const CHART_COLORS = [
  "#3B82F6",
  "#22C55E",
  "#F59E0B",
  "#EC4899",
  "#6366F1",
  "#EF4444",
  "#6B7280",
];

export const getTrendDataByCompany = (companyId: string) => {
  const total = getTotalEmployeeCount(companyId);
  
  // สร้างตัวคูณ (Scale) โดยอิงจากจำนวนพนักงาน
  // เช่น ถ้ามี 100,000 คน ตัวคูณคือ 100
  const baseScale = total / 1000; 

  return [
    { month: "Jan", performance: Math.floor(450 * baseScale) },
    { month: "Feb", performance: Math.floor(520 * baseScale) },
    { month: "Mar", performance: Math.floor(480 * baseScale) },
    { month: "Apr", performance: Math.floor(710 * baseScale) },
    { month: "May", performance: Math.floor(660 * baseScale) },
    { month: "Jun", performance: Math.floor(890 * baseScale) },
  ];
};
