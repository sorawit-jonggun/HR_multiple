import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { useCompany } from "@/contexts/CompanyContexts";
import { Plus, Edit2, Trash2, Loader, Layers, X, AlertCircle } from "lucide-react";

const MOCK_COMPANIES = [ { id: 1, name_th: "Thai Summit Automotive Co., Ltd." } ];
const MOCK_DEPARTMENTS = [ { id: 1, NAME: "IT & Development" }, { id: 2, NAME: "Human Resources" } ];
let MOCK_SECTIONS = [
  { id: 1, NAME: "Frontend Team", dept_id: 1, company_id: 1 },
  { id: 2, NAME: "Recruitment Team", dept_id: 2, company_id: 1 },
];

const mockAPI = {
  getData: async () => new Promise<any>((res) => setTimeout(() => res({ sections: MOCK_SECTIONS, depts: MOCK_DEPARTMENTS, comps: MOCK_COMPANIES }), 300)),
  createSection: async (data: any) => new Promise((res) => setTimeout(() => { MOCK_SECTIONS.push({ id: Date.now(), ...data }); res(true); }, 300)),
  updateSection: async (id: number, data: any) => new Promise((res) => setTimeout(() => { MOCK_SECTIONS = MOCK_SECTIONS.map(s => s.id === id ? { ...s, ...data } : s); res(true); }, 300)),
  deleteSection: async (id: number) => new Promise((res) => setTimeout(() => { MOCK_SECTIONS = MOCK_SECTIONS.filter(s => s.id !== id); res(true); }, 300)),
};

export default function SectionManagement() {
  const { selectedCompany } = useCompany();
  const [sections, setSections] = useState<any[]>([]);
  const [depts, setDepts] = useState<any[]>([]);
  const [comps, setComps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", deptId: 1, companyId: 1 });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, [selectedCompany]);

  const loadData = async () => {
    setLoading(true); const res = await mockAPI.getData();
    setSections(res.sections); setDepts(res.depts); setComps(res.comps); setLoading(false);
  };

  const handleOpenModal = () => {
    setIsEditMode(false); setEditingId(null); setForm({ name: "", deptId: depts[0]?.id || 1, companyId: comps[0]?.id || 1 }); setShowModal(true);
  };

  const handleEdit = (sec: any) => {
    setIsEditMode(true); setEditingId(sec.id); setForm({ name: sec.NAME, deptId: sec.dept_id, companyId: sec.company_id }); setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name) return; setSaving(true);
    const payload = { NAME: form.name, dept_id: form.deptId, company_id: form.companyId };
    if (isEditMode && editingId) await mockAPI.updateSection(editingId, payload); else await mockAPI.createSection(payload);
    setShowModal(false); await loadData(); setSaving(false);
  };

  if (loading) return <AppLayout><div className="flex justify-center h-screen items-center"><Loader className="animate-spin" /></div></AppLayout>;

  return (
    <AppLayout>
      <div className="space-y-6 pb-10">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Section Management</h1>
          <button onClick={handleOpenModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex gap-2"><Plus size={18}/> Add Section</button>
        </div>
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b"><tr><th className="py-4 px-6 text-left">Section</th><th className="py-4 px-6 text-left">Department</th><th className="py-4 px-6 text-center">Actions</th></tr></thead>
            <tbody className="divide-y">
              {sections.map(s => (
                <tr key={s.id}>
                  <td className="py-3 px-6 font-semibold">{s.NAME}</td>
                  <td className="py-3 px-6 text-slate-600">{depts.find(d => d.id === s.dept_id)?.NAME || "-"}</td>
                  <td className="py-3 px-6 text-center">
                    <button onClick={() => handleEdit(s)} className="text-blue-600 mr-3"><Edit2 size={16}/></button>
                    <button onClick={async () => { if(confirm("ลบ?")){ await mockAPI.deleteSection(s.id); loadData();} }} className="text-red-600"><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
              <h3 className="font-bold text-lg mb-4">{isEditMode ? "Edit" : "Add"} Section</h3>
              <input type="text" placeholder="Section Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border rounded p-2 mb-4" />
              <select value={form.deptId} onChange={e => setForm({...form, deptId: Number(e.target.value)})} className="w-full border rounded p-2 mb-4">
                {depts.map(d => <option key={d.id} value={d.id}>{d.NAME}</option>)}
              </select>
              <div className="flex justify-end gap-2"><button onClick={() => setShowModal(false)} className="px-4 py-2">Cancel</button><button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button></div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}