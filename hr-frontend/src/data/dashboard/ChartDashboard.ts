import { employees, headcountByDepartment } from "../mockData";

// ฟังก์ชันกรองและนับ Attendance ตามสถานะพนักงานจริงในบริษัทนั้นๆ
export const getAttendanceByStatus = (companyId: string) => {
  const filtered = companyId === "all" 
    ? employees 
    : employees.filter(e => e.companyId === companyId);

  return [
    { name: "มาทำงาน (Present)", value: filtered.filter(e => e.status === "active").length, fill: "#10b981" },
    { name: "สาย (Late)", value: Math.floor(filtered.length * 0.1), fill: "#f59e0b" }, // จำลอง % สาย
    { name: "ลา (Leave)", value: Math.floor(filtered.length * 0.05), fill: "#3b82f6" }, // จำลอง % ลา
    { name: "ขาด (Absent)", value: filtered.filter(e => e.status === "inactive").length, fill: "#ef4444" },
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
    return Object.keys(merged).map(name => ({ name, value: merged[name] }));
  }
  
  return (headcountByDepartment[companyId as keyof typeof headcountByDepartment] || []).map(d => ({
    name: d.department,
    value: d.count
  }));
};

// ข้อมูลการลา (จำลองตามขนาดบริษัท)
export const getLeaveDataByCompany = (companyId: string) => {
  const multiplier = companyId === "all" ? 3 : 1;
  return [
    { label: "Sick Leave", value: 15 * multiplier, color: "#f87171" },
    { label: "Annual Leave", value: 45 * multiplier, color: "#60a5fa" },
    { label: "Personal Leave", value: 10 * multiplier, color: "#fbbf24" },
    { label: "Other", value: 5 * multiplier, color: "#10b981" },
  ];
};

// ข้อมูล OT (ดึงตามแผนกของบริษัทนั้นๆ)
export const getOTDataByCompany = (companyId: string) => {
  const depts = getDeptDistribution(companyId);
  return depts.map(d => ({
    dept: d.name,
    hours: Math.floor(Math.random() * 50) + 10
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