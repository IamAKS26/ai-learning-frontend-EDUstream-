"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";

interface Note {
  _id: string;
  content: string;
  moduleId: string;
  unitId?: string;
  updatedAt: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftContent, setDraftContent] = useState("");
  const [saving, setSaving] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchNotes = useCallback(() => {
    setLoading(true);
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("edustream-notes");
        if (stored) {
          const allNotes: Note[] = JSON.parse(stored);
          setNotes(allNotes.sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
        }
      }
    } catch(e) { console.error(e); } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const startEdit = (note: Note) => {
    setEditingId(note._id);
    setDraftContent(note.content);
  };

  const handleEditChange = (val: string) => {
    setDraftContent(val);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    
    setSaving(true);
    saveTimer.current = setTimeout(() => {
      const active = notes.find(n => n._id === editingId);
      if(!active) return;
      
      const updatedNote = { ...active, content: val, updatedAt: new Date().toISOString() };
      
      // Update state
      let updatedNotesList = notes.map(n => n._id === editingId ? updatedNote : n);
      setNotes(updatedNotesList);
      
      // Update localStorage
      try {
        localStorage.setItem("edustream-notes", JSON.stringify(updatedNotesList));
      } catch(e) { console.error(e); }
      
      setTimeout(() => setSaving(false), 300);
    }, 1000);
  };

  const deleteNote = (id: string) => {
    let newNotes = notes.filter(n => n._id !== id);
    setNotes(newNotes);
    if (editingId === id) { setEditingId(null); setDraftContent(""); }
    
    try {
      localStorage.setItem("edustream-notes", JSON.stringify(newNotes));
    } catch(e) { console.error(e); }
  };

  // Group by moduleId
  const grouped: Record<string, Note[]> = {};
  notes.forEach(note => {
    const key = String(note.moduleId || "global");
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(note);
  });

  const handleCreateNote = () => {
    const newNote: Note = {
      _id: Date.now().toString(),
      content: "",
      moduleId: "global",
      updatedAt: new Date().toISOString()
    };
    
    const newNotesList = [newNote, ...notes];
    setNotes(newNotesList);
    setEditingId(newNote._id);
    setDraftContent("");

    try {
      localStorage.setItem("edustream-notes", JSON.stringify(newNotesList));
    } catch(e) { console.error(e); }
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shadow-[0_0_15px_rgba(255,179,0,0.1)]">
              <span className="material-symbols-outlined text-primary text-2xl">sd_storage</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display tracking-tight text-slate-900 mb-1">Local Device Notes</h1>
              <p className="text-sm text-slate-500">{notes.length} note{notes.length !== 1 ? "s" : ""} saved privately on this browser</p>
            </div>
          </div>
          <button 
            onClick={handleCreateNote} 
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-slate-900 font-bold rounded-lg hover:bg-primary/90 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Create Note
          </button>
        </div>

      {loading && (
        <div className="text-center py-20 text-slate-500 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4" />
          <p className="font-medium animate-pulse text-primary/80">Accessing local storage…</p>
        </div>
      )}

      {!loading && notes.length === 0 && (
        <div className="glass-card rounded-2xl p-16 text-center border-dashed border-black/10 bg-slate-50 shadow-inner">
          <span className="material-symbols-outlined text-6xl text-slate-600 block mb-6 animate-bounce opacity-50">note_stack_add</span>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Your notebook is empty</h2>
          <p className="text-base text-slate-500 max-w-sm mx-auto leading-relaxed">Open any lesson, knowledge check, or video module and click the floating <strong className="text-primary font-bold mx-1">✏️ icon</strong> to start saving notes locally.</p>
        </div>
      )}

      {/* Grouped notes */}
      <div className="space-y-10">
        {Object.entries(grouped).map(([moduleId, moduleNotes]) => (
          <div key={moduleId} className="animate-in slide-in-from-bottom-4 fade-in">
            <div className="flex items-center gap-3 mb-4 pl-1">
              <span className="material-symbols-outlined text-primary text-lg">{moduleId === "global" ? "public" : "folder_special"}</span>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                {moduleId === "global" ? "General Notes" : (
                   <>Module <span className="text-slate-500 font-mono lowercase tracking-normal bg-slate-50 py-1 px-2 rounded-md ml-2 border border-black/5">{moduleId.slice(-8)}</span></>
                )}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {moduleNotes.map(note => (
                <div key={note._id} className="glass-card rounded-xl p-5 border border-black/5 hover:border-primary/20 transition-all shadow-sm bg-white group flex flex-col h-full">
                  {editingId === note._id ? (
                    <div className="flex flex-col h-full flex-1">
                      <div className="flex items-center justify-between mb-3 border-b border-black/5 pb-2">
                        <span className={`text-xs font-medium flex items-center gap-1.5 ${saving ? 'text-primary' : 'text-green-500'}`}>
                           <span className="relative flex h-2 w-2">
                             {saving && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>}
                             <span className={`relative inline-flex rounded-full h-2 w-2 ${saving ? 'bg-primary' : 'bg-green-500'}`}></span>
                           </span>
                          {saving ? "Saving to device…" : "Saved locally"}
                        </span>
                        <button onClick={() => setEditingId(null)} className="text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors">Done</button>
                      </div>
                      <textarea
                        autoFocus
                        value={draftContent}
                        onChange={e => handleEditChange(e.target.value)}
                        className="w-full h-full min-h-[120px] bg-slate-50 border border-black/5 rounded-xl p-4 text-sm text-slate-900 outline-none resize-none focus:border-primary/40 focus:bg-white transition-all leading-relaxed placeholder:text-slate-400"
                        placeholder="Write something brilliant..."
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col h-full flex-1 cursor-text" onClick={() => startEdit(note)}>
                      <p className="text-sm text-slate-700 leading-relaxed flex-1 whitespace-pre-wrap">{note.content}</p>
                      
                      <div className="flex items-end justify-between mt-4 pt-4 border-t border-black/5 opacity-60 group-hover:opacity-100 transition-opacity">
                        <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase flex items-center gap-1">
                          <span className="material-symbols-outlined text-[10px]">schedule</span>
                          {new Date(note.updatedAt).toLocaleString(undefined, {month:'short', day:'numeric', hour:'numeric', minute:'2-digit'})}
                        </p>
                        <div className="flex gap-1.5">
                          <button
                            onClick={(e) => { e.stopPropagation(); startEdit(note); }}
                            className="p-1.5 rounded-md text-slate-400 hover:bg-primary/10 hover:text-primary transition-colors"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteNote(note._id); }}
                            className="p-1.5 rounded-md text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      </div>
    </DashboardLayout>
  );
}
