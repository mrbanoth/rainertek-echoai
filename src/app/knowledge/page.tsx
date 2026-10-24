'use client';

import React, { useState, useRef } from 'react';
import {
  BookOpen,
  UploadCloud,
  FileText,
  FileCode,
  File,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Trash2,
  Edit3,
  ExternalLink,
  X,
  Save,
  Check,
  Eye,
  Plus,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { KnowledgeDoc, DocumentStatus, DocumentFormat, ProjectId } from '@/types';

export default function KnowledgeBasePage() {
  const {
    documents,
    addDocument,
    updateDocument,
    reindexDocument,
    deleteDocument,
    projects,
    selectedProject,
    userRole,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [fileName: string]: number }>({});
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Document Editor Modal State
  const [editingDoc, setEditingDoc] = useState<KnowledgeDoc | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalCategory, setModalCategory] = useState<KnowledgeDoc['category']>('policy');
  const [modalProjectId, setModalProjectId] = useState<ProjectId>('GENERAL');
  const [modalContent, setModalContent] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [hasModalUnsaved, setHasModalUnsaved] = useState(false);

  // Filtered documents
  const filteredDocs = documents.filter((doc) => {
    if (selectedProject !== 'ALL' && doc.projectId !== selectedProject) return false;
    if (categoryFilter !== 'ALL' && doc.category !== categoryFilter) return false;
    if (statusFilter !== 'ALL' && doc.indexingStatus !== statusFilter) return false;
    if (
      searchQuery &&
      !doc.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !doc.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError(null);

    const allowedExtensions = ['pdf', 'md', 'markdown', 'txt'];
    const maxSizeBytes = 25 * 1024 * 1024; // 25MB

    Array.from(files).forEach((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';

      if (!allowedExtensions.includes(ext)) {
        setUploadError(`File "${file.name}" rejected: Only PDF, Markdown (.md), and TXT are supported.`);
        return;
      }

      if (file.size > maxSizeBytes) {
        setUploadError(`File "${file.name}" exceeds 25MB enterprise file size limit.`);
        return;
      }

      // Simulate upload progress
      setUploadProgress((prev) => ({ ...prev, [file.name]: 20 }));

      setTimeout(() => {
        setUploadProgress((prev) => ({ ...prev, [file.name]: 65 }));
      }, 400);

      setTimeout(() => {
        setUploadProgress((prev) => {
          const next = { ...prev };
          delete next[file.name];
          return next;
        });

        const targetProj = selectedProject === 'ALL' ? (projects[0]?.id || 'GENERAL') : selectedProject;
        addDocument({
          title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          fileName: file.name,
          projectId: targetProj,
          category: 'sop',
          version: '1.0',
          format: (ext === 'md' || ext === 'markdown' ? 'markdown' : ext === 'pdf' ? 'pdf' : 'txt') as DocumentFormat,
          sizeBytes: file.size,
          uploader: 'sandeepnaikb0@gmail.com',
          contentSnippet: `Saved from ${file.name}.`,
          rawText: `Sample parsed content from ${file.name}. Indexed for AI assistant retrieval.`,
        });
      }, 900);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  // Open Document Editor Modal
  const openEditor = (doc: KnowledgeDoc) => {
    setEditingDoc(doc);
    setModalTitle(doc.title);
    setModalCategory(doc.category);
    setModalProjectId(doc.projectId);
    setModalContent(doc.rawText || doc.contentSnippet);
    setPreviewMode(false);
    setHasModalUnsaved(false);
  };

  const handleSaveModal = () => {
    if (!editingDoc) return;
    if (userRole === 'Read-only viewer') {
      alert('Read-only viewers cannot edit knowledge documents.');
      return;
    }

    const nextVer = `1.${parseInt(editingDoc.version.split('.')[1] || '0', 10) + 1}`;
    updateDocument(editingDoc.id, {
      title: modalTitle,
      category: modalCategory,
      projectId: modalProjectId,
      rawText: modalContent,
      contentSnippet: modalContent.slice(0, 140) + '...',
      version: nextVer,
      lastUpdated: new Date().toISOString().slice(0, 10),
      indexingStatus: 'indexed',
    });

    setEditingDoc(null);
    setHasModalUnsaved(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#111A2E] border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <BookOpen size={18} className="text-indigo-400" />
              Enterprise Knowledge Base
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-bold">
              DRAG & DROP FIRST
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Strictly grounded company documents. Upload, index, verify chunk status, and inspect source citations.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Total Ingested:</span>
          <span className="font-mono text-white font-bold bg-slate-900 px-2.5 py-1 rounded-md border border-slate-700">
            {documents.length} Docs
          </span>
        </div>
      </div>

      {/* Large Drag and Drop Upload Area (Section 11) */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center relative overflow-hidden ${
          isDragging
            ? 'border-indigo-400 bg-indigo-950/30 ring-4 ring-indigo-500/20'
            : 'border-slate-700 hover:border-slate-500 bg-[#111A2E]/60 hover:bg-[#111A2E]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.md,.markdown,.txt"
          className="hidden"
          onChange={(e) => processFiles(e.target.files)}
        />

        <div className="w-12 h-12 rounded-full bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-3 shadow-md">
          <UploadCloud size={24} />
        </div>

        <h3 className="text-sm font-bold text-white">
          Drag and drop policy documents, SOPs, and handbooks here
        </h3>
        <p className="text-xs text-slate-400 max-w-md mt-1">
          Supports <strong>PDF, Markdown (.md), and TXT</strong> up to 25MB. Files are automatically isolated by project scope.
        </p>

        <div className="flex items-center gap-3 mt-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <CheckCircle2 size={12} className="text-emerald-400" /> Auto-chunking
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <CheckCircle2 size={12} className="text-emerald-400" /> Vector Indexing
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <CheckCircle2 size={12} className="text-emerald-400" /> GxP Traceability
          </span>
        </div>

        {/* Progress or Error Notifications */}
        {Object.keys(uploadProgress).length > 0 && (
          <div className="mt-4 w-full max-w-md space-y-2">
            {Object.entries(uploadProgress).map(([name, pct]) => (
              <div key={name} className="p-2.5 rounded bg-slate-900 border border-slate-700 text-left text-xs">
                <div className="flex justify-between text-slate-300 text-[11px] mb-1">
                  <span className="truncate">{name}</span>
                  <span className="font-mono">{pct}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {uploadError && (
          <div className="mt-3 px-3 py-1.5 rounded bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle size={14} />
            <span>{uploadError}</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, filename..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder:text-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            aria-label="Filter documents by category"
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300 font-medium focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="policy">Policy</option>
            <option value="sop">SOP</option>
            <option value="specifications">Specifications</option>
            <option value="directory">Directory</option>
            <option value="faq">FAQ</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            aria-label="Filter documents by indexing status"
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300 font-medium focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="indexed">Indexed (Searchable)</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed Indexing</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <span className="text-[11px] text-slate-400 font-mono">
          Showing {filteredDocs.length} of {documents.length} records
        </span>
      </div>

      {/* Documents Table */}
      <div className="rounded-xl bg-[#111A2E] border border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#080D1A] text-slate-400 border-b border-slate-800 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Document Title & Filename</th>
                <th className="py-3 px-4">Project Scope</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Size & Chunks</th>
                <th className="py-3 px-4">Indexing Status</th>
                <th className="py-3 px-4">Version</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No documents match your current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded bg-slate-900 border border-slate-700 flex items-center justify-center text-indigo-400 flex-shrink-0">
                          {doc.format === 'pdf' ? (
                            <FileText size={14} className="text-rose-400" />
                          ) : doc.format === 'markdown' ? (
                            <FileCode size={14} className="text-cyan-400" />
                          ) : (
                            <File size={14} className="text-slate-400" />
                          )}
                        </div>
                        <div className="truncate">
                          <span className="font-semibold text-slate-200 block truncate">{doc.title}</span>
                          <span className="text-[10px] font-mono text-slate-500 truncate">{doc.fileName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-indigo-300 font-semibold">
                        {doc.projectId}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] uppercase text-slate-400">
                      {doc.category}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      {(doc.sizeBytes / 1024).toFixed(1)} KB • {doc.chunkCount} chunks
                    </td>
                    <td className="py-3 px-4">
                      {doc.indexingStatus === 'indexed' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                          <CheckCircle2 size={11} /> Indexed
                        </span>
                      ) : doc.indexingStatus === 'processing' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-full animate-pulse">
                          <Clock size={11} /> Processing
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-400 bg-rose-950/80 border border-rose-500/40 px-2 py-0.5 rounded-full">
                          <AlertTriangle size={11} /> Failed
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                      v{doc.version}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditor(doc)}
                          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                          title="View & Edit Document"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => reindexDocument(doc.id)}
                          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-indigo-300 transition-colors"
                          title="Trigger Vector Re-index"
                        >
                          <RefreshCw size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Archive or delete document "${doc.title}"?`)) {
                              deleteDocument(doc.id);
                            }
                          }}
                          className="p-1.5 rounded hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Archive Document"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Editor Modal (Section 11 Requirement) */}
      {editingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-xl bg-[#0F172A] border border-slate-700 shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Edit3 size={16} className="text-indigo-400" />
                  Document Editor & Version Control
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  {editingDoc.fileName} (v{editingDoc.version})
                </span>
              </div>
              <button
                onClick={() => setEditingDoc(null)}
                className="text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Metadata Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Title</label>
                <input
                  type="text"
                  value={modalTitle}
                  onChange={(e) => {
                    setModalTitle(e.target.value);
                    setHasModalUnsaved(true);
                  }}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <select
                  value={modalCategory}
                  onChange={(e) => {
                    setModalCategory(e.target.value as any);
                    setHasModalUnsaved(true);
                  }}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                >
                  <option value="policy">Policy</option>
                  <option value="sop">SOP</option>
                  <option value="specifications">Specifications</option>
                  <option value="directory">Directory</option>
                  <option value="faq">FAQ</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Project Assignment</label>
                <select
                  value={modalProjectId}
                  onChange={(e) => {
                    setModalProjectId(e.target.value as any);
                    setHasModalUnsaved(true);
                  }}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} — {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Content Editor / Preview Toggle */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-slate-300 font-semibold">
                  Document Content (Markdown / Text)
                </label>
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  <Eye size={12} />
                  {previewMode ? 'Switch to Edit' : 'Preview Render'}
                </button>
              </div>

              {previewMode ? (
                <div className="w-full h-48 p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 overflow-y-auto font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                  {modalContent}
                </div>
              ) : (
                <textarea
                  rows={7}
                  value={modalContent}
                  onChange={(e) => {
                    setModalContent(e.target.value);
                    setHasModalUnsaved(true);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div className="text-[11px] text-slate-500">
                Saving will generate version <strong>1.{parseInt(editingDoc.version.split('.')[1] || '0', 10) + 1}</strong> and trigger re-indexing.
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingDoc(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveModal}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
                >
                  <Save size={13} />
                  Save & Re-Index
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
