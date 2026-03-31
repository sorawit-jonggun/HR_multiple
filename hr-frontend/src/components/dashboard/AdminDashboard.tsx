import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileWarning,
  AlertCircle,
  Calendar,
  Users,
  UserCheck,
  LogOut,
  ClockPlus,
  Import,
} from "lucide-react";
import { Bar as ChartJsBar } from "react-chartjs-2";
import OverviewCards from "./OverviewCards";

// --- Import Mock Data ---
import {
  getEmployeesByCompany,
  getContractsByCompany,
  getPendingApprovalsByCompany,
  getHolidaysByCompany,
} from "@/data/mockData";

import {
  getAttendanceByStatus,
  getLeaveDataByCompany,
  getOTDataByCompany,
} from "@/data/dashboard/ChartDashboard";

import { getStatCards } from "@/data/dashboard/dashboardData";

// --- Import กราฟที่แยกไฟล์ไว้ ---
import LeaveChart from "./Charts/Leave";
import OTChart from "./Charts/OT";
import AttendanceChart from "./Charts/Attendance";
import TrendChart from "./Charts/Trends";

interface AdminDashboardProps {
  currentUser: any;
  displayName: string;
  selectedCompany: any;
  statCards?: any[];
  attendanceByStatus?: any[];
}

export default function AdminDashboard({
  currentUser,
  displayName,
  selectedCompany,
}: AdminDashboardProps) {

  // ข้อมูลตัวเลข Stat Cards (จำนวนพนักงาน, OT, ฯลฯ)
  const stats = useMemo(() => {
    return getStatCards(selectedCompany.id);
  }, [selectedCompany.id]);

  // ข้อมูลกราฟ Attendance (มา, สาย, ขาด)
  const attendance = useMemo(() => {
    return getAttendanceByStatus(selectedCompany.id);
  }, [selectedCompany.id]);

  // ข้อมูลกราฟการลา (Doughnut)
  const leaves = useMemo(() => {
    return getLeaveDataByCompany(selectedCompany.id);
  }, [selectedCompany.id]);

  // ข้อมูลกราฟ OT แยกแผนก
  const ots = useMemo(() => {
    return getOTDataByCompany(selectedCompany.id);
  }, [selectedCompany.id]);

  // ข้อมูลตารางแจ้งเตือน
  const expiringContracts = useMemo(() => {
    return getContractsByCompany(selectedCompany.id);
  }, [selectedCompany.id]);

  const pendingApprovals = useMemo(() => {
    return getPendingApprovalsByCompany(selectedCompany.id);
  }, [selectedCompany.id]);

  const upcomingHolidays = useMemo(() => {
    return getHolidaysByCompany();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header Section */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">
          {currentUser
            ? `Welcome back, ${displayName}`
            : "สถิติทั้งหมดขององค์กร"}
        </h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          {selectedCompany.id === "all"
            ? "All Companies"
            : selectedCompany.name}
        </p>
      </div>

      {/* 2. Stat Cards Grid (6 กล่อง) */}
      <OverviewCards stats={stats} />

      {/* 3. Charts Row - แบ่งเป็น 2 ฝั่งหลัก */}
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Attendance Status */}
        <AttendanceChart data={attendance} />

        {/* Leave Distribution */}

        <LeaveChart data={leaves} />

        {/* OT by Dept (Hours) */}
        <OTChart data={ots} />

        {/* Attendance Trends */}
        {/* <TrendChart data={trends} /> */}

      </div>

      {/* 4. Alert Tables & Holidays */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contracts Expiring */}
        <Card className="shadow-card border-slate-200">
          <CardHeader className="pb-2 border-b border-slate-50 mb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-700">
              <FileWarning className="h-5 w-5 text-orange-600" />
              Contracts Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
              {expiringContracts.map((c: any) => (
                <div
                  key={c.employeeId}
                  className="flex items-center justify-between p-3 rounded-lg border border-orange-100 bg-orange-50/30"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-800">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.company}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-white text-orange-600 border border-orange-200 shadow-sm"
                  >
                    {c.daysLeft} วันที่เหลือ
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card className="shadow-card border-slate-200">
          <CardHeader className="pb-2 border-b border-slate-50 mb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-700">
              <AlertCircle className="h-5 w-5 text-blue-600" /> Pending
              Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
              {pendingApprovals.map((approval: any) => (
                <div
                  key={approval.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-blue-100 bg-blue-50/30"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {approval.employeeName}
                    </p>
                    <p className="text-xs text-slate-500">
                      <span className="font-semibold text-blue-600 uppercase">
                        {approval.type}
                      </span>{" "}
                      | {approval.reason}
                    </p>
                  </div>
                  <Badge className="bg-white text-blue-600 border-blue-200 shadow-sm font-medium">
                    WAITING
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 5. Upcoming Holidays */}
      <Card className="shadow-card border-slate-200">
        <CardHeader className="pb-2 border-b border-slate-50 mb-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-700">
            <Calendar className="h-5 w-5 text-green-600" /> Upcoming Holidays
            (Next 30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcomingHolidays.map((holiday: any) => (
              <div
                key={holiday.id}
                className="p-4 rounded-xl border border-green-100 bg-gradient-to-br from-white to-green-50/50 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-extrabold text-green-900">
                      {holiday.name}
                    </p>
                    <p className="text-lg font-mono font-bold text-green-700 mt-1 leading-none">
                      {new Date(holiday.date).toLocaleDateString("th-TH", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <div className="h-7 w-7 rounded-full bg-white flex items-center justify-center text-green-500 shadow-inner border border-green-50">
                    <Calendar size={12} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
