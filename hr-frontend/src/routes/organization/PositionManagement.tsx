import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Plus, Edit2, Trash2, Loader, Users } from "lucide-react";

let MOCK_POSITIONS = [
  { id: 1, title_th: "Frontend Developer", LEVEL: "S1" },
  { id: 2, title_th: "HR Manager", LEVEL: "M1" },
];

export default function PositionManagement() {
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", level: "" });
  const [editId, setEditId] = useState<number|null>(null);

  useEffect(() => { setTimeout(() => { setPositions([...MOCK_POSITIONS]); setLoading(false); }, 300); }, []);

  const handleSave = () => {
    if(editId) MOCK_POSITIONS = MOCK_POSITIONS.map(p => p.id === editId ? {...p, title_th: form.title, LEVEL: form.level} : p);
    else MOCK_POSITIONS.push({ id: Date.now(), title_th: form.title, LEVEL: form.level });
    setPositions([...MOCK_POSITIONS]); setShowModal(false);
  };

  const handleDelete = (id: number) => { MOCK_POSITIONS = MOCK_POSITIONS.filter(p => p.id !== id); setPositions([...MOCK_POSITIONS]); };

  if (loading) return <AppLayout><div className="flex justify-center h-screen items-center"><Loader className="animate-spin" /></div></AppLayout>;

  return (
    <AppLayout>
      <div className="space-y-6 pb-10">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Position Management</h1>
          <button onClick={() => { setForm({title:"", level:""}); setEditId(null); setShowModal(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex gap-2"><Plus size={18}/> Add Position</button>
        </div>
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b"><tr><th className="py-4 px-6 text-left">Position Title</th><th className="py-4 px-6 text-left">Level Code</th><th className="py-4 px-6 text-center">Actions</th></tr></thead>
            <tbody className="divide-y">
              {positions.map(p => (
                <tr key={p.id}>
                  <td className="py-3 px-6 font-semibold">{p.title_th}</td>
                  <td className="py-3 px-6"><span className="bg-slate-100 px-2 py-1 rounded font-mono">{p.LEVEL}</span></td>
                  <td className="py-3 px-6 text-center">
                    <button onClick={() => { setForm({title: p.title_th, level: p.LEVEL}); setEditId(p.id); setShowModal(true); }} className="text-blue-600 mr-3"><Edit2 size={16}/></button>
                    <button onClick={() => confirm("ลบ?") && handleDelete(p.id)} className="text-red-600"><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl w-96 p-6">
              <h3 className="font-bold text-lg mb-4">{editId ? "Edit" : "Add"} Position</h3>
              <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border p-2 mb-3 rounded" />
              <input type="text" placeholder="Level Code (e.g., S1)" value={form.level} onChange={e => setForm({...form, level: e.target.value})} className="w-full border p-2 mb-4 rounded" />
              <div className="flex justify-end gap-2"><button onClick={() => setShowModal(false)} className="px-4 py-2">Cancel</button><button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button></div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}