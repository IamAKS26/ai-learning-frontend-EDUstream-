"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import apiClient from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";

interface Note {
  _id: string; // Mongo ID if synced, local timestamp if not
  content: string;
  courseId?: string;
  moduleId?: string;
  unitId?: string;
  updatedAt: string;
  isSynced?: boolean;
}

interface Props {
  courseId?: string;
  moduleId?: string;
  unitId?: string;
}

export function NotesPanel({ courseId, moduleId, unitId }: Props) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false); // New state for wider editor
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [draftContent, setDraftContent] = useState("");
  const [isPreview, setIsPreview] = useState(false); // Markdown preview toggle
  
  const [saving, setSaving] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "offline">("synced");
  const [loading, setLoading] = useState(true);
  
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Read notes from backend & merge with localStorage
  const fetchNotes = useCallback(async () => {
    if (typeof window === "undefined") return;
    setLoading(true);
    let allNotes: Note[] = [];
    
    // 1. Local Notes
    try {
      const stored = localStorage.getItem("edustream-notes");
      if (stored) {
        allNotes = JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to parse local notes", e);
    }

    // 2. Cloud Notes (if logged in)
    if (user) {
      try {
        let url = `/notes?`;
        if (courseId) url += `courseId=${courseId}&`;
        if (moduleId) url += `moduleId=${moduleId}&`;
        if (unitId) url += `unitId=${unitId}`;
        
        const res = await apiClient.get(url);
        const cloudNotes: Note[] = res.data;
        
        // Merge: keep cloud notes, and add local notes that aren't in cloud yet
        const cloudIds = new Set(cloudNotes.map(n => n._id));
        const unsyncedLocal = allNotes.filter(n => !cloudIds.has(n._id) && (!n.isSynced));
        
        allNotes = [...cloudNotes, ...unsyncedLocal];
        
        // Update local storage with merged list
        localStorage.setItem("edustream-notes", JSON.stringify(allNotes));
      } catch (err) {
        console.error("Failed to fetch cloud notes", err);
        setSyncStatus("offline");
      }
    }

    // Filter for current context
    const filtered = allNotes.filter(n => {
      // If we are in a unit, show unit notes
      if (unitId && n.unitId === unitId) return true;
      // If we are in a module, show module notes
      if (!unitId && moduleId && n.moduleId === moduleId) return true;
      // If we are in a course overview, show course notes
      if (!unitId && !moduleId && courseId && n.courseId === courseId) return true;
      // Else show everything related to this course if we just want global notes, but let's stick to exact match for simplicity
      return false;
    }).sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    setNotes(filtered);
    setLoading(false);
  }, [courseId, moduleId, unitId, user]);

  useEffect(() => {
    if (isOpen) fetchNotes();
  }, [isOpen, fetchNotes]);

  // Listen for video timestamp events
  useEffect(() => {
    const handleTimestamp = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { timeSpent } = customEvent.detail;
      const formattedTime = `${Math.floor(timeSpent / 60)}:${String(timeSpent % 60).padStart(2, "0")}`;
      const stamp = `\n\n**[Video Timestamp: ${formattedTime}]** `;
      
      setIsOpen(true);

      if (activeNote) {
        handleContentChange(draftContent + stamp);
      } else {
        const newNote: Note = {
          _id: Date.now().toString(),
          content: stamp,
          courseId,
          moduleId,
          unitId,
          updatedAt: new Date().toISOString(),
          isSynced: false
        };
        setNotes(prev => [newNote, ...prev]);
        openNote(newNote);
        try {
          const stored = localStorage.getItem("edustream-notes");
          const allNotes: Note[] = stored ? JSON.parse(stored) : [];
          allNotes.push(newNote);
          localStorage.setItem("edustream-notes", JSON.stringify(allNotes));
        } catch (err) {}
      }
    };

    window.addEventListener("note-timestamp", handleTimestamp);
    return () => window.removeEventListener("note-timestamp", handleTimestamp);
  }, [activeNote, draftContent, courseId, moduleId, unitId]);

  // Sync to Backend
  const syncToBackend = async (notesToSync: Note[]) => {
    if (!user || notesToSync.length === 0) return;
    setSyncStatus("syncing");
    try {
      const res = await apiClient.post("/notes/sync", { notes: notesToSync });
      const syncedNotes: Note[] = res.data;
      
      // Update local storage to mark as synced and potentially use new Mongo IDs
      const stored = localStorage.getItem("edustream-notes");
      if (stored) {
        let allLocal: Note[] = JSON.parse(stored);
        
        // For each synced note, update the local copy
        syncedNotes.forEach(sn => {
           // We match by content/updatedAt or if we kept the old ID in metadata... 
           // For simplicity, we just mark all currently passed notes as synced locally too.
           // A more robust way is replacing the local ones with the backend response.
           const idx = allLocal.findIndex(l => l._id === sn._id || (l.content === sn.content));
           if (idx !== -1) {
             allLocal[idx] = { ...sn, isSynced: true };
           } else {
             allLocal.push({ ...sn, isSynced: true });
           }
        });
        localStorage.setItem("edustream-notes", JSON.stringify(allLocal));
        setSyncStatus("synced");
        // Update component state if we are currently looking at them
        // fetchNotes(); // could refetch to get clean state
      }
    } catch (err) {
      console.error("Sync failed", err);
      setSyncStatus("offline");
    }
  };

  const openNote = (note: Note) => {
    setActiveNote(note);
    setDraftContent(note.content);
    setIsPreview(false);
  };

  const createNote = () => {
    const newNote: Note = {
      _id: Date.now().toString(), // local id
      content: "New note...",
      courseId,
      moduleId,
      unitId,
      updatedAt: new Date().toISOString(),
      isSynced: false
    };
    
    setNotes(prev => [newNote, ...prev]);
    openNote(newNote);
    
    try {
      const stored = localStorage.getItem("edustream-notes");
      const allNotes: Note[] = stored ? JSON.parse(stored) : [];
      allNotes.push(newNote);
      localStorage.setItem("edustream-notes", JSON.stringify(allNotes));
    } catch (e) {}
  };

  const handleContentChange = (val: string) => {
    setDraftContent(val);
    if (!activeNote) return;
    
    if (saveTimer.current) clearTimeout(saveTimer.current);
    
    saveTimer.current = setTimeout(() => {
      setSaving(true);
      const updatedNote = { ...activeNote, content: val, updatedAt: new Date().toISOString(), isSynced: false };
      
      setNotes(prev => prev.map(n => n._id === activeNote._id ? updatedNote : n));
      setActiveNote(updatedNote);
      
      try {
        const stored = localStorage.getItem("edustream-notes");
        if (stored) {
          let allNotes: Note[] = JSON.parse(stored);
          const idx = allNotes.findIndex(n => n._id === activeNote._id);
          if (idx !== -1) allNotes[idx] = updatedNote;
          else allNotes.push(updatedNote);
          localStorage.setItem("edustream-notes", JSON.stringify(allNotes));
        }
      } catch (e) {}
      
      setSaving(false);

      // Trigger debounced cloud sync
      if (syncTimer.current) clearTimeout(syncTimer.current);
      syncTimer.current = setTimeout(() => {
        syncToBackend([updatedNote]);
      }, 3000); // sync 3s after typing stops

    }, 500); // active save debounce
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Remove locally fast
    setNotes(prev => prev.filter(n => n._id !== id));
    if (activeNote?._id === id) {
      setActiveNote(null);
      setDraftContent("");
    }
    
    try {
      const stored = localStorage.getItem("edustream-notes");
      if (stored) {
        let allNotes: Note[] = JSON.parse(stored);
        allNotes = allNotes.filter(n => n._id !== id);
        localStorage.setItem("edustream-notes", JSON.stringify(allNotes));
      }
    } catch(e) {}

    // Delete from cloud if it has a mongo ID
    if (id.length === 24 && user) {
      try {
        await apiClient.delete(`/notes/${id}`);
      } catch (err) {
        console.error("Failed to delete from cloud", err);
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
      {/* Expand Panel */}
      <AnimatePresence>
      {isOpen && (
        <motion.div
          drag
          dragMomentum={false}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className={`glass-card rounded-2xl border border-black/5 flex flex-col shadow-2xl bg-white/95 backdrop-blur-xl ${isMaximized ? 'w-[600px] h-[600px]' : 'w-80 h-[480px]'} transition-all duration-300 ease-in-out`}
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-black/5 bg-slate-50 rounded-t-2xl cursor-grab active:cursor-grabbing">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">edit_note</span>
              <span className="text-sm font-bold text-slate-900">
                {unitId ? "Unit Notes" : moduleId ? "Module Notes" : "Course Notes"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setIsMaximized(!isMaximized)} className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-white transition-colors" title="Toggle Size">
                <span className="material-symbols-outlined text-[18px]">{isMaximized ? "close_fullscreen" : "open_in_full"}</span>
              </button>
              <button onClick={createNote} title="New note" className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[18px]">minimize</span>
              </button>
            </div>
          </div>

          {/* Body: list or editor */}
          {activeNote ? (
            <div className="flex-1 flex flex-col bg-[#1a1a1a]/50">
              {/* Editor Toolbar */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-black/5 bg-slate-50">
                <div className="flex items-center gap-2">
                  <button onClick={() => { setActiveNote(null); setDraftContent(""); }} className="text-xs text-slate-500 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-slate-100">
                    <span className="material-symbols-outlined text-sm">arrow_back</span> All
                  </button>
                  <div className="h-4 w-px bg-slate-100"></div>
                  <button onClick={() => setIsPreview(!isPreview)} className={`text-xs px-2 py-1 rounded ${!isPreview ? 'bg-primary/20 text-primary' : 'text-slate-500 hover:text-white'}`}>
                    Write
                  </button>
                  <button onClick={() => setIsPreview(!isPreview)} className={`text-xs px-2 py-1 rounded ${isPreview ? 'bg-primary/20 text-primary' : 'text-slate-500 hover:text-white'}`}>
                    Preview
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${syncStatus === 'synced' ? 'text-green-500' : syncStatus === 'syncing' ? 'text-primary' : 'text-slate-500'}`}>
                    {saving ? "Saving..." : syncStatus === 'synced' ? "Cloud Synced" : syncStatus === 'syncing' ? "Syncing..." : "Local Only"}
                  </span>
                </div>
              </div>
              
              {isPreview ? (
                 <div className="flex-1 overflow-auto p-4 text-sm text-slate-700 markdown-body prose prose-invert max-w-none prose-sm">
                    {draftContent ? (
                       <ReactMarkdown remarkPlugins={[remarkGfm]}>
                         {draftContent}
                       </ReactMarkdown>
                    ) : (
                       <p className="text-slate-500 italic">Nothing to preview...</p>
                    )}
                 </div>
              ) : (
                <textarea
                  autoFocus
                  value={draftContent}
                  onChange={e => handleContentChange(e.target.value)}
                  placeholder="Write in Markdown (e.g. # Header, * bold *)..."
                  className="flex-1 bg-transparent p-4 text-sm text-slate-200 outline-none resize-none leading-relaxed placeholder:text-slate-600 focus:ring-0 font-mono"
                />
              )}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-3 space-y-2 relative">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              {!loading && notes.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4 opacity-50">
                  <span className="material-symbols-outlined text-4xl text-slate-500">edit_document</span>
                  <p className="text-xs text-slate-500 max-w-[200px]">Create an interactive note here. Supports Markdown!</p>
                  <button onClick={createNote} className="mt-2 px-4 py-2 bg-primary/20 text-primary font-bold rounded-lg text-sm transition-colors hover:bg-primary/30">
                    Create Note
                  </button>
                </div>
              )}
              {notes.map(note => (
                <div
                  key={note._id}
                  className="group flex flex-col p-3 rounded-xl bg-slate-50 hover:bg-slate-200 cursor-pointer transition-colors border border-transparent hover:border-white/10 shadow-sm gap-2"
                  onClick={() => openNote(note)}
                >
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm text-slate-700 font-medium line-clamp-2 leading-relaxed">
                      {note.content || "Empty note"}
                    </p>
                    <button onClick={e => handleDelete(note._id, e)} className="p-1 opacity-0 group-hover:opacity-100 text-slate-500 hover:bg-red-500/10 hover:text-red-400 rounded-md transition-all flex-shrink-0">
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                      {new Date(note.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                    {note.isSynced && (
                      <span className="material-symbols-outlined text-[12px] text-green-500/50" title="Synced to cloud">cloud_done</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
      </AnimatePresence>

      {/* FAB Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all bg-primary text-slate-900 shadow-[0_4px_20px_rgba(255,179,0,0.4)] hover:scale-105 hover:bg-primary/95 group"
            title="Open Notes"
          >
            <span className="material-symbols-outlined text-2xl group-hover:-rotate-12 transition-transform">
              edit_note
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
