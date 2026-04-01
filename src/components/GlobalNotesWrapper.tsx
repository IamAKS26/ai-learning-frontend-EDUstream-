"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NotesPanel } from "./NotesPanel";
import { useAuth } from "@/context/AuthContext";

export function GlobalNotesWrapper() {
  const pathname = usePathname();
  const { user } = useAuth();
  
  const [courseId, setCourseId] = useState<string | undefined>();
  const [unitId, setUnitId] = useState<string | undefined>();
  
  // Decide whether to show the notes panel
  // Show it everywhere for signed-in users 
  const isModulePage = pathname.startsWith("/module/");
  const isUnitPage = pathname.startsWith("/unit/");
  const showNotes = !!user;

  useEffect(() => {
    if (isModulePage) {
      const parts = pathname.split("/");
      setCourseId(parts[parts.length - 1]);
      setUnitId(undefined);
    } else if (isUnitPage) {
      const parts = pathname.split("/");
      setUnitId(parts[parts.length - 1]);
      setCourseId(undefined); // We might not know the courseId purely from the generic URL
    }
  }, [pathname, isModulePage, isUnitPage]);

  if (!showNotes) return null;

  return <NotesPanel courseId={courseId} unitId={unitId} />;
}
