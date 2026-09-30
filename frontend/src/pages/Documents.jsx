import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { 
  FolderCheck, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Trash2, 
  Eye, 
  Sparkles, 
  ShieldCheck, 
  Info 
} from "lucide-react";

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Upload Form
  const [selectedCategory, setSelectedCategory] = useState("Income Certificate");
  const [fileToUpload, setFileToUpload] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  const categories = [
    "Income Certificate",
    "Community/Caste Certificate",
    "Academic Certificate",
    "Identity Document",
    "Bank Details",
    "Bonafide Student Certificate"
  ];

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await api.getDocuments();
      setDocuments(data || []);
    } catch (err) {
      console.error("Error loading documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileToUpload(e.target.files[0]);
      setUploadError("");
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!fileToUpload) {
      setUploadError("Please select a file to upload (PDF, JPG, PNG).");
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadSuccess("");

    try {
      const formData = new FormData();
      formData.append("document_type", selectedCategory);
      formData.append("file", fileToUpload);

      const res = await api.uploadDocument(formData);
      setUploadSuccess(`"${fileToUpload.name}" uploaded and parsed via OCR successfully! OCR Confidence: ${res.ocr_confidence}%.`);
      setFileToUpload(null);
      // Reset file input
      const fileInput = document.getElementById("file-upload-input");
      if (fileInput) fileInput.value = "";
      
      await fetchDocuments();
    } catch (err) {
      setUploadError(err.message || "Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this document from your vault?")) return;
    try {
      await api.deleteDocument(id);
      setDocuments(documents.filter(d => d.id !== id));
    } catch (err) {
      alert(err.message || "Error deleting document.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-blue-50 text-blue-700">
                <FolderCheck className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Document Vault & OCR Verification
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Securely upload revenue certificates and scorecards. ScholarLink's automated OCR engine extracts text and calculates confidence scores to streamline official verification.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Vault Encrypted (AES-256)</span>
          </div>
        </div>

        {/* Upload Form Card */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Upload className="w-4 h-4 text-blue-600" />
            <span>Upload New Document</span>
          </h2>

          {uploadError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          <form onSubmit={handleUploadSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            
            {/* Category Select */}
            <div className="sm:col-span-4">
              <label htmlFor="doc-category" className="block text-xs font-semibold text-slate-700 mb-1">
                Document Category <span className="text-rose-500">*</span>
              </label>
              <select
                id="doc-category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* File Input */}
            <div className="sm:col-span-5">
              <label htmlFor="file-upload-input" className="block text-xs font-semibold text-slate-700 mb-1">
                Select File (PDF, JPG, PNG) <span className="text-rose-500">*</span>
              </label>
              <input
                id="file-upload-input"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-slate-300 rounded-lg p-1"
              />
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-3">
              <button
                type="submit"
                disabled={uploading}
                className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing OCR...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload & Extract</span>
                  </>
                )}
              </button>
            </div>

          </form>

          <p className="text-[11px] text-slate-400">
            Files are immediately processed through the OCR extraction engine to parse issuing authority signatures, seal validity, and beneficiary details.
          </p>
        </div>

        {/* Document List Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              Uploaded Documents ({documents.length})
            </h3>
            <span className="text-xs text-slate-500">
              Real-time OCR confidence tracking
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <span>Fetching vault records...</span>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs space-y-2">
              <FolderCheck className="w-8 h-8 text-slate-300 mx-auto" />
              <p>No documents uploaded yet. Upload your revenue certificates to complete verification.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3">Document Category</th>
                    <th className="px-4 py-3">File Name</th>
                    <th className="px-4 py-3">Upload Date</th>
                    <th className="px-4 py-3">OCR Status</th>
                    <th className="px-4 py-3">Confidence</th>
                    <th className="px-4 py-3">Verification</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {documents.map((doc) => {
                    const conf = doc.ocr_confidence || 0;
                    const isHigh = conf >= 85;
                    return (
                      <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                        
                        <td className="px-5 py-4 font-bold text-slate-900 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>{doc.document_type}</span>
                        </td>

                        <td className="px-4 py-4 text-slate-600 font-mono text-[11px]">
                          {doc.original_filename}
                        </td>

                        <td className="px-4 py-4 text-slate-500">
                          {doc.uploaded_at}
                        </td>

                        <td className="px-4 py-4">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                            doc.ocr_status === "Verified"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : doc.ocr_status === "Needs Review"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-slate-50 text-slate-700 border-slate-200"
                          }`}>
                            {doc.ocr_status}
                          </span>
                        </td>

                        <td className="px-4 py-4 font-semibold">
                          <span className={`inline-flex items-center gap-1 ${isHigh ? "text-emerald-700" : "text-amber-700 font-bold"}`}>
                            {conf > 0 ? `${conf}%` : "Pending"}
                            {conf < 85 && conf > 0 && (
                              <span className="text-[10px] bg-amber-100 px-1 py-0.2 rounded text-amber-900" title="Low OCR confidence routes to verification queue">
                                Manual Review
                              </span>
                            )}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                            doc.verification_status === "Verified" 
                              ? "text-emerald-700" 
                              : doc.verification_status === "Needs Review"
                              ? "text-amber-700"
                              : "text-slate-500"
                          }`}>
                            {doc.verification_status === "Verified" ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Clock className="w-3.5 h-3.5 text-amber-500" />
                            )}
                            <span>{doc.verification_status}</span>
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => setSelectedDoc(doc)}
                            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors"
                          >
                            View OCR
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(doc.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors"
                            title="Delete Document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* OCR EXTRACTION DRAWER / MODAL */}
        {selectedDoc && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
              
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-sm">
                    OCR Extraction Metadata: {selectedDoc.document_type}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="text-slate-400 hover:text-slate-700 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Confidence Score Pill */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block">OCR Recognition Confidence</span>
                  <span className="font-bold text-slate-900">{selectedDoc.original_filename}</span>
                </div>
                <div className={`text-base font-extrabold px-2.5 py-1 rounded border ${
                  selectedDoc.ocr_confidence >= 85 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}>
                  {selectedDoc.ocr_confidence}%
                </div>
              </div>

              {/* Extracted Key-Value Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Extracted Fields & Verification Tokens
                </h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100 text-xs">
                  {selectedDoc.extracted_data && Object.keys(selectedDoc.extracted_data).length > 0 ? (
                    Object.entries(selectedDoc.extracted_data).map(([key, val]) => (
                      <div key={key} className="flex justify-between p-2.5 bg-white">
                        <span className="text-slate-500 font-medium capitalize">
                          {key.replace(/_/g, " ")}:
                        </span>
                        <span className="text-slate-900 font-mono font-semibold">
                          {typeof val === "boolean" ? (val ? "Verified (Yes)" : "No") : String(val)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-slate-500 italic">No structured data parsed.</div>
                  )}
                </div>
              </div>

              {/* Officer Notes */}
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-900 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                  <span>Validation Audit Log:</span>
                </div>
                <p className="text-[11px] leading-relaxed text-blue-950">
                  {selectedDoc.verification_notes || "Document undergoing automated rule validation."}
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedDoc(null)}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-600 rounded"
                >
                  Close Metadata
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
