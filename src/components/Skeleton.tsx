import React from "react";

/** Single shimmer bar — the building block */
export function SkeletonBar({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-slate-200 rounded-lg animate-pulse ${className}`} />
  );
}

/** Generic shimmer block (any shape) */
export function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-slate-200 animate-pulse ${className}`} />
  );
}

/** Course card skeleton — matches the card layout */
export function SkeletonCourseCard() {
  return (
    <div className="bg-white rounded-[1.5rem] p-5 border border-black/5 shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-2">
          <SkeletonBar className="h-5 w-3/4" />
          <SkeletonBar className="h-3 w-1/2" />
        </div>
        <SkeletonBlock className="w-8 h-8 rounded-full ml-3" />
      </div>
      <div className="flex gap-4">
        <SkeletonBar className="h-8 w-16" />
        <SkeletonBar className="h-8 w-16" />
      </div>
      <div className="flex gap-2">
        <SkeletonBar className="h-5 w-16 rounded-full" />
        <SkeletonBar className="h-5 w-20 rounded-full" />
      </div>
      <div className="mt-auto pt-4 space-y-2">
        <div className="flex justify-between">
          <SkeletonBar className="h-3 w-20" />
          <SkeletonBar className="h-3 w-8" />
        </div>
        <SkeletonBar className="h-2 w-full rounded-full" />
      </div>
    </div>
  );
}

/** Community feed card skeleton */
export function SkeletonFeedCard() {
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm flex flex-col overflow-hidden">
      <div className="h-2 bg-slate-200" />
      <div className="p-5 flex flex-col gap-3">
        <div className="flex gap-2">
          <SkeletonBar className="h-4 w-16 rounded-full" />
          <SkeletonBar className="h-4 w-20 rounded-full" />
        </div>
        <SkeletonBar className="h-5 w-full" />
        <SkeletonBar className="h-5 w-2/3" />
        <SkeletonBar className="h-3 w-full" />
        <SkeletonBar className="h-3 w-3/4" />
        <div className="flex gap-4">
          <SkeletonBar className="h-3 w-20" />
          <SkeletonBar className="h-3 w-20" />
        </div>
        <div className="flex gap-1">
          {[1,2,3,4,5].map(s => <SkeletonBlock key={s} className="w-4 h-4 rounded" />)}
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-black/5">
          <div className="flex items-center gap-2">
            <SkeletonBlock className="w-7 h-7 rounded-full" />
            <div className="space-y-1">
              <SkeletonBar className="h-3 w-24" />
              <SkeletonBar className="h-2 w-16" />
            </div>
          </div>
          <div className="flex gap-2">
            <SkeletonBar className="h-7 w-16 rounded-full" />
            <SkeletonBar className="h-7 w-14 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Profile stat card skeleton */
export function SkeletonStatCard() {
  return (
    <div className="bg-white rounded-2xl p-4 text-center border border-black/5 shadow-sm space-y-2">
      <SkeletonBlock className="w-6 h-6 rounded-full mx-auto" />
      <SkeletonBar className="h-7 w-12 mx-auto" />
      <SkeletonBar className="h-2 w-16 mx-auto rounded-full" />
    </div>
  );
}

/** Progress module skeleton */
export function SkeletonProgressRow() {
  return (
    <div className="bg-white p-5 rounded-xl border border-black/5 shadow-sm flex items-center gap-4">
      <SkeletonBlock className="w-12 h-12 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-3">
        <SkeletonBar className="h-4 w-1/2" />
        <div className="flex items-center gap-3">
          <SkeletonBar className="flex-1 h-1.5 rounded-full" />
          <SkeletonBar className="h-3 w-8" />
        </div>
      </div>
    </div>
  );
}

/** Generic full-page skeleton wrapper (fades in/out) */
export function SkeletonPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-pulse space-y-6 w-full">
      {children}
    </div>
  );
}
