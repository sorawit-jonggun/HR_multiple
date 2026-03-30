"use client";

import { useEffect } from "react";
import { useCompany } from "@/contexts/CompanyContexts";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Building2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Permission } from "@/types/roles";

// --- Import ข้อมูลบริษัทจาก Mock Data ---
import { companies as mockCompanies } from "@/data/mockData"; 

const CompanySwitcher = () => {
  const { selectedCompany, setSelectedCompany } = useCompany();
  const { hasPermission } = useAuth();

  // ตรวจสอบสิทธิ์ (ถ้าไม่มีสิทธิ์ดู All ให้กรองออก)
  const canSeeAllCompanies =
    hasPermission(Permission.VIEW_HOLDING_DASHBOARD) ||
    hasPermission(Permission.VIEW_CONSOLIDATED_REPORTS);

  // กรองลิสต์บริษัทตามสิทธิ์
  const availableCompanies = canSeeAllCompanies 
    ? mockCompanies 
    : mockCompanies.filter(c => c.id !== "all");

  // useEffect เพื่อตั้งค่า Default หากค่าปัจจุบันไม่ถูกต้อง
  useEffect(() => {
    if (!selectedCompany?.id) {
      setSelectedCompany(availableCompanies[0]);
    } else if (!canSeeAllCompanies && selectedCompany.id === "all") {
      // ถ้าไม่มีสิทธิ์ดู All แต่เผลอเลือก All ไว้ ให้ดีดกลับไปบริษัทแรก
      setSelectedCompany(availableCompanies[0]);
    }
  }, [canSeeAllCompanies, selectedCompany?.id, availableCompanies, setSelectedCompany]);

  return (
    <Select
      value={selectedCompany?.id || ""}
      onValueChange={(val) => {
        console.debug("CompanySwitcher:onValueChange ->", val);
        const found = availableCompanies.find((c) => c.id === val);
        if (found) setSelectedCompany(found);
      }}
    >
      <SelectTrigger className="w-[220px] bg-white border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 overflow-hidden">
          <Building2 className="h-4 w-4 text-primary shrink-0" />
          <div className="truncate">
            <SelectValue placeholder="เลือกบริษัท" />
          </div>
        </div>
      </SelectTrigger>
      
      <SelectContent>
        {availableCompanies.map((c) => (
          <SelectItem key={c.id} value={c.id}>
            <div className="flex items-center gap-2">
              <span className="text-lg">{c.logo}</span>
              <span className="font-medium truncate">{c.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CompanySwitcher;