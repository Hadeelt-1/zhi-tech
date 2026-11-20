"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { useUser } from "./useUser";

type Loaded = { owner: string; slugs: string[]; failed: boolean };

/** The signed-in user's saved tool slugs, newest first. RLS returns only their own rows. */
export function useFavorites() {
  const { user, ready } = useUser();
  const userId = user?.id ?? null;
  const [data, setData] = useState<Loaded | null>(null);
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    if (!userId || !supabase) return;
    let active = true;
    supabase
      .from("favorites")
      .select("tool_slug")
      .order("created_at", { ascending: false })
      .then(({ data: rows, error }) => {
        if (!active) return;
        setData({ owner: userId, slugs: (rows ?? []).map((r: { tool_slug: string }) => r.tool_slug), failed: Boolean(error) });
      });
    return () => {
      active = false;
    };
  }, [userId]);

  // Ignore data that belongs to a previous account on this device.
  const current = userId && data?.owner === userId ? data : null;
  const slugs = useMemo(() => current?.slugs ?? [], [current]);
  const loaded = ready && (!userId || current !== null);

  const toggle = useCallback(
    async (slug: string) => {
      const supabase = getSupabase();
      if (!supabase || !userId) return false;
      const saved = slugs.includes(slug);
      const apply = (add: boolean) =>
        setData((d) =>
          d && d.owner === userId
            ? { ...d, slugs: add ? [slug, ...d.slugs.filter((x) => x !== slug)] : d.slugs.filter((x) => x !== slug) }
            : d,
        );
      // Update the screen first, undo if the database refuses.
      apply(!saved);
      const { error } = saved
        ? await supabase.from("favorites").delete().eq("tool_slug", slug)
        : await supabase.from("favorites").insert({ tool_slug: slug });
      if (error) apply(saved);
      setSaveFailed(Boolean(error));
      return !error;
    },
    [slugs, userId],
  );

  return { user, ready, slugs, loaded, error: Boolean(current?.failed) || saveFailed, toggle };
}
