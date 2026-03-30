import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface EmployeeDashboardProps {
  currentUser: any;
  displayName: string;
  ownLeaveBalance: number;
  ownOtThisMonth: number;
  latestScan: any;
  displayLeaveQuotas: any[];
  calendarData: {
    calYear: number;
    calMonth: number;
    firstDayOfMonth: number;
    daysInMonth: number;
    monthNamesTh: string[];
    todayDate: Date;
  };
  attendanceLogs: any[];
  displayOtRequests: any[];
  USE_MOCK_EMPLOYEE_DATA: boolean;
}

export default function EmployeeDashboard({
  currentUser,
  displayName,
  ownLeaveBalance,
  ownOtThisMonth,
  latestScan,
  displayLeaveQuotas,
  calendarData,
  attendanceLogs,
  displayOtRequests,
  USE_MOCK_EMPLOYEE_DATA,
}: EmployeeDashboardProps) {
  const { calYear, calMonth, firstDayOfMonth, daysInMonth, monthNamesTh, todayDate } = calendarData;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900">
          {currentUser ? `Welcome back, ${displayName}` : "ข้อมูลพนักงานของฉัน"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Personal Dashboard</p>
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
            <p className="text-lg text-muted-foreground">เวลาสแกนเข้า-ออกล่าสุด</p>
            <div className="grid grid-cols-4 gap-4">
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
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {/* โควต้าวันลา */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-xl">โควต้าวันลา</CardTitle>
          </CardHeader>
          <CardContent>
            {displayLeaveQuotas.length === 0 ? (
              <p className="text-sm text-muted-foreground">ไม่พบข้อมูลวันลา</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {displayLeaveQuotas.map((leave: any, index: number) => {
                  const leaveName = leave.type || leave.leave_type_name || "ไม่ระบุประเภท";
                  const usedDays = leave.used || leave.used_days || 0;
                  const totalDays = leave.total || leave.total_days || leave.balance || 0;
                  const percentUsed = totalDays > 0 ? (usedDays / totalDays) * 100 : 0;

                  const svgSize = 96;
                  const center = svgSize / 2;
                  const radius = 38;
                  const strokeWidth = 8;
                  const circumference = 2 * Math.PI * radius;
                  const strokeDashoffset = circumference - (percentUsed / 100) * circumference;

                  const colorPalette = [
                    "text-blue-500", "text-emerald-500", "text-amber-500",
                    "text-purple-500", "text-cyan-500", "text-pink-500",
                  ];
                  const baseColor = colorPalette[index % colorPalette.length];
                  const circleColorClass = percentUsed >= 90 ? "text-red-500" : baseColor;

                  return (
                    <div key={index} className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                      <div className="relative flex items-center justify-center w-24 h-24">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle cx={center} cy={center} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" className="text-slate-200" />
                          <circle cx={center} cy={center} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className={`${circleColorClass} transition-all duration-1000 ease-in-out`} />
                        </svg>
                        <span className="absolute text-lg font-bold text-slate-700">{Math.round(percentUsed)}%</span>
                      </div>
                      <div className="mt-4 text-center">
                        <p className="text-base font-medium text-gray-800 line-clamp-1">{leaveName}</p>
                        <p className="text-sm font-mono mt-1">
                          <span className={`text-lg font-bold ${circleColorClass}`}>{usedDays}</span>
                          <span className="text-muted-foreground font-medium"> / {totalDays} วัน</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ปฏิทิน */}
        <Card className="shadow-card col-span-3">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                ปฏิทินเข้างาน - {monthNamesTh[calMonth]} {calYear + 543}
              </CardTitle>
              <div className="flex gap-8 text-lg text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> ปกติ</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> สาย</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> ขาด</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> ลา/WFH</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mt-2">
              {["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."].map((day) => (
                <div key={day} className="text-center text-lg font-medium text-muted-foreground py-2">{day}</div>
              ))}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="p-2"></div>
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const d = i + 1;
                const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                const realLog = attendanceLogs.find((a) => a.work_date === dateStr);
                let statusColor = "bg-muted/20 text-muted-foreground border-transparent";
                let statusText = "";
                let timeText = "";

                if (USE_MOCK_EMPLOYEE_DATA && !realLog && d <= todayDate.getDate()) {
                  const dayOfWeek = new Date(calYear, calMonth, d).getDay();
                  if (dayOfWeek === 0 || dayOfWeek === 6) {
                    statusColor = "bg-[#E8E8E8] text-gray border border-2 border-[#525252]";
                    statusText = "วันหยุด";
                  } else {
                    if (d % 7 === 0) { statusColor = "bg-rose-50 text-rose-700 border-rose-200"; statusText = "ขาด"; }
                    else if (d % 5 === 0) { statusColor = "bg-amber-50 text-amber-700 border-amber-200"; statusText = "สาย"; timeText = "08:45"; }
                    else if (d % 9 === 0) { statusColor = "bg-blue-50 text-blue-700 border-blue-200"; statusText = "ลา"; }
                    else { statusColor = "bg-emerald-50 text-emerald-700 border-emerald-200"; statusText = "ปกติ"; timeText = "08:15"; }
                  }
                } else if (realLog) {
                  const status = String(realLog.status).toLowerCase();
                  timeText = realLog.check_in_time || "";
                  if (status === "present") { statusColor = "bg-emerald-50 text-emerald-700 border-emerald-200"; statusText = "ปกติ"; }
                  else if (status === "late") { statusColor = "bg-amber-50 text-amber-700 border-amber-200"; statusText = "สาย"; }
                  else if (status === "absent") { statusColor = "bg-rose-50 text-rose-700 border-rose-200"; statusText = "ขาด"; }
                  else { statusColor = "bg-blue-50 text-blue-700 border-blue-200"; statusText = "ลา/WFH"; }
                }

                const isToday = d === todayDate.getDate();

                return (
                  <div key={d} className={`p-1.5 sm:p-2 border rounded-md flex flex-col items-center justify-between min-h-[60px] sm:min-h-[70px] transition-colors ${statusColor} ${isToday ? "ring-2 ring-primary ring-offset-1" : ""}`}>
                    <span className={`text-lg ${isToday ? "font-bold" : "font-medium"}`}>{d}</span>
                    <div className="flex flex-col items-center w-full mt-1">
                      {timeText && <span className="text-lg sm:text-xs ">{timeText}</span>}
                      {statusText && <span className="text-lg font-medium mt-0.5">{statusText}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* คำขอ OT */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-xl">คำขอ OT ล่าสุด</CardTitle>
        </CardHeader>
        <CardContent>
          {displayOtRequests.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">ไม่มีประวัติคำขอ OT</p>
          ) : (
            <div className="space-y-3 ">
              {displayOtRequests.map((ot) => (
                <div key={ot.id} className="flex justify-between items-center p-3 border-b bg-slate-50 hover:bg-slate-100 transition-colors ">
                  <div>
                    <p className="font-medium text-sm text-slate-800 line-clamp-1">{ot.reason}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {ot.date} <span className="mx-1 text-slate-300">|</span> {ot.time}
                      <span className="ml-1 font-medium text-slate-600">({ot.hours} ชม.)</span>
                    </p>
                  </div>
                  <Badge variant="secondary" className={`whitespace-nowrap ml-2 ${ot.status === "approved" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : ot.status === "pending" ? "bg-amber-100 text-amber-700 hover:bg-amber-200" : "bg-rose-100 text-rose-700 hover:bg-rose-200"}`}>
                    {ot.status === "approved" ? "อนุมัติแล้ว" : ot.status === "pending" ? "รออนุมัติ" : "ไม่อนุมัติ"}
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