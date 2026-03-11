import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { useCompany } from "@/contexts/CompanyContexts";
import { Plus, Edit2, Trash2, Loader, Building2, X, AlertCircle } from "lucide-react";

// ==========================================
// 1. MOCK DATA & MOCK API
// ==========================================
const MOCK_COMPANIES = [
  { id: 1, name_th: "Thai Summit Automotive Co., Ltd." },
  { id: 2, name_th: "TSA Rayong Branch" },
];

let MOCK_DIVISIONS = [
  { id: 1, NAME: "Operation Division", company_id: 1 },
  { id: 2, NAME: "Administration Division", company_id: 1 },
  { id: 3, NAME: "Manufacturing Division", company_id: 2 },
];

const mockAPI = {
  getCompanies: async () => new Promise<any>((res) => setTimeout(() => res({ data: MOCK_COMPANIES }), 300)),
  getDivisions: async () => new Promise<any>((res) => setTimeout(() => res({ data: MOCK_DIVISIONS }), 300)),
  createDivision: async (data: any) => new Promise((res) => setTimeout(() => {
    const newId = Math.max(...MOCK_DIVISIONS.map(d => d.id), 0) + 1;
    MOCK_DIVISIONS.push({ id: newId, ...data }); res({ success: true });
  }, 300)),
  updateDivision: async (id: number, data: any) => new Promise((res) => setTimeout(() => {
    MOCK_DIVISIONS = MOCK_DIVISIONS.map(d => d.id === id ? { ...d, ...data } : d); res({ success: true });
  }, 300)),
  deleteDivision: async (id: number) => new Promise((res) => setTimeout(() => {
    MOCK_DIVISIONS = MOCK_DIVISIONS.filter(d => d.id !== id); res({ success: true });
  }, 300)),
};

// ==========================================
// 2. COMPONENT
// ==========================================
export default function DevisionManagement() {
  const { selectedCompany } = useCompany();
  const currentCompanyId = selectedCompany?.id || "all";
  
  const [divisions, setDivisions] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", companyId: 1 });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => { loadData(); }, [currentCompanyId]);

  const loadData = async () => {
    setLoading(true);
    const [divRes, compRes] = await Promise.all([mockAPI.getDivisions(), mockAPI.getCompanies()]);
    setCompanies(compRes.data);
    setDivisions(divRes.data);
    setLoading(false);
  };

  const handleOpenModal = () => {
    setIsEditMode(false); setEditingId(null); setFormError("");
    setForm({ name: "", companyId: companies[0]?.id ?? 1 });
    setShowModal(true);
  };

  const handleEdit = (div: any) => {
    setIsEditMode(true); setEditingId(div.id); setFormError("");
    setForm({ name: div.NAME, companyId: div.company_id });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("ยืนยันการลบ Division นี้ ?")) return;
    await mockAPI.deleteDivision(id); await loadData();
  };

  const handleSave = async () => {
    if (!form.name.trim()) return setFormError("กรุณากรอกชื่อ Division");
    setSaving(true);
    const payload = { NAME: form.name, company_id: form.companyId };
    if (isEditMode && editingId) await mockAPI.updateDivision(editingId, payload);
    else await mockAPI.createDivision(payload);
    setShowModal(false); await loadData(); setSaving(false);
  };

  if (loading) return <AppLayout><div className="flex justify-center items-center h-[70vh]"><Loader className="animate-spin text-blue-600" size={40} /></div></AppLayout>;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in pb-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Division Management</h1>
            <p className="text-sm text-muted-foreground mt-1">จัดการส่วนงานหลัก (Division)</p>
          </div>
          <button onClick={handleOpenModal} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus size={18} /> Add Division
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="py-4 px-6 text-left">Division Name</th>
                <th className="py-4 px-6 text-left">Company</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {divisions.map((div) => (
                <tr key={div.id} className="hover:bg-slate-50">
                  <td className="py-3 px-6 font-semibold">{div.NAME}</td>
                  <td className="py-3 px-6 text-slate-600">{companies.find(c => c.id === div.company_id)?.name_th || "-"}</td>
                  <td className="py-3 px-6 text-center">
                    <button onClick={() => handleEdit(div)} className="p-2 text-blue-600 hover:bg-blue-100 rounded mr-2"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(div.id)} className="p-2 text-red-600 hover:bg-red-100 rounded"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b bg-slate-50">
                <h3 className="font-bold flex items-center gap-2"><Building2 size={18} className="text-blue-600"/> {isEditMode ? "แก้ไข Division" : "เพิ่ม Division"}</h3>
                <button onClick={() => !saving && setShowModal(false)}><X size={20} className="text-slate-400"/></button>
              </div>
              <div className="p-5 space-y-4">
                {formError && <p className="text-red-600 bg-red-50 p-2 text-sm rounded flex gap-2"><AlertCircle size={16}/>{formError}</p>}
                <div>
                  <label className="block text-sm font-semibold mb-1">Division Name</label>
                  <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border rounded-lg p-2 outline-none focus:border-blue-600" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Company</label>
                  <select value={form.companyId} onChange={e => setForm({...form, companyId: Number(e.target.value)})} className="w-full border rounded-lg p-2 outline-none focus:border-blue-600 bg-white">
                    {companies.map(c => <option key={c.id} value={c.id}>{c.name_th}</option>)}
                  </select>
                </div>
              </div>
              <div className="p-4 border-t bg-slate-50 flex justify-end gap-2">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg">ยกเลิก</button>
                <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
                  {saving ? <Loader size={16} className="animate-spin"/> : <Plus size={16}/>} บันทึก
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}