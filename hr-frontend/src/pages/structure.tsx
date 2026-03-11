// import React from "react";
// import AppLayout from "@/components/AppLayout"; // ปรับ path ให้ตรงกับที่เก็บไฟล์ AppLayout ของคุณ
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { User, Briefcase, Building2 } from "lucide-react";

// // ==========================================
// // 1. Mock Data: โครงสร้างองค์กร
// // ==========================================
// const orgData = {
//   id: "1",
//   name: "สมชาย ผู้บริหาร",
//   position: "Chief Executive Officer (CEO)",
//   department: "Executive",
//   roleType: "executive",
//   children: [
//     {
//       id: "2",
//       name: "สมหญิง เทคโนโลยี",
//       position: "Chief Technology Officer (CTO)",
//       department: "Technology",
//       roleType: "management",
//       children: [
//         {
//           id: "5",
//           name: "วิชัย นักพัฒนา",
//           position: "Frontend Lead",
//           department: "Technology",
//           roleType: "lead",
//         },
//         {
//           id: "6",
//           name: "สมศักดิ์ หลังบ้าน",
//           position: "Backend Lead",
//           department: "Technology",
//           roleType: "lead",
//         },
//       ],
//     },
//     {
//       id: "3",
//       name: "มานี บุคคล",
//       position: "HR Director",
//       department: "Human Resources",
//       roleType: "management",
//       children: [
//         {
//           id: "7",
//           name: "ใจดี สรรหา",
//           position: "Recruitment Specialist",
//           department: "Human Resources",
//           roleType: "staff",
//         },
//       ],
//     },
//     {
//       id: "4",
//       name: "ปิติ การเงิน",
//       position: "Chief Financial Officer (CFO)",
//       department: "Finance",
//       roleType: "management",
//       children: [],
//     },
//   ],
// };

// // ==========================================
// // 2. Component: สำหรับสร้าง Node แต่ละกล่อง
// // ==========================================
// const OrgNode = ({ node }: { node: any }) => {
//   // กำหนดสีกรอบตามระดับตำแหน่ง
//   const getBorderColor = (type: string) => {
//     switch (type) {
//       case "executive": return "border-blue-500";
//       case "management": return "border-purple-500";
//       case "lead": return "border-emerald-500";
//       default: return "border-gray-300";
//     }
//   };

//   return (
//     <div className="flex flex-col items-center">
//       {/* กล่องข้อมูลพนักงาน */}
//       <Card className={`w-48 sm:w-56 shadow-sm border-t-4 ${getBorderColor(node.roleType)} hover:shadow-md transition-shadow relative z-10 bg-white`}>
//         <CardContent className="p-4 flex flex-col items-center text-center">
//           <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
//             <User className="h-6 w-6 text-slate-500" />
//           </div>
//           <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{node.name}</h3>
//           <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 justify-center">
//             <Briefcase className="h-3 w-3" />
//             <span className="line-clamp-1">{node.position}</span>
//           </p>
//           <Badge variant="secondary" className="mt-2 text-[10px] font-normal flex items-center gap-1">
//             <Building2 className="h-3 w-3" />
//             {node.department}
//           </Badge>
//         </CardContent>
//       </Card>

//       {/* เส้นเชื่อมโยง (ถ้ามีลูกน้อง) */}
//       {node.children && node.children.length > 0 && (
//         <div className="flex flex-col items-center w-full">
//           {/* เส้นแนวตั้งลงมาจากกล่องแม่ */}
//           <div className="w-px h-6 bg-gray-300"></div>

//           {/* กล่องบรรจุลูกน้องทั้งหมด */}
//           <div className="flex gap-4 sm:gap-6 relative">
//             {/* เส้นแนวนอนสำหรับเชื่อมลูกๆ (แสดงเฉพาะเมื่อมีลูกมากกว่า 1 คน) */}
//             {node.children.length > 1 && (
//               <div 
//                 className="absolute top-0 h-px bg-black" 
//                 style={{ 
//                   left: "calc(50% / " + node.children.length + " + 20%)", 
//                   right: "calc(50% / " + node.children.length + " + 20%)" 
//                 }}
//               />
//             )}
            
//             {/* วนลูปสร้างกล่องลูกน้อง */}
//             {node.children.map((child: any, index: number) => (
//               <div key={child.id} className="flex flex-col items-center relative pt-6">
//                 {/* เส้นแนวตั้งลงมาหากล่องลูก (เฉพาะเมื่อมีลูกมากกว่า 1) */}
//                 {node.children.length > 1 && (
//                   <div className="absolute top-0 w-px h-6 bg-black"></div>
//                 )}
//                 <OrgNode node={child} />
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // ==========================================
// // 3. หน้าจอหลัก (Page Component)
// // ==========================================
// export default function CompanyStructurePage() {
//   return (
//     <AppLayout>
//       <div className="space-y-6 animate-fade-in pb-10">
//         {/* Header */}
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Company Structure</h1>
//           <p className="text-sm text-muted-foreground mt-1">
//             แผนผังโครงสร้างองค์กรและสายบังคับบัญชา
//           </p>
//         </div>

//         {/* พื้นที่แสดง Org Chart */}
//         <div className="bg-slate-50/50 border border-border rounded-xl p-8 overflow-x-auto">
//           <div className="min-w-max flex justify-center py-4">
//             <OrgNode node={orgData} />
//           </div>
//         </div>
//       </div>
//     </AppLayout>
//   );
// }

import React from "react";
// อย่าลืมเช็ค path ของ AppLayout และ UI components ให้ตรงกับโปรเจกต์ของคุณ
import AppLayout from "@/components/AppLayout"; 
import { Card, CardContent } from "@/components/ui/card";

export default function CompanyStructurePage() {
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in pb-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Company Structure</h1>
          <p className="text-sm text-muted-foreground mt-1">
            แผนผังโครงสร้างองค์กรและสายบังคับบัญชา
          </p>
        </div>

        {/* พื้นที่แสดงรูปภาพ Org Chart */}
        <Card className="shadow-card overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-slate-50/50 flex justify-center items-center min-h-[600px] p-4 sm:p-8">
              
              {/* วิธีนำรูปของคุณมาใส่:
                1. นำไฟล์รูป (เช่น org-chart.png) ไปวางไว้ในโฟลเดอร์ public ของ Next.js (เช่น public/images/org-chart.png)
                2. เปลี่ยน src ด้านล่างเป็น "/images/org-chart.png"
              */}
              <img 
                src="/images/CEO.png" 
                alt="Company Organization Chart" 
                className="max-w-full h-auto rounded-lg shadow-sm border border-gray-200"
              />

            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}