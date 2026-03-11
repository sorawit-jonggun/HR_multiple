import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function LevelsManagement() {
  const [levels, setLevels] = useState([
    { id: 1, level: "S1", level_title: "Staff", thai_title: "พนักงาน / เจ้าหน้าที่" },
    { id: 2, level: "S2", level_title: "Senior Staff", thai_title: "พนักงานอาวุโส" },
    { id: 3, level: "M1", level_title: "Manager", thai_title: "ผู้จัดการ" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ level: "", level_title: "", thai_title: "" });
  const [editId, setEditId] = useState<number|null>(null);

  const handleSave = () => {
    if(editId) setLevels(levels.map(l => l.id === editId ? {...l, ...form} : l));
    else setLevels([...levels, { id: Date.now(), ...form }]);
    setShowModal(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6 pb-10">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Level Management</h1>
          <button onClick={() => { setForm({level:"", level_title:"", thai_title:""}); setEditId(null); setShowModal(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex gap-2"><Plus size={18}/> Add Level</button>
        </div>
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b"><tr><th className="py-4 px-6 text-left">Level Code</th><th className="py-4 px-6 text-left">English Title</th><th className="py-4 px-6 text-left">Thai Title</th><th className="py-4 px-6 text-center">Actions</th></tr></thead>
            <tbody className="divide-y">
              {levels.map(l => (
                <tr key={l.id}>
                  <td className="py-3 px-6"><span className="font-mono bg-slate-100 px-2 py-1 rounded">{l.level}</span></td>
                  <td className="py-3 px-6 font-semibold">{l.level_title}</td>
                  <td className="py-3 px-6 text-slate-600">{l.thai_title}</td>
                  <td className="py-3 px-6 text-center">
                    <button onClick={() => { setForm({level: l.level, level_title: l.level_title, thai_title: l.thai_title}); setEditId(l.id); setShowModal(true); }} className="text-blue-600 mr-3"><Edit2 size={16}/></button>
                    <button onClick={() => confirm("ลบ?") && setLevels(levels.filter(item => item.id !== l.id))} className="text-red-600"><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl w-96 p-6">
              <h3 className="font-bold text-lg mb-4">{editId ? "Edit" : "Add"} Level</h3>
              <input type="text" placeholder="Level Code (e.g., S1)" value={form.level} onChange={e => setForm({...form, level: e.target.value})} className="w-full border p-2 mb-3 rounded" />
              <input type="text" placeholder="English Title" value={form.level_title} onChange={e => setForm({...form, level_title: e.target.value})} className="w-full border p-2 mb-3 rounded" />
              <input type="text" placeholder="Thai Title" value={form.thai_title} onChange={e => setForm({...form, thai_title: e.target.value})} className="w-full border p-2 mb-4 rounded" />
              <div className="flex justify-end gap-2"><button onClick={() => setShowModal(false)} className="px-4 py-2">Cancel</button><button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button></div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}