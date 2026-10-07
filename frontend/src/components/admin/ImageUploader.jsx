import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api, { fileUrl } from "@/lib/api";

export default function ImageUploader({ value = [], onChange, folder = "products", single = false, accept = "image/*" }) {
  const ref = useRef();
  const [uploading, setUploading] = useState(false);
  const images = single ? (value ? [value] : []) : value;

  const upload = async (files) => {
    setUploading(true);
    try {
      const urls = [];
      for (const f of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", f);
        const { data } = await api.post(`/upload?folder=${folder}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        urls.push(data.url);
      }
      if (single) onChange(urls[0]);
      else onChange([...images, ...urls]);
      toast.success("Uploaded");
    } catch (e) { toast.error("Upload failed"); }
    finally { setUploading(false); }
  };

  const addUrl = () => {
    const u = window.prompt("Paste image URL");
    if (!u) return;
    if (single) onChange(u); else onChange([...images, u]);
  };

  const remove = (i) => { if (single) onChange(""); else onChange(images.filter((_, idx) => idx !== i)); };

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3">
        {images.map((img, i) => (
          <div key={i} className="relative h-20 w-20 border border-slate-200 group">
            <img src={fileUrl(img)} alt="" className="h-full w-full object-cover" />
            <button type="button" onClick={() => remove(i)} className="absolute -top-2 -right-2 bg-red-500 text-white h-5 w-5 grid place-items-center"><X className="h-3 w-3" /></button>
          </div>
        ))}
        <button type="button" onClick={() => ref.current.click()} data-testid="upload-btn" className="h-20 w-20 border border-dashed border-slate-300 grid place-items-center text-slate-400 hover:border-kem-accent hover:text-kem-accent">
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
        </button>
      </div>
      <button type="button" onClick={addUrl} className="text-xs text-slate-500 hover:text-kem-accent underline">or paste image URL</button>
      <input ref={ref} type="file" accept={accept} multiple={!single} className="hidden" onChange={(e) => e.target.files.length && upload(e.target.files)} />
    </div>
  );
}
