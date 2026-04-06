"use client";

import { useEffect, useState } from "react";
import { documents } from "@/lib/api";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { FileText, Upload, Trash2, Eye } from "lucide-react";
import toast from "react-hot-toast";

export default function DocumentsPage() {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const loadDocs = () => {
    documents.list(0, 50).then((res) => {
      setDocs(res.data?.items || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { loadDocs(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await documents.upload(file, "financial_statement", "");
      }
      toast.success(`${files.length} file(s) uploaded`);
      loadDocs();
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this document?")) return;
    try {
      await documents.delete(id);
      toast.success("Document deleted");
      loadDocs();
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  };

  const handleView = async (id: string) => {
    try {
      const res = await documents.get(id);
      if (res.data?.download_url) {
        window.open(res.data.download_url, "_blank");
      }
    } catch {
      toast.error("Could not load document");
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  if (loading) return <LoadingSpinner message="Loading documents..." />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground font-body mt-1">Manage your financial documents</p>
        </div>
        <label>
          <Button variant="primary" loading={uploading} className="cursor-pointer">
            <Upload size={16} strokeWidth={1.5} />
            Upload
          </Button>
          <input
            type="file"
            className="hidden"
            multiple
            accept=".pdf,.docx,.xlsx,.xls,.jpg,.jpeg,.png,.csv"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b-2 border-foreground">
                <th className="text-left py-3 px-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">File</th>
                <th className="text-left py-3 px-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">Type</th>
                <th className="text-left py-3 px-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">Size</th>
                <th className="text-left py-3 px-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">Version</th>
                <th className="text-right py-3 px-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((doc: any) => (
                <tr key={doc.document_id} className="border-b border-border-light hover:bg-muted transition-colors duration-100">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FileText size={16} strokeWidth={1.5} />
                      <span>{doc.filename}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground font-mono text-xs capitalize">{doc.document_type?.replace(/_/g, " ")}</td>
                  <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{formatSize(doc.file_size || 0)}</td>
                  <td className="py-3 px-4 text-muted-foreground font-mono text-xs">v{doc.version}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleView(doc.document_id)} className="text-foreground hover:underline">
                        <Eye size={16} strokeWidth={1.5} />
                      </button>
                      <button onClick={() => handleDelete(doc.document_id)} className="text-muted-foreground hover:text-foreground">
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {docs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground font-body italic">No documents uploaded</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
