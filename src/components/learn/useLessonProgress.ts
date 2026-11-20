"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { useUser } from "@/components/auth/useUser";

export type Progress = { best: number; attempts: number };
type Loaded = { owner: string; rows: Record<string, Progress> };

/** The signed-in user's lesson results (RLS returns only their own rows). */
export function useLessonProgress() {
  const { user, ready } = useUser();
  const userId = user?.id ?? null;
  const [data, setData] = useState<Loaded | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    if (!userId || !supabase) return;
    let active = true;
    supabase
      .from("lesson_progress")
      .select("lesson_slug, best_score, attempts")
      .then(({ data: rows }) => {
        if (!active) return;
        const map: Record<string, Progress> = {};
        (rows ?? []).forEach((r: { lesson_slug: string; best_score: number; attempts: number }) => {
          map[r.lesson_slug] = { best: r.best_score, attempts: r.attempts };
        });
        setData({ owner: userId, rows: map });
      });
    return () => {
      active = false;
    };
  }, [userId]);

  const rows = useMemo<Record<string, Progress>>(() => (userId && data?.owner === userId ? data.rows : {}), [userId, data]);

  /** Saves a result, keeping the best score. Returns false if it could not be saved. */
  const save = useCallback(
    async (lesson: string, score: number) => {
      const supabase = getSupabase();
      if (!supabase || !userId) return false;
      const prev = rows[lesson];
      const next = { best: Math.max(prev?.best ?? 0, score), attempts: (prev?.attempts ?? 0) + 1 };
      const { error } = await supabase.from("lesson_progress").upsert(
        { lesson_slug: lesson, best_score: next.best, attempts: next.attempts, updated_at: new Date().toISOString() },
        { onConflict: "user_id,lesson_slug" },
      );
      if (error) return false;
      setData((d) => ({ owner: userId, rows: { ...(d?.owner === userId ? d.rows : {}), [lesson]: next } }));
      return true;
    },
    [rows, userId],
  );

  return { user, ready, rows, save };
}
