import { employees, contractExpiring, headcountByDepartment } from "../mockData";
import { Users, UserCheck, LogOut, ClockPlus, FileWarning, AlertCircle } from "lucide-react";

// 1. Stat Cards (โค้ดที่คุณเขียน)
export const getStatCards = (companyId: string) => {
  const filteredEmps = companyId === "all" ? employees : employees.filter(e => e.companyId === companyId);
  const filteredContracts = companyId === "all" ? contractExpiring : contractExpiring.filter(c => employees.find(e => e.id === c.employeeId)?.companyId === companyId);

  return [
    {
      label: "พนักงานทั้งหมด",
      value: filteredEmps.length,
      icon: "Users", // ส่งเป็น String เพื่อให้ AdminDashboard ไปเลือก Icon เองได้ง่ายขึ้น
      color: "text-blue-600 bg-blue-100",
    },
    {
      label: "มาทำงานวันนี้",
      value: Math.floor(filteredEmps.length * 0.9),
      icon: "UserCheck",
      color: "text-emerald-600 bg-emerald-100",
    },
    {
      label: "ลาวันนี้",
      value: Math.floor(filteredEmps.length * 0.05),
      icon: "LogOut",
      color: "text-rose-600 bg-rose-100",
    },
    {
      label: "OT สะสม (ชม.)",
      value: filteredEmps.length * 10,
      icon: "ClockPlus",
      color: "text-amber-600 bg-amber-100",
    },
    {
      label: "สัญญาหมดอายุ",
      value: filteredContracts.length,
      icon: "FileWarning",
      color: "text-orange-600 bg-orange-100",
    },
    {
      label: "รออนุมัติ",
      value: Math.floor(filteredEmps.length * 0.1),
      icon: "AlertCircle",
      color: "text-purple-600 bg-purple-100",
    },
  ];
};

// 2. ข้อมูลพนักงานแยกตามสถานะ (กราฟแท่งหลัก)
// เพิ่มตัวนี้เพื่อแก้ Error ใน Dashboard.tsx
export const getAttendanceByStatus = (companyId: string) => {
  const filtered = companyId === "all" 
    ? employees 
    : employees.filter(e => e.companyId === companyId);

  return [
    { name: "มาทำงาน (Present)", value: Math.floor(filtered.length * 0.8), fill: "#10b981" },
    { name: "สาย (Late)", value: Math.floor(filtered.length * 0.1), fill: "#f59e0b" },
    { name: "ขาด/ลา (Absent)", value: Math.floor(filtered.length * 0.05), fill: "#ef4444" },
    { name: "WFH", value: Math.floor(filtered.length * 0.05), fill: "#3b82f6" },
  ];
};

// 3. ข้อมูลพนักงานแยกตามแผนก (กราฟ Polar Area ด้านล่าง)
// เพิ่มตัวนี้เพื่อแก้ Error ใน Dashboard.tsx
export const getDeptDistribution = (companyId: string) => {
  if (companyId === "all") {
    const all = Object.values(headcountByDepartment).flat();
    // ยุบรวมชื่อแผนกที่ซ้ำกันจากคนละบริษัท
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

// ข้อมูล Quota และ Requests (ถ้ามีหน้าย่อยเรียกใช้)
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
    status: "rejected", 
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