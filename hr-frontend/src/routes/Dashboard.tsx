import { useState, useEffect } from "react";
import { useCompany } from "@/contexts/CompanyContexts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {deptDistribution, attendanceByStatus, statCards, mockLeaveQuotas, mockOtRequests } from "@/data/dashboardData"

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
import { Bar as ChartJsBar, PolarArea, Doughnut } from "react-chartjs-2";

// ลงทะเบียน Component ของ Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale, 
  ArcElement,
  ChartTooltip,
  ChartLegend,
);

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  FileWarning,
  Clock,
  TrendingUp,
  UserCheck,
  LogOut,
  AlertCircle,
  Calendar,
  ClockPlus,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { apiGet } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Permission } from "@/types/roles";

const ATTENDANCE_COLORS = [
  "hsl(145 60% 42%)",
  "hsl(38 92% 50%)",
  "hsl(0 72% 55%)",
  "hsl(205 80% 55%)",
];

const Dashboard = () => {
  const { selectedCompany } = useCompany();
  const { hasPermission, user: authUser } = useAuth();
  const isAll = selectedCompany.id === "all";
  const isEmployeeDashboard =
    hasPermission(Permission.VIEW_OWN_DASHBOARD) &&
    !hasPermission(Permission.VIEW_COMPANY_DASHBOARD) &&
    !hasPermission(Permission.VIEW_HOLDING_DASHBOARD);
  const isManagerDashboard =
    hasPermission(Permission.VIEW_DEPARTMENT_EMPLOYEES) &&
    !hasPermission(Permission.VIEW_COMPANY_DASHBOARD) &&
    !hasPermission(Permission.VIEW_HOLDING_DASHBOARD);
  const isCompanyDashboard =
    hasPermission(Permission.VIEW_COMPANY_DASHBOARD) &&
    !hasPermission(Permission.VIEW_HOLDING_DASHBOARD);

  // States
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [otCostData, setOtCostData] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [publicHolidays, setPublicHolidays] = useState<any[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<any[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<any[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);

  // Filters
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );
  //
  
  // ตัวแปรสำหรับนำไปแสดงผล (ถ้าปิด Mock ก็ให้ไปดึงจาก API จริง)
  const displayOtRequests = USE_MOCK_EMPLOYEE_DATA ? mockOtRequests : [];
  // Calendar
  const todayDate = new Date();
  const calYear = todayDate.getFullYear();
  const calMonth = todayDate.getMonth();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay(); // 0 = Sun, 1 = Mon, ...
  const monthNamesTh = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  const [loading, setLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // ดึง current user
        try {
          const userData = await apiGet<any>("/auth/me");
          setCurrentUser(userData?.user || userData);
        } catch (error) {
          console.error("Failed to fetch current user:", error);
        }

        // ดึง employees
        const empData = await apiGet<any>("/employees");
        const empArray = Array.isArray(empData) ? empData : empData?.data || [];
        setEmployees(empArray);

        // ดึง contracts
        const contractData = await apiGet<any>("/contracts");
        setContracts(
          Array.isArray(contractData) ? contractData : contractData?.data || [],
        );

        // ดึง pending approvals
        try {
          const approvalsData = await apiGet<any>("/approvals/pending");
          setPendingApprovals(
            Array.isArray(approvalsData)
              ? approvalsData
              : approvalsData?.data || [],
          );
        } catch (error) {
          console.error("Failed to fetch pending approvals:", error);
        }

        // ดึง public holidays
        try {
          const holidaysData = await apiGet<any>("/holidays");
          setPublicHolidays(
            Array.isArray(holidaysData)
              ? holidaysData
              : holidaysData?.data || [],
          );
        } catch (error) {
          console.error("Failed to fetch holidays:", error);
        }

        // ดึง leave balances (Employee ใช้ในการ์ดวันลาคงเหลือ)
        try {
          const leaveBalanceData = await apiGet<any>("/leaves/balances");
          setLeaveBalances(
            Array.isArray(leaveBalanceData)
              ? leaveBalanceData
              : leaveBalanceData?.data || [],
          );
        } catch (error) {
          console.error("Failed to fetch leave balances:", error);
        }

        // ดึง attendance ล่าสุด (Employee ใช้ดูเวลาสแกนเข้า-ออกล่าสุด)
        try {
          const attendanceRes = await apiGet<any>("/attendance");
          setAttendanceLogs(
            Array.isArray(attendanceRes)
              ? attendanceRes
              : attendanceRes?.data || [],
          );
        } catch (error) {
          console.error("Failed to fetch attendance logs:", error);
        }

        // ดึงคำร้องใบลา (Manager ใช้ดูทีมที่ลาวันนี้)
        try {
          const leaveReqRes = await apiGet<any>("/leaves/requests");
          setLeaveRequests(
            Array.isArray(leaveReqRes) ? leaveReqRes : leaveReqRes?.data || [],
          );
        } catch (error) {
          console.error("Failed to fetch leave requests:", error);
        }

        // คำนวณ departments จาก employees
        const deptList = [
          ...new Set(
            (empArray || []).map((e: any) => e.department_name).filter(Boolean),
          ),
        ];
        setDepartments(deptList);

        // ดึง attendance (mock สำหรับตอนนี้)
        setAttendanceData([
          { name: "Present", value: 150 },
          { name: "Late", value: 25 },
          { name: "Absent", value: 10 },
          { name: "WFH", value: 65 },
        ]);

        // ดึง OT Cost (mock สำหรับตอนนี้)
        setOtCostData([
          { month: "Sep", amount: 85000 },
          { month: "Oct", amount: 92000 },
          { month: "Nov", amount: 78000 },
          { month: "Dec", amount: 110000 },
          { month: "Jan", amount: 98000 },
          { month: "Feb", amount: 105000 },
        ]);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data by selected company and department
  const filteredEmployees = isCompanyDashboard
    ? employees
    : isAll
      ? employees
      : (employees || []).filter(
          (e: any) =>
            String(e.companyId || e.company_id || e.company_code || "") ===
            String(selectedCompany.id),
        );

  const deptFilteredEmployees =
    selectedDept === "all"
      ? filteredEmployees
      : filteredEmployees.filter(
          (e: any) => (e.department || e.department_name) === selectedDept,
        );

  const filteredContracts = (contracts || []).filter((c) => {
    const emp = (employees || []).find((e) => e.id === c.employeeId);
    if (isAll) return true;
    return emp?.companyId === selectedCompany.id;
  });
  

  // Upcoming holidays (next 30 days)
  const upcomingHolidays = (publicHolidays || [])
    .filter((h: any) => {
      const holidayDate = new Date(h.date);
      const daysUntilHoliday = Math.floor(
        (holidayDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
      );
      return daysUntilHoliday > 0 && daysUntilHoliday <= 30;
    })
    .sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    );


  // ==========================================
  // 1. ตั้งค่าสำหรับสลับใช้ Mock Data
  // ==========================================
  const USE_MOCK_EMPLOYEE_DATA = true; // เปลี่ยนเป็น false เมื่อต้องการใช้ข้อมูลจริงจาก API

  // ==========================================
  // 2. ส่วนตัวแปรจริง (Real Data Logic)
  // ==========================================
  const realOwnLeaveBalance = (leaveBalances || []).reduce(
    (sum: number, item: any) => sum + Number(item?.balance || 0),
    0,
  );

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const realOwnOtThisMonth = (attendanceLogs || []).reduce(
    (sum: number, row: any) => {
      if (!row?.work_date) return sum;
      const workDate = new Date(row.work_date);
      if (
        workDate.getMonth() !== currentMonth ||
        workDate.getFullYear() !== currentYear
      )
        return sum;
      const status = String(row.status || "").toLowerCase();
      return status.includes("ot") ? sum + 1 : sum;
    },
    0,
  );

  const realLatestScan = (attendanceLogs || [])[0] || null;
  const currentUserId = currentUser?.user_id || authUser?.user_id;

  const realMyEmployeeRecord = (employees || []).find(
    (e: any) => String(e.user_id) === String(currentUserId),
  );

  const realDisplayName =
    currentUser?.display_name ||
    currentUser?.name ||
    currentUser?.username ||
    authUser?.display_name ||
    authUser?.username ||
    "User";

  const realDisplayPosition =
    currentUser?.position_name || realMyEmployeeRecord?.position_name || "-";

  const displayLeaveQuotas = USE_MOCK_EMPLOYEE_DATA
    ? mockLeaveQuotas
    : leaveBalances || [];

  // ==========================================
  // 3. ส่วน Mock Data
  // ==========================================
  const mockOwnLeaveBalance = 12;
  const mockOwnOtThisMonth = 5;
  const mockLatestScan = {
    check_in_time: "08:15",
    check_out_time: "17:45",
    work_date: new Date().toISOString().split("T")[0],
  };
  const mockMyEmployeeRecord = {
    employee_code: "EMP-MOCK-2026",
    firstname_th: "สมชาย",
    lastname_th: "ยอดเยี่ยม",
    department_name: "IT & Development",
    status: "Active",
    position_name: "Frontend Developer",
  };
  const mockDisplayName = "สมชาย ยอดเยี่ยม (Mock)";
  const mockDisplayPosition = mockMyEmployeeRecord.position_name;

  // ==========================================
  // 4. ตัวแปรผลลัพธ์ที่จะนำไปใช้ใน UI
  // ==========================================
  const ownLeaveBalance = USE_MOCK_EMPLOYEE_DATA
    ? mockOwnLeaveBalance
    : realOwnLeaveBalance;
  const ownOtThisMonth = USE_MOCK_EMPLOYEE_DATA
    ? mockOwnOtThisMonth
    : realOwnOtThisMonth;
  const latestScan = USE_MOCK_EMPLOYEE_DATA ? mockLatestScan : realLatestScan;
  const myEmployeeRecord = USE_MOCK_EMPLOYEE_DATA
    ? mockMyEmployeeRecord
    : realMyEmployeeRecord;
  const displayName = USE_MOCK_EMPLOYEE_DATA
    ? mockDisplayName
    : realDisplayName;
  const displayPosition = USE_MOCK_EMPLOYEE_DATA
    ? mockDisplayPosition
    : realDisplayPosition;

  // (โค้ดหลังจากนี้ที่เป็นส่วนของ Manager และตัวแปรอื่นๆ คงไว้ตามเดิม)
  const todayStr = new Date().toISOString().split("T")[0];
  const teamPresentToday = (attendanceLogs || []).filter(
    (row: any) =>
      row.work_date === todayStr &&
      ["present", "late"].includes(String(row.status || "").toLowerCase()),
  ).length;
  const teamAbsentToday = (attendanceLogs || []).filter(
    (row: any) =>
      row.work_date === todayStr &&
      String(row.status || "").toLowerCase() === "absent",
  ).length;
  const teamLeaveToday = (leaveRequests || []).filter((lr: any) => {
    if (String(lr.status || "").toLowerCase() !== "approved") return false;
    if (!lr.start_date || !lr.end_date) return false;
    const start = new Date(lr.start_date);
    const end = new Date(lr.end_date);
    const today = new Date(todayStr);
    return start <= today && today <= end;
  }).length;

  const teamOtByDay = (() => {
    const grouped = new Map<string, number>();
    (attendanceLogs || []).forEach((row: any) => {
      const status = String(row.status || "").toLowerCase();
      if (!row.work_date || !status.includes("ot")) return;
      const day = new Date(row.work_date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      });
      grouped.set(day, (grouped.get(day) || 0) + 1);
    });
    const entries = Array.from(grouped.entries()).map(([day, count]) => ({
      day,
      ot: count,
    }));
    return entries.length > 0 ? entries.slice(-7) : [{ day: "No Data", ot: 0 }];
  })();

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard...</div>;
  }

  if (isEmployeeDashboard) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900">
            {currentUser
              ? `Welcome back, ${displayName}`
              : "ข้อมูลพนักงานของฉัน"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Personal Dashboard
          </p>
        </div>
        {/* Employee Stats */}
        <div className="grid grid-cols-3 md:grid-cols-3 gap-6">
          <Card className="shadow-card hover:shadow-card-hover transition-shadow">
            <CardContent className="p-5">
              <p className="text-lg text-muted-foreground">วันลาคงเหลือ</p>
              <p className="text-xl font-bold mt-1">{ownLeaveBalance} วัน</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-card-hover transition-shadow">
            <CardContent className="p-5">
              <p className="text-lg text-muted-foreground">สรุป OT เดือนนี้</p>
              <p className="text-xl font-bold mt-1">{ownOtThisMonth} รายการ</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-card-hover transition-shadow">
            <CardContent className="p-5">
              <p className="text-lg text-muted-foreground">
                เวลาสแกนเข้า-ออกล่าสุด
              </p>
              <p className="grid grid-cols-4 gap-4">
                <p className="text-xl font-semibold mt-1">
                  {latestScan
                    ? `${latestScan.check_in_time || "-"} / ${latestScan.check_out_time || "-"}`
                    : "- / -"}
                </p>
                <p className="text-lg text-muted-foreground mt-1">
                  {latestScan?.work_date
                    ? new Date(latestScan.work_date).toLocaleDateString()
                    : "ยังไม่มีข้อมูล"}
                </p>
              </p>
            </CardContent>
          </Card>
        </div>
        <div className=" grid grid-cols-4 gap-4 ">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-xl">โควต้าวันลา</CardTitle>
            </CardHeader>
            <CardContent>
              {displayLeaveQuotas.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  ไม่พบข้อมูลวันลา
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {displayLeaveQuotas.map((leave: any, index: number) => {
                    const leaveName =
                      leave.type || leave.leave_type_name || "ไม่ระบุประเภท";
                    const usedDays = leave.used || leave.used_days || 0;
                    const totalDays =
                      leave.total || leave.total_days || leave.balance || 0;

                    // คำนวณเปอร์เซ็นต์
                    const percentUsed =
                      totalDays > 0 ? (usedDays / totalDays) * 100 : 0;

                    // ตั้งค่าขนาดวงกลม
                    const svgSize = 96;
                    const center = svgSize / 2;
                    const radius = 38;
                    const strokeWidth = 8;
                    const circumference = 2 * Math.PI * radius;
                    const strokeDashoffset =
                      circumference - (percentUsed / 100) * circumference;

                    // 🎨 ชุดสีสำหรับแต่ละประเภทวันลา (เพิ่ม/เปลี่ยนสีได้ตามต้องการ)
                    const colorPalette = [
                      "text-blue-500", // สีน้ำเงิน
                      "text-emerald-500", // สีเขียว
                      "text-amber-500", // สีเหลือง/ส้ม
                      "text-purple-500", // สีม่วง
                      "text-cyan-500", // สีฟ้าคราม
                      "text-pink-500", // สีชมพู
                    ];

                    // เลือกสีตามลำดับ Index (ถ้าเกิน 6 อันจะวนกลับมาสีแรกใหม่)
                    const baseColor = colorPalette[index % colorPalette.length];

                    // กำหนดสี ถ้าใช้ไปเกิน 90% ให้เปลี่ยนเป็นสีแดงเตือน (ถ้าไม่อยากให้เตือน ลบเงื่อนไขนี้ได้ครับ)
                    const circleColorClass =
                      percentUsed >= 90 ? "text-red-500" : baseColor;

                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                      >
                        {/* 1. กราฟวงกลม */}
                        <div className="relative flex items-center justify-center w-24 h-24">
                          <svg className="w-24 h-24 transform -rotate-90">
                            {/* วงกลมพื้นหลัง */}
                            <circle
                              cx={center}
                              cy={center}
                              r={radius}
                              stroke="currentColor"
                              strokeWidth={strokeWidth}
                              fill="transparent"
                              className="text-slate-200"
                            />
                            {/* วงกลมแสดงความคืบหน้า */}
                            <circle
                              cx={center}
                              cy={center}
                              r={radius}
                              stroke="currentColor"
                              strokeWidth={strokeWidth}
                              fill="transparent"
                              strokeDasharray={circumference}
                              strokeDashoffset={strokeDashoffset}
                              strokeLinecap="round"
                              className={`${circleColorClass} transition-all duration-1000 ease-in-out`}
                            />
                          </svg>
                          {/* ตัวเลข % */}
                          <span className="absolute text-lg font-bold text-slate-700">
                            {Math.round(percentUsed)}%
                          </span>
                        </div>

                        {/* 2. ข้อมูล Text */}
                        <div className="mt-4 text-center">
                          <p className="text-base font-medium text-gray-800 line-clamp-1">
                            {leaveName}
                          </p>
                          <p className="text-sm font-mono mt-1">
                            {/* เปลี่ยนสีตัวเลขให้ตรงกับสีของวงกลม */}
                            <span
                              className={`text-lg font-bold ${circleColorClass}`}
                            >
                              {usedDays}
                            </span>
                            <span className="text-muted-foreground font-medium">
                              {" "}
                              / {totalDays} วัน
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Calendar Show */}
          <Card className="shadow-card col-span-3">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  ปฏิทินเข้างาน - {monthNamesTh[calMonth]} {calYear + 543}
                </CardTitle>
                {/* Legend (คำอธิบายสี) */}
                <div className="flex gap-8 text-lg text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>{" "}
                    ปกติ
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>{" "}
                    สาย
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>{" "}
                    ขาด
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>{" "}
                    ลา/WFH
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 sm:gap-2 mt-2">
                {/* วันในสัปดาห์ */}
                {["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."].map((day) => (
                  <div
                    key={day}
                    className="text-center text-lg font-medium text-muted-foreground py-2"
                  >
                    {day}
                  </div>
                ))}

                {/* ช่องว่างก่อนเริ่มวันที่ 1 */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-2"></div>
                ))}

                {/* วันที่ 1 ถึงสิ้นเดือน */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const d = i + 1;
                  const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

                  // หา log จาก API (ถ้ามี)
                  const realLog = attendanceLogs.find(
                    (a) => a.work_date === dateStr,
                  );
                  let statusColor =
                    "bg-muted/20 text-muted-foreground border-transparent";
                  let statusText = "";
                  let timeText = "";

                  // Mock Data Logic (ถ้า USE_MOCK_EMPLOYEE_DATA เป็น true และเป็นวันในอดีต)
                  if (
                    USE_MOCK_EMPLOYEE_DATA &&
                    !realLog &&
                    d <= todayDate.getDate()
                  ) {
                    const dayOfWeek = new Date(calYear, calMonth, d).getDay();
                    if (dayOfWeek === 0 || dayOfWeek === 6) {
                      statusColor =
                        "bg-[#E8E8E8] text-gray border border-2 border-[#525252]";
                      statusText = "วันหยุด";
                    } else {
                      // จำลองสถานะสุ่มๆ ตามวันที่
                      if (d % 7 === 0) {
                        statusColor =
                          "bg-rose-50 text-rose-700 border-rose-200";
                        statusText = "ขาด";
                      } else if (d % 5 === 0) {
                        statusColor =
                          "bg-amber-50 text-amber-700 border-amber-200";
                        statusText = "สาย";
                        timeText = "08:45";
                      } else if (d % 9 === 0) {
                        statusColor =
                          "bg-blue-50 text-blue-700 border-blue-200";
                        statusText = "ลา";
                      } else {
                        statusColor =
                          "bg-emerald-50 text-emerald-700 border-emerald-200";
                        statusText = "ปกติ";
                        timeText = "08:15";
                      }
                    }
                  } else if (realLog) {
                    // ถ้ามีข้อมูลจริง
                    const status = String(realLog.status).toLowerCase();
                    timeText = realLog.check_in_time || "";
                    if (status === "present") {
                      statusColor =
                        "bg-emerald-50 text-emerald-700 border-emerald-200";
                      statusText = "ปกติ";
                    } else if (status === "late") {
                      statusColor =
                        "bg-amber-50 text-amber-700 border-amber-200";
                      statusText = "สาย";
                    } else if (status === "absent") {
                      statusColor = "bg-rose-50 text-rose-700 border-rose-200";
                      statusText = "ขาด";
                    } else {
                      statusColor = "bg-blue-50 text-blue-700 border-blue-200";
                      statusText = "ลา/WFH";
                    }
                  }

                  const isToday = d === todayDate.getDate();

                  return (
                    <div
                      key={d}
                      className={`p-1.5 sm:p-2 border rounded-md flex flex-col items-center justify-between min-h-[60px] sm:min-h-[70px] transition-colors ${statusColor} ${isToday ? "ring-2 ring-primary ring-offset-1" : ""}`}
                    >
                      <span
                        className={`text-lg ${isToday ? "font-bold" : "font-medium"}`}
                      >
                        {d}
                      </span>
                      <div className="flex flex-col items-center w-full mt-1">
                        {timeText && (
                          <span className="text-lg sm:text-xs ">
                            {timeText}
                          </span>
                        )}
                        {statusText && (
                          <span className="text-lg font-medium mt-0.5">
                            {statusText}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* OT */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-xl">คำขอ OT ล่าสุด</CardTitle>
          </CardHeader>
          <CardContent>
            {displayOtRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                ไม่มีประวัติคำขอ OT
              </p>
            ) : (
              <div className="space-y-3 ">
                {displayOtRequests.map((ot) => (
                  <div
                    key={ot.id}
                    className="flex justify-between items-center p-3  border-b bg-slate-50 hover:bg-slate-100 transition-colors "
                  >
                    <div>
                      <p className="font-medium text-sm text-slate-800 line-clamp-1">
                        {ot.reason}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {ot.date} <span className="mx-1 text-slate-300">|</span>{" "}
                        {ot.time}
                        <span className="ml-1 font-medium text-slate-600">
                          ({ot.hours} ชม.)
                        </span>
                      </p>
                    </div>

                    {/* Badge แสดงสถานะ พร้อมแยกสี */}
                    <Badge
                      variant="secondary"
                      className={`whitespace-nowrap ml-2 ${
                        ot.status === "approved"
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          : ot.status === "pending"
                            ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                            : "bg-rose-100 text-rose-700 hover:bg-rose-200"
                      }`}
                    >
                      {ot.status === "approved"
                        ? "อนุมัติแล้ว"
                        : ot.status === "pending"
                          ? "รออนุมัติ"
                          : "ไม่อนุมัติ"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isManagerDashboard) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900">
            {currentUser
              ? `Welcome back, ${displayName}`
              : "Department Dashboard"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            ภาพรวมแผนก/ทีมของคุณ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">วันนี้ใครมาทำงาน</p>
              <p className="text-2xl font-bold mt-1">{teamPresentToday}</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">วันนี้ใครขาด</p>
              <p className="text-2xl font-bold mt-1">{teamAbsentToday}</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">วันนี้ใครลา</p>
              <p className="text-2xl font-bold mt-1">{teamLeaveToday}</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">สมาชิกในทีม</p>
              <p className="text-2xl font-bold mt-1">{employees.length}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              กราฟ OT ของทีม
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={teamOtByDay}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(214 20% 90%)"
                />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} />
                <Tooltip />
                <Bar
                  dataKey="ot"
                  fill="hsl(215 70% 45%)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in ">
      {/* User Welcome Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-grey-900">
          {currentUser
            ? `Welcome back, ${displayName}`
            : "สถิติทั้งหมดขององค์กร"}
        </h1>
        <p className="text-sm text-grey-600 mt-1">
          {selectedCompany.id === "all"
            ? "All Companies"
            : selectedCompany.shortName}
        </p>
      </div>

      {/* Stat Cards - 6 columns */}
      <div className="grid grid-cols-0 sm:grid-cols-1 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Card
            key={stat.label}
            className="shadow-card hover:shadow-card-hover transition-shadow"
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div
                  className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
        {/* Attendance Status Chart (ใช้ Chart.js) */}
        <Card className="shadow-card flex-1 ">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Attendance Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* 🔴 จุดสำคัญ: เปลี่ยนจาก style เป็น className และเพิ่ม "relative" */}
            <div className="relative w-full h-[260px]">
              <ChartJsBar
                data={{
                  labels: attendanceByStatus.map((item) => item.name),
                  datasets: [
                    {
                      label: "จำนวนพนักงาน",
                      data: attendanceByStatus.map((item) => item.value),
                      // ดึงสีเผื่อทั้งคีย์ fill (ใหม่) และ color (เก่า)
                      backgroundColor: attendanceByStatus.map(
                        (item) => item.fill || item.color || "#3b82f6",
                      ),
                      borderRadius: 4, // 🔴 ใช้เป็นตัวเลขธรรมดาแทน Object
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false, // บังคับให้กราฟใช้ความสูงตามกล่อง relative ด้านบน
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false,
                      },
                      ticks: {
                        font: { size: 12 },
                      },
                    },
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: "rgba(0, 0, 0, 0.05)",
                      },
                      border: {
                        dash: [3, 3], // 🔴 ย้ายตั้งค่าเส้นประมาตรงนี้แทน
                      },
                      ticks: {
                        font: { size: 12 },
                        stepSize: 50, // กะระยะห่างของตัวเลขแกน Y
                      },
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Company Pay (Doughnut Chart) */}
        <Card className="shadow-card flex-1 ">
          <CardHeader className="pb-0 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">
              Company Pay
            </CardTitle>
            {/* ตัวเลือกปี (จำลอง) */}
            <select className="text-sm border-gray-200 rounded-md bg-slate-50 px-2 py-1 outline-none">
              <option>2024</option>
              <option>2025</option>
              <option>2026</option>
            </select>
          </CardHeader>
          <CardContent >
            {/* ชุดข้อมูล Mock Data สำหรับ Company Pay */}
            {(() => {
              const companyPayData = [
                { label: "Salary", percent: 15, value: 1115, color: "#ef4444" },      // แดง
                { label: "Bonus", percent: 8, value: 595, color: "#10b981" },        // เขียว
                { label: "Commission", percent: 20, value: 1487, color: "#0ea5e9" }, // ฟ้า
                { label: "Overtime", percent: 11, value: 817, color: "#f97316" },    // ส้ม
                { label: "Reimbursement", percent: 28, value: 2081, color: "#3b82f6" }, // น้ำเงิน
                { label: "Benefits", percent: 18, value: 1338, color: "#eab308" },   // เหลือง
              ];
              
              const totalValue = companyPayData.reduce((acc, curr) => acc + curr.value, 0);

              return (
                <div className="flex flex-col sm:flex-row items-center grid grid-cols-2 justify-center gap-8 pt-4 pb-2">
                  
                  {/* ฝั่งซ้าย: กราฟโดนัท */}
                  <div className="relative w-48 h-48 sm:w-56 justify-self-center sm:h-56">
                    <Doughnut
                      data={{
                        labels: companyPayData.map((item) => item.label),
                        datasets: [
                          {
                            data: companyPayData.map((item) => item.value),
                            backgroundColor: companyPayData.map((item) => item.color),
                            borderRadius: 20, // ทำให้ปลายเส้นโค้งมน (Pill shape)
                            hoverOffset: 4,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: "90%", // 
                        plugins: {
                          legend: {
                            display: false, // ปิด Legend เดิมของ Chart.js
                          },
                          tooltip: {
                            callbacks: {
                              label: function (context) {
                                const val = context.raw || 0;
                                return ` ${context.label}: ${val.toLocaleString()} THB`;
                              },
                            },
                          },
                        },
                      }}
                    />
                    
                    {/* ข้อความตรงกลางกราฟ (Absolute Positioning) */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl sm:text-3xl font-bold text-slate-700">
                        {totalValue.toLocaleString()}
                      </span>
                      <span className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">
                        Total Data
                      </span>
                    </div>
                  </div>

                  {/* ฝั่งขวา: Custom Legend (คำอธิบายแบบในรูป) */}
                  <div className="flex flex-col gap-3 min-w-[160px]">
                    {companyPayData.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        {/* จุดสี */}
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        {/* เปอร์เซ็นต์ */}
                        <span className="text-sm font-bold text-slate-700">
                          {String(item.percent).padStart(2, '0')}%
                        </span>
                        {/* ชื่อรายการ */}
                        <span className="text-sm text-muted-foreground font-medium">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>

                </div>
                
              );
              
            })()}
          </CardContent>
        </Card>
</div>
        {/* Department Distribution Polar Area Chart */}
        <Card className="shadow-card ">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Employee Distribution by Department
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center w-full h-full">
            {/* ใช้ div ครอบพร้อมความสูง เพื่อให้ maintainAspectRatio: false ทำงานได้ */}
            <div className="relative w-full  h-[500px] mx-auto pb-2">
              <PolarArea
                data={{
                  labels: deptDistribution.map((item) => item.name),
                  datasets: [
                    {
                      label: "จำนวนพนักงาน",
                      data: deptDistribution.map((item) => item.value),
                      // กำหนดสีพื้นหลังให้โปร่งแสงนิดๆ (0.7) เพื่อให้เห็นเส้นสเกลด้านหลัง
                      backgroundColor: [
                        "rgba(59, 130, 246, 0.7)", // ฟ้า #3b82f6
                        "rgba(239, 68, 68, 0.7)", // แดง #ef4444
                        "rgba(16, 185, 129, 0.7)", // เขียว #10b981
                        "rgba(245, 158, 11, 0.7)", // ส้ม #f59e0b
                        "rgba(139, 92, 246, 0.7)", // ม่วง #8b5cf6
                        "rgba(236, 72, 153, 0.7)", // ชมพู #ec4899
                      ],
                      borderWidth: 1, // ความหนาเส้นขอบ
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    r: {
                      pointLabels: {
                        display: true,
                        centerPointLabels: true, // 🔴 ทำให้ Label อยู่ตรงกลางช่องพอดี
                        font: {
                          size: 11,
                        },
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      position: "right", // ย้ายคำอธิบายไปด้านขวา จะได้ไม่เบียดกราฟ
                      labels: {
                        boxWidth: 12,
                        font: { size: 11 },
                      },
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          return ` ${context.label}: ${context.raw} คน`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Alert Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expiring Contracts */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <FileWarning className="h-5 w-5 text-orange-600" />
              Contracts Expiring Soon (30-60 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {/* ใช้ Mock Data ใส่ตรงนี้เพื่อแสดงผลเสมอ */}
              {[
                {
                  id: 1,
                  employeeName: "สมชาย รักดี",
                  department: "IT & Development",
                  expiryDate: "2026-04-15",
                },
                {
                  id: 2,
                  employeeName: "มานี มีใจ",
                  department: "Sales & Marketing",
                  expiryDate: "2026-04-20",
                },
                {
                  id: 3,
                  employeeName: "ปิติ ใจดี",
                  department: "Operations",
                  expiryDate: "2026-04-25",
                },
                {
                  id: 4,
                  employeeName: "ชูใจ นักคิด",
                  department: "Human Resources",
                  expiryDate: "2026-05-02",
                },
                {
                  id: 5,
                  employeeName: "วิชัย ยอดเยี่ยม",
                  department: "Finance",
                  expiryDate: "2026-05-10",
                },
              ].map((c: any) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-orange-200 bg-orange-50 hover:bg-orange-100 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {c.employeeName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {c.department}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-xs whitespace-nowrap bg-white text-orange-600 border border-orange-200 shadow-sm"
                  >
                    หมดอายุ{" "}
                    {new Date(c.expiryDate).toLocaleDateString("th-TH", {
                      day: "numeric",
                      month: "short",
                    })}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {/* ใช้ Mock Data ใส่ตรงนี้เพื่อแสดงผลเสมอ */}
              {[
                {
                  id: 101,
                  employeeName: "สมหมาย ขยันทำงาน",
                  type: "Leave Request",
                  reason: "ลาพักร้อน (Annual Leave)",
                  status: "Pending",
                },
                {
                  id: 102,
                  employeeName: "กานดา พาเพลิน",
                  type: "OT Request",
                  reason: "ทำ OT ปิดยอดบัญชี",
                  status: "Pending",
                },
                {
                  id: 103,
                  employeeName: "ทรงพล คนเก่ง",
                  type: "Expense",
                  reason: "เบิกค่าเดินทางไปพบลูกค้า",
                  status: "Pending",
                },
                {
                  id: 104,
                  employeeName: "สุดา สดใส",
                  type: "Leave Request",
                  reason: "ลากิจธุระครอบครัว",
                  status: "Pending",
                },
                {
                  id: 105,
                  employeeName: "ธนา รักงาน",
                  type: "OT Request",
                  reason: "ซัพพอร์ตระบบวันหยุด",
                  status: "Pending",
                },
              ].map((approval: any) => {
                // กำหนดสีกรอบตามประเภทคำขอ เพื่อให้ดูง่ายขึ้น
                let borderColor = "border-blue-200 bg-blue-50";
                let typeColor = "text-blue-600";

                if (approval.type.includes("Leave")) {
                  borderColor = "border-purple-200 bg-purple-50";
                  typeColor = "text-purple-600";
                } else if (approval.type.includes("OT")) {
                  borderColor = "border-emerald-200 bg-emerald-50";
                  typeColor = "text-emerald-600";
                }

                return (
                  <div
                    key={approval.id}
                    className={`flex items-center justify-between p-3 rounded-lg border hover:shadow-sm transition-all ${borderColor}`}
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {approval.employeeName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        <span className={`font-semibold ${typeColor}`}>
                          {approval.type}
                        </span>
                        <span className="mx-1 text-slate-300">|</span>
                        {approval.reason}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-white shadow-sm font-medium"
                    >
                      รออนุมัติ
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Holidays */}
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-600" />
            Upcoming Public Holidays (Next 30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* ใช้ Mock Data ใส่ตรงนี้เพื่อแสดงผลเสมอ */}
            {[
              { id: 201, name: "วันจักรี", date: "2026-04-06" },
              { id: 202, name: "วันสงกรานต์", date: "2026-04-13" },
              { id: 203, name: "วันสงกรานต์", date: "2026-04-14" },
              { id: 204, name: "วันสงกรานต์", date: "2026-04-15" },
            ].map((holiday: any) => (
              <div
                key={holiday.id}
                className="p-4 rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold text-green-900">
                      {holiday.name}
                    </p>
                    <p className="text-lg font-mono font-semibold text-green-700 mt-1">
                      {new Date(holiday.date).toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-green-500 shadow-sm">
                    <Calendar size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
