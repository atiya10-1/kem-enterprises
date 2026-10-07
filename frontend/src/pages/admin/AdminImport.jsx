import { useRef, useState } from "react";
import { Upload, FileSpreadsheet, Download, CheckCircle2, AlertTriangle, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api, { formatApiError, openAuthedFile, PLACEHOLDER } from "@/lib/api";
import { PageHeader, Btn, Card, Table, Td } from "@/components/admin/ui";

const STATUS = {
  ready: { label: "Ready", cls: "bg-emerald-100 text-emerald-700", Icon: CheckCircle2 },
  duplicate: { label: "Duplicate → update", cls: "bg-amber-100 text-amber-700", Icon: Copy },
  error: { label: "Error", cls: "bg-red-100 text-red-700", Icon: AlertTriangle },
};

export default function AdminImport() {
  const fileRef = useRef();
  const [preview, setPreview] = useState(null);
  const [filename, setFilename] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const onFile = async (file) => {
    setFilename(file.name); setResult(null); setLoading(true);
    const fd = new FormData(); fd.append("file", file);
    try {
      const { data } = await api.post("/products/import-preview", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setPreview(data);
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
    finally { setLoading(false); }
  };

  const setAction = (i, action) => setPreview((p) => ({ ...p, rows: p.rows.map((r, idx) => idx === i ? { ...r, action } : r) }));

  const commit = async () => {
    const rows = preview.rows.filter((r) => r.action !== "skip" && r.status !== "error");
    if (rows.length === 0) { toast.error("No valid rows to import"); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/products/import-commit", { rows, filename });
      setResult(data); setPreview(null);
      toast.success(`${data.created} created, ${data.updated} updated`);
    } catch (e) { toast.error(formatApiError(e.response?.data?.detail)); }
    finally { setLoading(false); }
  };

  return (
    <div data-testid="admin-import">
      <PageHeader title="Bulk Import Products" subtitle="Upload Excel (.xlsx) or CSV — preview, validate and confirm before anything is saved.">
        <Btn variant="outline" onClick={() => openAuthedFile("/templates/products.xlsx", "KEM_Product_Template.xlsx")} data-testid="dl-product-template"><Download className="h-4 w-4" /> Product Template</Btn>
        <Btn variant="outline" onClick={() => openAuthedFile("/templates/categories.xlsx", "KEM_Category_Template.xlsx")} data-testid="dl-category-template"><Download className="h-4 w-4" /> Category Template</Btn>
      </PageHeader>

      {!preview && (
        <Card className="p-10 text-center border-dashed border-2 border-slate-300">
          <FileSpreadsheet className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500 mb-1">Only <b>Product Name</b> and <b>Category</b> are required. Images are optional — products without photos get a placeholder you can update later.</p>
          <Btn variant="accent" onClick={() => fileRef.current.click()} data-testid="choose-file-btn" className="mx-auto mt-4">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} {loading ? "Analysing…" : "Select File"}
          </Btn>
          <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={(e) => e.target.files[0] && onFile(e.target.files[0])} />
        </Card>
      )}

      {result && (
        <Card className="p-6" data-testid="import-result">
          <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-2" />
          <h3 className="font-display font-bold text-slate-900 text-lg">Import Complete</h3>
          <p className="text-sm text-slate-600 mt-1">{result.created} created · {result.updated} updated · {result.skipped} skipped · {result.failed} failed</p>
          <Btn variant="accent" onClick={() => { setResult(null); }} className="mt-4">Import Another File</Btn>
        </Card>
      )}

      {preview && (
        <Card className="p-5" data-testid="import-preview">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-sm text-slate-600"><b>{filename}</b></span>
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 font-semibold">{preview.summary.ready} ready</span>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 font-semibold">{preview.summary.duplicates} duplicates</span>
            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 font-semibold">{preview.summary.errors} errors</span>
            <div className="ml-auto flex gap-2">
              <Btn variant="ghost" onClick={() => { setPreview(null); }}>Cancel</Btn>
              <Btn variant="accent" onClick={commit} disabled={loading} data-testid="confirm-import-btn">{loading ? "Importing…" : "Confirm & Import"}</Btn>
            </div>
          </div>
          <div className="text-xs text-slate-400 mb-2">Detected fields: {Object.values(preview.mapping).join(", ") || "none"}</div>
          <Table head={["Row", "Product", "Category", "Status", "Issues", "Action"]}>
            {preview.rows.map((r, i) => {
              const st = STATUS[r.status] || STATUS.ready;
              return (
                <tr key={i} className="hover:bg-slate-50" data-testid={`preview-row-${i}`}>
                  <Td className="text-slate-400">{r.row}</Td>
                  <Td className="font-medium text-slate-900 max-w-[220px] truncate">{r.data.name || <span className="text-red-500">—</span>}</Td>
                  <Td className="text-slate-500">{r.data.category_name || "—"}</Td>
                  <Td><span className={`text-[11px] font-semibold px-2 py-0.5 ${st.cls}`}>{st.label}</span></Td>
                  <Td className="text-xs text-slate-500 max-w-[220px]">{(r.issues || []).join("; ") || "—"}</Td>
                  <Td>
                    <select value={r.action} onChange={(e) => setAction(i, e.target.value)} disabled={r.status === "error"} className="border border-slate-300 text-xs px-2 py-1" data-testid={`row-action-${i}`}>
                      <option value="create">Create new</option>
                      <option value="update">Update existing</option>
                      <option value="skip">Skip</option>
                    </select>
                  </Td>
                </tr>
              );
            })}
          </Table>
        </Card>
      )}
    </div>
  );
}
