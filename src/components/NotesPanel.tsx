"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";

interface Note {
  _id: string; // using timestamp as id
  content: string;
  moduleId: string;
  unitId?: string;
  updatedAt: string;
}

interface Props {
  moduleId: string;
  unitId?: string;
}

export function NotesPanel({ moduleId, unitId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [draftContent, setDraftContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Read notes from localStorage
  const fetchNotes = useCallback(() => {
    if (typeof window === "undefined" || !moduleId) return;
    setLoading(true);
    try {
      const stored = localStorage.getItem("edustream-notes");
      if (stored) {
        const allNotes: Note[] = JSON.parse(stored);
        const moduleNotes = allNotes.filter(n => n.moduleId === moduleId).sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        setNotes(moduleNotes);
      }
    } catch (e) {
      console.error("Failed to parse notes", e);
    } finally {
      setLoading(false);
    }
  }, [moduleId]);

  useEffect(() => {
    if (isOpen) fetchNotes();
  }, [isOpen, fetchNotes]);

  // Open a note for editing
  const openNote = (note: Note) => {
    setActiveNote(note);
    setDraftContent(note.content);
  };

  // Create a new blank note
  const createNote = () => {
    const newNote: Note = {
      _id: Date.now().toString(),
      content: "New note...",
      moduleId,
      unitId: unitId || undefined,
      updatedAt: new Date().toISOString()
    };
    
    // update state
    setNotes(prev => [newNote, ...prev]);
    openNote(newNote);
    
    // update localStorage
    try {
      const stored = localStorage.getItem("edustream-notes");
      const allNotes: Note[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem("edustream-notes", JSON.stringify([newNote, ...allNotes]));
    } catch (e) { console.error(e); }
  };

  // Autosave with debounce
  const handleContentChange = (val: string) => {
    setDraftContent(val);
    if (!activeNote) return;
    
    if (saveTimer.current) clearTimeout(saveTimer.current);
    
    saveTimer.current = setTimeout(() => {
      setSaving(true);
      
      const updatedNote = { ...activeNote, content: val, updatedAt: new Date().toISOString() };
      
      // Update local state for panel list
      setNotes(prev => prev.map(n => n._id === activeNote._id ? updatedNote : n));
      setActiveNote(updatedNote); // update active ref too
      
      // Update localStorage
      try {
        const stored = localStorage.getItem("edustream-notes");
        if (stored) {
          let allNotes: Note[] = JSON.parse(stored);
          allNotes = allNotes.map(n => n._id === activeNote._id ? updatedNote : n);
          localStorage.setItem("edustream-notes", JSON.stringify(allNotes));
        }
      } catch (e) { console.error(e); }
      
      setTimeout(() => setSaving(false), 300); // Visual feedback only
    }, 1000);
  };

  // Delete a note
  const deleteNote = (id: string) => {
    // update state
    setNotes(prev => prev.filter(n => n._id !== id));
    if (activeNote?._id === id) {
      setActiveNote(null);
      setDraftContent("");
    }
    
    // update localStorage
    try {
      const stored = localStorage.getItem("edustream-notes");
      if (stored) {
        let allNotes: Note[] = JSON.parse(stored);
        allNotes = allNotes.filter(n => n._id !== id);
        localStorage.setItem("edustream-notes", JSON.stringify(allNotes));
      }
    } catch(e) { console.error(e); }
  };

  return (
    <motion.div 
      drag 
      dragMomentum={false}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 cursor-grab active:cursor-grabbing"
    >
      {/* Expand Panel */}
      {isOpen && (
        <div
          className="w-80 h-[480px] glass-card rounded-2xl border border-white/10 flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.5)] bg-[#121212]/95 backdrop-blur-xl animate-in slide-in-from-bottom-4 cursor-default"
          style={{ animation: "slideUp 0.2s ease-out" }}
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5 rounded-t-2xl cursor-grab active:cursor-grabbing">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">drag_indicator</span>
              <span className="text-sm font-bold text-white">Local Notes</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={createNote}
                title="New note"
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-lg">add</span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
          </div>

          {/* Body: list or editor */}
          {activeNote ? (
            <div className="flex-1 flex flex-col bg-[#1a1a1a]/50">
              {/* Editor Toolbar */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 bg-black/20">
                <button
                  onClick={() => { setActiveNote(null); setDraftContent(""); }}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-white/5"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span> All
                </button>
                <span className={`text-xs ${saving ? 'text-primary' : 'text-slate-500'} font-medium px-2`}>
                  {saving ? "Saving locally..." : "Saved to device"}
                </span>
              </div>
              <textarea
                autoFocus
                value={draftContent}
                onChange={e => handleContentChange(e.target.value)}
                placeholder="Write your notes here..."
                className="flex-1 bg-transparent p-4 text-sm text-slate-200 outline-none resize-none leading-relaxed placeholder:text-slate-600 focus:ring-0"
              />
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
                  <p className="text-xs text-slate-400 max-w-[200px]">Notes are saved private to your local browser storage.</p>
                </div>
              )}
              {notes.map(note => (
                <div
                  key={note._id}
                  className="group flex items-start justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors border border-transparent hover:border-white/10 shadow-sm"
                  onClick={() => openNote(note)}
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-sm text-slate-300 truncate font-medium">
                      {note.content || "Empty note"}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1 font-mono uppercase tracking-wider">
                      {new Date(note.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); deleteNote(note._id); }}
                    className="p-1.5 opacity-0 group-hover:opacity-100 text-slate-500 hover:bg-red-500/10 hover:text-red-400 rounded-md transition-all self-center"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FAB Toggle Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
          isOpen
            ? "bg-[#2a2a2a] border border-white/10 text-white"
            : "bg-primary text-background-dark shadow-[0_4px_20px_rgba(255,179,0,0.4)] hover:scale-105 hover:bg-primary/95"
        }`}
        title="Toggle device notes"
      >
        <span className="material-symbols-outlined text-2xl">
          {isOpen ? "close" : "edit_note"}
        </span>
      </button>
    </motion.div>
  );
}
