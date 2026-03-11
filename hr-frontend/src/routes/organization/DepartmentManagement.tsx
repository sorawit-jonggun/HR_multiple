import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { useCompany } from "@/contexts/CompanyContexts";
import { Plus, Edit2, Trash2, Loader, Briefcase, X, AlertCircle } from "lucide-react";

// ==========================================
// 1. MOCK DATA & MOCK API (จำลองระบบ Backend)
// ==========================================
const MOCK_COMPANIES = [
  { id: 1, name_th: "Thai Summit Automotive Co., Ltd." },
  { id: 2, name_th: "TSA Rayong Branch" },
];

let MOCK_DEPARTMENTS = [
  { id: 1, NAME: "IT & Development", company_id: 1, cost_center: "CC-IT-01" },
  { id: 2, NAME: "Human Resources", company_id: 1, cost_center: "CC-HR-01" },
  { id: 3, NAME: "Production", company_id: 2, cost_center: "CC-PD-02" },
  { id: 4, NAME: "Sales & Marketing", company_id: 1, cost_center: "CC-SM-03" },
];

// ฟังก์ชันจำลอง API
const mockAPI = {
  getCompanies: async () => new Promise<any>((resolve) => setTimeout(() => resolve({ data: MOCK_COMPANIES }), 300)),
  getDepartments: async () => new Promise<any>((resolve) => setTimeout(() => resolve({ data: MOCK_DEPARTMENTS }), 300)),
  createDepartment: async (data: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newId = Math.max(...MOCK_DEPARTMENTS.map(d => d.id), 0) + 1;
        MOCK_DEPARTMENTS.push({ id: newId, ...data });
        resolve({ success: true });
      }, 300);
    });
  },
  updateDepartment: async (id: number, data: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        MOCK_DEPARTMENTS = MOCK_DEPARTMENTS.map(d => d.id === id ? { ...d, ...data } : d);
        resolve({ success: true });
      }, 300);
    });
  },
  deleteDepartment: async (id: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        MOCK_DEPARTMENTS = MOCK_DEPARTMENTS.filter(d => d.id !== id);
        resolve({ success: true });
      }, 300);
    });
  },
};

// ==========================================
// 2. COMPONENT หลัก
// ==========================================
export default function DepartmentManagement() {
  const { selectedCompany } = useCompany(); // <-- เรียกใช้ useCompany
  const currentCompanyId = selectedCompany?.id || "all"; // <-- ดึง id ออกมาใช้
  
  const [departments, setDepartments] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [deptForm, setDeptForm] = useState({ name: "", costCenter: "", companyId: 1 });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    loadData();
  }, [currentCompanyId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [depRes, companyRes] = await Promise.all([
        mockAPI.getDepartments(),
        mockAPI.getCompanies(),
      ]);

      setCompanies(companyRes.data);
      setDepartments(depRes.data);
    } catch (err) {
      console.error("Error loading departments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsEditMode(false);
    setEditingId(null);
    setFormError("");
    setDeptForm({ name: "", costCenter: "", companyId: companies[0]?.id ?? 1 });
    setShowModal(true);
  };

  const handleEdit = (dept: any) => {
    setIsEditMode(true);
    setEditingId(dept.id);
    setFormError("");
    setDeptForm({ 
      name: dept.NAME, 
      costCenter: dept.cost_center || "", 
      companyId: dept.company_id 
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("ยืนยันการลบแผนกนี้ ?")) return;
    try {
      await mockAPI.deleteDepartment(id);
      await loadData();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleSave = async () => {
    setFormError("");
    setSaving(true);

    try {
      if (!deptForm.name.trim()) {
        setFormError("กรุณากรอกชื่อแผนก");
        setSaving(false);
        return;
      }

      const payload = {
        NAME: deptForm.name,
        cost_center: deptForm.costCenter,
        company_id: deptForm.companyId,
      };

      if (isEditMode && editingId) {
        await mockAPI.updateDepartment(editingId, payload);
      } else {
        await mockAPI.createDepartment(payload);
      }

      setShowModal(false);
      await loadData();
    } catch (err: any) {
      setFormError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <Loader className="animate-spin text-blue-600 mx-auto mb-4" size={40} />
            <p className="text-slate-600 font-medium">Loading departments...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in pb-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
  <div>
    <h1 className="text-3xl font-bold text-slate-900">Department Management</h1>
    <p className="text-sm text-muted-foreground mt-1">จัดการข้อมูลแผนกภายในองค์กร</p>
  </div>
  <button
    onClick={handleOpenModal}
    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all font-medium self-end sm:self-auto"
  >
    <Plus size={18} />
    Add Department
  </button>
</div>

        {/* Info Card */}
        <div className="grid grid-cols-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6 shadow-sm w-full md:w-1/3 ">
          <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
            <Briefcase size={20} />
            Total Departments
          </h3>
          <p className="text-4xl font-bold text-blue-900">{departments.length}</p>
        </div>
        </div>

        {/* Content Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          {departments.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="mx-auto text-slate-300 mb-3" size={48} />
              <p className="text-slate-600 font-medium">No departments found</p>
              <p className="text-slate-500 text-sm mt-1">Create your first department to get started</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {departments.map((dept) => (
                <div key={dept.id} className="bg-white rounded-xl border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all flex flex-col h-full overflow-hidden">
                  <div className="p-5 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{dept.NAME}</h3>
                        <p className="text-xs text-slate-500 mt-1 font-medium">
                          Company: {companies.find((c) => c.id === dept.company_id)?.name_th || "-"}
                        </p>
                      </div>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-mono">
                        ID: {dept.id}
                      </span>
                    </div>
                    {dept.cost_center && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-sm text-slate-600 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                          <span className="font-medium">Cost Center:</span> {dept.cost_center}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-2 p-3 bg-slate-50 border-t border-slate-100">
                    <button
                      onClick={() => handleEdit(dept)}
                      className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-blue-600"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(dept.id)}
                      className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal เพิ่ม/แก้ไขแผนก */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !saving && setShowModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-fade-in">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <Briefcase size={20} className="text-blue-600" />
                  <h3 className="text-lg font-bold text-slate-900">
                    {isEditMode ? "แก้ไขแผนก" : "เพิ่มแผนกใหม่"}
                  </h3>
                </div>
                <button onClick={() => !saving && setShowModal(false)} className="p-1.5 text-slate-400 hover:text-slate-700">
                  <X size={20} />
                </button>
              </div>

              <div className="px-6 py-5 space-y-4">
                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>{formError}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    ชื่อแผนก <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={deptForm.name}
                    onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                    placeholder="เช่น ฝ่ายบุคคล, ฝ่ายขาย"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                    disabled={saving}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Cost Center Code
                  </label>
                  <input
                    type="text"
                    value={deptForm.costCenter}
                    onChange={(e) => setDeptForm({ ...deptForm, costCenter: e.target.value })}
                    placeholder="เช่น CC-01 (เว้นว่างได้)"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                    disabled={saving}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    บริษัทสังกัด <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={deptForm.companyId}
                    onChange={(e) => setDeptForm({ ...deptForm, companyId: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none bg-white"
                    disabled={saving}
                  >
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>{c.name_th}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
                <button onClick={() => setShowModal(false)} disabled={saving} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg">
                  ยกเลิก
                </button>
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50">
                  {saving ? <Loader size={16} className="animate-spin" /> : <Plus size={16} />}
                  {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}