"use client";

import { useState, useEffect, useMemo } from "react";
import { useCompany } from "@/contexts/CompanyContexts";
import { useAuth } from "@/contexts/AuthContext";
import { apiGet } from "@/lib/api";
import { Permission } from "@/types/roles";

// --- แก้ไขการ Import ตรงนี้: รับเป็นฟังก์ชันแทนตัวแปรคงที่ ---
import { 
  getDeptDistribution, 
  getAttendanceByStatus, 
  getStatCards, 
  mockLeaveQuotas, 
  mockOtRequests 
} from "@/data/dashboard/dashboardData";

import {
  getEmployeesByCompany,
  getContractsByCompany,
  getPendingApprovalsByCompany,
  getHolidaysByCompany,
  getAttendanceLogsByCompany,

  getTotalEmployeeCount
} from "@/data/mockData";

// นำเข้าฟังก์ชันดึงข้อมูลกราฟฝั่ง ChartDashboard
import { 
  getLeaveDataByCompany, 
  getOTDataByCompany 
} from "@/data/dashboard/ChartDashboard";

// นำเข้า Component ย่อย
import EmployeeDashboard from "@/components/dashboard/personal_dashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from "chart.js";

// ลงทะเบียน Component ของ Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, RadialLinearScale, ArcElement, ChartTooltip, ChartLegend);

export default function Dashboard() {
  const { selectedCompany } = useCompany();
  const { hasPermission, user: authUser } = useAuth();
  
  // --- States ---
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [publicHolidays, setPublicHolidays] = useState<any[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<any[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<any[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const USE_MOCK_EMPLOYEE_DATA = true;

  // --- 1. การคำนวณข้อมูลแบบ Dynamic ตามบริษัทที่เลือก ---
  // ข้อมูลส่วนนี้จะเปลี่ยนทันทีเมื่อ selectedCompany.id เปลี่ยน
  const dynamicStats = useMemo(() => getStatCards(selectedCompany.id), [selectedCompany.id]);
  const dynamicAttendance = useMemo(() => getAttendanceByStatus(selectedCompany.id), [selectedCompany.id]);
  const dynamicDepts = useMemo(() => getDeptDistribution(selectedCompany.id), [selectedCompany.id]);
  const dynamicLeaves = useMemo(() => getLeaveDataByCompany(selectedCompany.id), [selectedCompany.id]);
  const dynamicOts = useMemo(() => getOTDataByCompany(selectedCompany.id), [selectedCompany.id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        try { 
          const userData = await apiGet<any>("/auth/me"); 
          setCurrentUser(userData?.user || userData); 
        } catch (e) {}

        const companyQuery = selectedCompany?.id && selectedCompany.id !== "all" ? `?company_id=${selectedCompany.id}` : "";

        if (USE_MOCK_EMPLOYEE_DATA) {
          setEmployees(getEmployeesByCompany(selectedCompany?.id));
          setContracts(getContractsByCompany(selectedCompany?.id));
          setPendingApprovals(getPendingApprovalsByCompany(selectedCompany?.id));
          setPublicHolidays(getHolidaysByCompany(selectedCompany?.id));
          setLeaveBalances(getLeaveBalancesByCompany(selectedCompany?.id));
          setAttendanceLogs(getAttendanceLogsByCompany(selectedCompany?.id));
          setLeaveRequests(getLeaveRequestsByCompany(selectedCompany?.id));
        } else {
          // ส่วนต่อ API จริง (ถ้ามี)
          const empData = await apiGet<any>(`/employees${companyQuery}`);
          setEmployees(Array.isArray(empData) ? empData : empData?.data || []);
          // ... fetch อื่นๆ เหมือนเดิม
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCompany?.id]);

  // --- Logic การแยกหน้า Dashboard ตาม Role ---
  const isEmployeeDashboard =
    hasPermission(Permission.VIEW_OWN_DASHBOARD) &&
    !hasPermission(Permission.VIEW_COMPANY_DASHBOARD) &&
    !hasPermission(Permission.VIEW_HOLDING_DASHBOARD);

  // --- ข้อมูลสำหรับหน้าพนักงาน ---
  const displayName = USE_MOCK_EMPLOYEE_DATA ? "สมชาย ยอดเยี่ยม (Mock)" : (currentUser?.display_name || "User");
  const displayLeaveQuotas = USE_MOCK_EMPLOYEE_DATA ? mockLeaveQuotas : leaveBalances;

  if (loading) return <div className="p-6 text-center">Loading dashboard...</div>;

  // 1. หน้าพนักงานทั่วไป
  if (isEmployeeDashboard) {
    return (
      <EmployeeDashboard 
        currentUser={currentUser}
        displayName={displayName}
        ownLeaveBalance={12}
        ownOtThisMonth={5}
        latestScan={{ check_in_time: "08:15", work_date: new Date().toISOString().split("T")[0] }}
        displayLeaveQuotas={displayLeaveQuotas}
        attendanceLogs={attendanceLogs}
        displayOtRequests={mockOtRequests}
        USE_MOCK_EMPLOYEE_DATA={USE_MOCK_EMPLOYEE_DATA}
        calendarData={{ calYear: new Date().getFullYear(), calMonth: new Date().getMonth(), daysInMonth: 30, firstDayOfMonth: 1, monthNamesTh: [], todayDate: new Date() }}
      />
    );
  }

  // 2. หน้า Admin/Holding (แสดงผลบริษัททั้งหมดหรือรายบริษัท)
  return (
    <AdminDashboard 
      currentUser={currentUser}
      displayName={displayName}
      selectedCompany={selectedCompany}
      statCards={dynamicStats}
      attendanceByStatus={dynamicAttendance}
      deptDistribution={dynamicDepts}
      leaveData={dynamicLeaves}
      otData={dynamicOts}
    />
  );
}