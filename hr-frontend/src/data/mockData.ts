// --- Interfaces ---
export interface Company {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  color: string;
}

export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  companyId: string;
  email: string;
  phone: string;
  hireDate: string;
  status: "active" | "inactive" | "probation";
  avatar: string;
  contractEnd?: string;
  history: any[];
}

// --- Data: Companies ---
export const companies: Company[] = [
  { id: "all", name: "All Companies", shortName: "ALL", logo: "🏢", color: "hsl(215 70% 45%)" },
  { id: "company-a", name: "ABC Holdings", shortName: "ABC", logo: "🔵", color: "hsl(215 70% 45%)" },
  { id: "company-b", name: "XYZ Services", shortName: "XYZ", logo: "🟢", color: "hsl(175 60% 40%)" },
  { id: "company-c", name: "DEF Manufacturing", shortName: "DEF", logo: "🟠", color: "hsl(38 92% 50%)" },
];

// --- Massive Data Generation (Internal Use Only) ---
const generateInternalEmployees = (count: number): Employee[] => {
  const result: Employee[] = [];
  const depts = ["IT", "HR", "Marketing", "Finance", "Operations", "Production", "Sales"];
  const companyIds = ["company-a", "company-b", "company-c"];
  
  for (let i = 1; i <= count; i++) {
    result.push({
      id: `emp-${i}`,
      employeeCode: `ST-${String(i).padStart(6, '0')}`,
      firstName: `Employee`,
      lastName: `${i}`,
      position: "Staff",
      department: depts[i % depts.length],
      companyId: companyIds[i % companyIds.length],
      email: `user${i}@example.com`,
      phone: "080-000-0000",
      hireDate: "2020-01-01",
      status: i % 10 === 0 ? "probation" : "active",
      avatar: "👤",
      contractEnd: "2026-12-31",
      history: []
    });
  }
  return result;
};

// ข้อมูลหลักแสนชุดสำหรับใช้คำนวณสถิติภายในไฟล์นี้
const internalEmployees = generateInternalEmployees(100000);

// --- Exported Data: รายชื่อพนักงาน (จำกัดแค่ 10 คนเพื่อความลื่นไหลของ UI) ---
export const employees: Employee[] = internalEmployees.slice(0, 10);

// --- Helper Functions ---

const companyIdToName = (id: string) => {
  const c = companies.find((x) => x.id === id);
  return c ? c.name : "Unknown";
};

// 1. นับจำนวนพนักงานทั้งหมด (สำหรับ Stat Cards)
export function getTotalEmployeeCount(company_id?: string) {
  if (!company_id || company_id === "all") return internalEmployees.length;
  return internalEmployees.filter((e) => e.companyId === company_id).length;
}

// 2. ดึงรายชื่อพนักงาน (จำกัดแค่ 10 รายการเสมอ)
export function getEmployeesByCompany(company_id?: string) {
  const filtered = (!company_id || company_id === "all") 
    ? internalEmployees 
    : internalEmployees.filter((e) => e.companyId === company_id);
  return filtered.slice(0, 10);
}

// 3. สรุปสัญญาจ้าง (ดึงจากข้อมูลหลักแสนแต่แสดงแค่ 10 คน)
export function getContractsByCompany(company_id?: string) {
  const emps = getEmployeesByCompany(company_id);
  return emps.map((e) => ({
    employeeId: e.id,
    name: `${e.firstName} ${e.lastName}`,
    company: companyIdToName(e.companyId),
    expireDate: e.contractEnd,
    daysLeft: 5,
  }));
}

// 4. ข้อมูลอื่นๆ (แผนก, การเข้างาน) อ้างอิงจากฐานข้อมูลหลักแสน
export const headcountByDepartment = {
  "company-a": [
    { department: "IT", count: 1200 },
    { department: "HR", count: 800 },
    { department: "Sales", count: 5000 }
  ],
  "company-b": [{ department: "Operations", count: 15000 }],
  "company-c": [{ department: "Production", count: 35000 }]
};

export const contractExpiring = getContractsByCompany("all");

// ฟังก์ชันอื่นๆ คงเดิมตามความต้องการของคุณ...
export function getPendingApprovalsByCompany(company_id?: string) {
  const emps = getEmployeesByCompany(company_id);
  return emps.slice(0, 5).map((e, i) => ({
    id: 1000 + i,
    employeeId: e.id,
    employeeName: `${e.firstName} ${e.lastName}`,
    type: i % 2 === 0 ? "Leave Request" : "OT Request",
    reason: i % 2 === 0 ? "ลากิจ (Mock)" : "OT ปิดยอด (Mock)",
    status: "Pending",
  }));
}

export function getHolidaysByCompany() {
  return [
    { id: 1, name: "วันจักรี", date: "2026-04-06" },
    { id: 2, name: "สงกรานต์", date: "2026-04-13" },
    { id: 3, name: "สงกรานต์", date: "2026-04-14" },
  ];
}

export function getAttendanceLogsByCompany(company_id?: string) {
  const emps = getEmployeesByCompany(company_id);
  const today = new Date();
  const logs: any[] = [];
  emps.forEach((e) => {
    for (let d = 0; d < 7; d++) {
      const dt = new Date(today.getFullYear(), today.getMonth(), today.getDate() - d);
      logs.push({
        employeeId: e.id,
        work_date: dt.toISOString().split("T")[0],
        status: d % 6 === 0 ? "absent" : "present",
      });
    }
  });
  return logs.sort((a, b) => (a.work_date < b.work_date ? 1 : -1));
}