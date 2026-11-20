"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { useUser } from "@/components/auth/useUser";
import { nextReview, type ReviewRow } from "@/lib/review";

type Loaded = { owner: string; rows: Record<string, ReviewRow>; failed: boolean };

/** The signed-in user's review schedule, keyed by term slug. RLS returns only their own rows. */
export function useReviewSchedule() {
  const { user, ready } = useUser();
  const userId = user?.id ?? null;
  const [data, setData] = useState<Loaded | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    if (!userId || !supabase) return;
    let active = true;
    supabase
      .from("review_schedule")
      .select("term_slug, box, due_on, correct_count, wrong_count")
      .then(({ data: list, error }) => {
        if (!active) return;
        const rows: Record<string, ReviewRow> = {};
        (list ?? []).forEach((r: ReviewRow) => {
          rows[r.term_slug] = r;
        });
        setData({ owner: userId, rows, failed: Boolean(error) });
      });
    return () => {
      active = false;
    };
  }, [userId]);

  const current = userId && data?.owner === userId ? data : null;
  const rows = useMemo<Record<string, ReviewRow>>(() => current?.rows ?? {}, [current]);
  const loaded = ready && (!userId || current !== null);

  /** Saves a finished round in one request. Returns false if it could not be saved. */
  const saveRound = useCallback(
    async (results: { slug: string; ok: boolean }[], today: string) => {
      const supabase = getSupabase();
      if (!supabase || !userId || results.length === 0) return false;
      const updated: Record<string, ReviewRow> = {};
      results.forEach(({ slug, ok }) => {
        updated[slug] = nextReview(updated[slug] ?? rows[slug], slug, ok, today);
      });
      const now = new Date().toISOString();
      const { error } = await supabase
        .from("review_schedule")
        .upsert(Object.values(updated).map((r) => ({ ...r, last_reviewed_at: now })), { onConflict: "user_id,term_slug" });
      if (error) return false;
      setData((d) => (d && d.owner === userId ? { ...d, rows: { ...d.rows, ...updated } } : d));
      return true;
    },
    [rows, userId],
  );

  return { user, ready, loaded, rows, loadFailed: Boolean(current?.failed), saveRound };
}
