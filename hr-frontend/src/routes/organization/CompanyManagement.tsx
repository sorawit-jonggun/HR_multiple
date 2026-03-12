import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import {
  Plus,
  Edit2,
  Trash2,
  Loader,
  Building,
  X,
  AlertCircle,
} from "lucide-react";

// ==========================================
// 1. MOCK DATA & MOCK API (จำลองระบบ Backend)
// ==========================================
let MOCK_COMPANIES = [
  {
    id: 1,
    name_th: "Thai Summit Automotive Co., Ltd. (Headquarter)",
    short_name: "TSA",
  },
  {
    id: 2,
    name_th: "Thai Summit Eastern Seaboard Autoparts Industry Co., Ltd.",
    short_name: "TSA-RY",
  },
  { id: 3, name_th: "Thai Summit Autoparts Co., Ltd.", short_name: "PKC" },
  {
    id: 4,
    name_th: "Thai Summit Auto Press Co., Ltd.",
    short_name: "TSA",
  },
  {
    id: 5,
    name_th: "Thai Summit Laemchabang Autoparts Co., Ltd.",
    short_name: "TSA-RY",
  },
  { id: 6, name_th: "Thai Summit Banpho Co., Ltd.", short_name: "PKC" },
  {
    id: 7,
    name_th: "Thai Summit Plastech Co., Ltd. (Branch 2)",
    short_name: "TSA",
  },
  {
    id: 8,
    name_th: "TThai Summit Eastern Seaboard Autoparts Industry Co., Ltd.",
    short_name: "TSA-RY",
  },
  { id: 9, name_th: "TS Interseats Co., Ltd.", short_name: "PKC" },
  {
    id: 10,
    name_th: "Thai Summit Gold Press Co., Ltd. (Headquarter)",
    short_name: "TSA",
  },
];

const mockAPI = {
  getCompanies: async () =>
    new Promise<any>((res) =>
      setTimeout(() => res({ data: MOCK_COMPANIES }), 300),
    ),
  createCompany: async (data: any) =>
    new Promise((res) =>
      setTimeout(() => {
        const newId = Math.max(...MOCK_COMPANIES.map((c) => c.id), 0) + 1;
        MOCK_COMPANIES.push({ id: newId, ...data });
        res(true);
      }, 300),
    ),
  updateCompany: async (id: number, data: any) =>
    new Promise((res) =>
      setTimeout(() => {
        MOCK_COMPANIES = MOCK_COMPANIES.map((c) =>
          c.id === id ? { ...c, ...data } : c,
        );
        res(true);
      }, 300),
    ),
  deleteCompany: async (id: number) =>
    new Promise((res) =>
      setTimeout(() => {
        MOCK_COMPANIES = MOCK_COMPANIES.filter((c) => c.id !== id);
        res(true);
      }, 300),
    ),
};

// ==========================================
// 2. COMPONENT หลัก
// ==========================================
export default function CompanyManagement() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({ name_th: "", short_name: "" });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await mockAPI.getCompanies();
      setCompanies(res.data);
    } catch (err) {
      console.error("Error loading companies:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsEditMode(false);
    setEditingId(null);
    setFormError("");
    setForm({ name_th: "", short_name: "" });
    setShowModal(true);
  };

  const handleEdit = (company: any) => {
    setIsEditMode(true);
    setEditingId(company.id);
    setFormError("");
    setForm({ name_th: company.name_th, short_name: company.short_name || "" });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("ยืนยันการลบบริษัทนี้ ข้อมูลที่เกี่ยวข้องอาจได้รับผลกระทบ?"))
      return;
    try {
      await mockAPI.deleteCompany(id);
      await loadData();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleSave = async () => {
    setFormError("");
    setSaving(true);

    try {
      if (!form.name_th.trim()) {
        setFormError("กรุณากรอกชื่อบริษัท");
        setSaving(false);
        return;
      }

      const payload = {
        name_th: form.name_th,
        short_name: form.short_name,
      };

      if (isEditMode && editingId) {
        await mockAPI.updateCompany(editingId, payload);
      } else {
        await mockAPI.createCompany(payload);
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
          <Loader className="animate-spin text-blue-600" size={40} />
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
            <h1 className="text-3xl font-bold text-slate-900">
              Company Management
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              จัดการรายชื่อบริษัทและนิติบุคคลในเครือ
            </p>
          </div>
          <button
            onClick={handleOpenModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all font-medium self-end sm:self-auto"
          >
            <Plus size={18} />
            Add Company
          </button>
        </div>

        {/* Info Card */}
        <div className="grid grid-cols-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6 shadow-sm w-full md:w-1/3">
            <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <Building size={20} />
              Total Companies
            </h3>
            <p className="text-4xl font-bold text-blue-900">
              {companies.length}
            </p>
          </div>
        </div>

        {/* Table Content */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {companies.length === 0 ? (
            <div className="text-center py-12">
              <Building className="mx-auto text-slate-300 mb-3" size={48} />
              <p className="text-slate-600 font-medium">No companies found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-4 px-6 text-left font-semibold text-slate-700 w-20">
                      ID
                    </th>
                    <th className="py-4 px-6 text-left font-semibold text-slate-700">
                      Company Name
                    </th>
                    <th className="py-4 px-6 text-left font-semibold text-slate-700 w-48">
                      Short Name
                    </th>
                    <th className="py-4 px-6 text-center font-semibold text-slate-700 w-32">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {companies.map((company) => (
                    <tr
                      key={company.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 px-6 font-mono text-slate-500">
                        {company.id}
                      </td>
                      <td className="py-3 px-6 font-semibold text-slate-900">
                        {company.name_th}
                      </td>
                      <td className="py-3 px-6">
                        {company.short_name ? (
                          <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded text-xs font-bold">
                            {company.short_name}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(company)}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(company.id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal เพิ่ม/แก้ไข Company */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => !saving && setShowModal(false)}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-fade-in">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <Building size={20} className="text-blue-600" />
                  <h3 className="text-lg font-bold text-slate-900">
                    {isEditMode ? "แก้ไขข้อมูลบริษัท" : "เพิ่มบริษัทใหม่"}
                  </h3>
                </div>
                <button
                  onClick={() => !saving && setShowModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700"
                >
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
                    ชื่อบริษัท <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name_th}
                    onChange={(e) =>
                      setForm({ ...form, name_th: e.target.value })
                    }
                    placeholder="เช่น บริษัท เอบีซี จำกัด"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                    disabled={saving}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    ชื่อย่อ (Short Name)
                  </label>
                  <input
                    type="text"
                    value={form.short_name}
                    onChange={(e) =>
                      setForm({ ...form, short_name: e.target.value })
                    }
                    placeholder="เช่น ABC"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none uppercase"
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50"
                >
                  {saving ? (
                    <Loader size={16} className="animate-spin" />
                  ) : (
                    <Plus size={16} />
                  )}
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
