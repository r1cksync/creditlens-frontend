"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { analysisStartSchema, AnalysisStartFormData } from "@/lib/validations";
import { analysis, documents } from "@/lib/api";
import Card, { CardTitle } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { Brain, Upload, FileText, X } from "lucide-react";
import toast from "react-hot-toast";

const industryOptions = [
  { value: "", label: "Select Industry" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "services", label: "Services" },
  { value: "it", label: "IT & Software" },
  { value: "retail", label: "Retail & E-commerce" },
  { value: "agriculture", label: "Agriculture" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "healthcare", label: "Healthcare" },
  { value: "real_estate", label: "Real Estate" },
  { value: "nbfc", label: "NBFC" },
  { value: "other", label: "Other" },
];

const companyTypeOptions = [
  { value: "", label: "Select Type" },
  { value: "private", label: "Private Limited" },
  { value: "public", label: "Public Limited" },
  { value: "partnership", label: "Partnership" },
  { value: "proprietorship", label: "Proprietorship" },
  { value: "llp", label: "LLP" },
];

export default function NewAnalysisPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<{ id: string; name: string }[]>([]);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<AnalysisStartFormData>({
    resolver: zodResolver(analysisStartSchema),
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const res = await documents.upload(file, "financial_statement", "");
        setUploadedDocs((prev) => [...prev, { id: res.data.document_id, name: file.name }]);
      }
      toast.success(`${files.length} document(s) uploaded`);
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeDoc = (id: string) => {
    setUploadedDocs((prev) => prev.filter((d) => d.id !== id));
  };

  const onSubmit = async (data: AnalysisStartFormData) => {
    setLoading(true);
    try {
      const body = {
        ...data,
        document_ids: uploadedDocs.map((d) => d.id),
      };
      const res = await analysis.start(body);
      toast.success("Analysis started!");
      router.push(`/dashboard/analysis/${res.data.session_id}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to start analysis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Brain size={20} strokeWidth={1.5} className="text-foreground" />
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
            New Credit Analysis
          </h1>
        </div>
        <p className="text-muted-foreground font-body">
          Provide company details and upload financial documents for AI-powered analysis
        </p>
      </div>

      <hr className="border-0 border-t-4 border-foreground" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Company Info */}
        <Card>
          <CardTitle>Company Information</CardTitle>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Company Name *"
              placeholder="Acme Corporation"
              error={errors.company_name?.message}
              {...register("company_name")}
            />
            <Select
              label="Company Type"
              options={companyTypeOptions}
              {...register("company_type")}
            />
            <Select
              label="Industry Sector"
              options={industryOptions}
              {...register("industry_sector")}
            />
            <Input
              label="Annual Revenue (INR)"
              type="number"
              placeholder="50000000"
              {...register("annual_revenue", { valueAsNumber: true })}
            />
            <Input
              label="Loan Amount Requested (INR)"
              type="number"
              placeholder="10000000"
              {...register("loan_amount_requested", { valueAsNumber: true })}
            />
            <Input
              label="Loan Purpose"
              placeholder="Business expansion"
              {...register("loan_purpose")}
            />
          </div>
        </Card>

        {/* Document Upload */}
        <Card>
          <CardTitle>Financial Documents</CardTitle>
          <p className="text-sm text-muted-foreground font-body mt-2 mb-6">
            Upload balance sheets, P&L statements, cash flow statements, ITR, bank statements
          </p>

          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-foreground cursor-pointer hover:bg-muted transition-colors duration-100">
            <Upload size={20} strokeWidth={1.5} className="text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground font-mono">
              {uploading ? "Uploading..." : "Click to upload (PDF, DOCX, XLSX, JPG, PNG)"}
            </span>
            <input
              type="file"
              className="hidden"
              multiple
              accept=".pdf,.docx,.xlsx,.xls,.jpg,.jpeg,.png,.csv"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>

          {uploadedDocs.length > 0 && (
            <div className="mt-4 space-y-2">
              {uploadedDocs.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 p-3 border border-border-light">
                  <FileText size={16} strokeWidth={1.5} className="text-foreground" />
                  <span className="text-sm flex-1 font-body">{doc.name}</span>
                  <button
                    type="button"
                    onClick={() => removeDoc(doc.id)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X size={16} strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Natural Language Query */}
        <Card>
          <CardTitle>Additional Instructions (Optional)</CardTitle>
          <textarea
            className="w-full mt-4 px-0 py-3 bg-transparent border-0 border-b-2 border-foreground text-foreground font-body placeholder:text-muted-foreground placeholder:italic focus:outline-none focus:border-b-[4px] min-h-[100px] resize-y"
            placeholder="E.g., Focus on working capital cycle and debt servicing capacity..."
            {...register("natural_language_query")}
          />
        </Card>

        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Start AI Analysis &rarr;
        </Button>
      </form>
    </div>
  );
}
