"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { useUser } from "@/components/auth/useUser";

export type DictEntry = {
  id: number;
  term_slug: string | null;
  zh: string | null;
  pinyin: string | null;
  meaning: string | null;
  note: string | null;
  created_at: string;
};
export type OwnWord = { zh: string; pinyin: string; meaning: string; note: string };

type Loaded = { owner: string; entries: DictEntry[]; failed: boolean };
const COLS = "id, term_slug, zh, pinyin, meaning, note, created_at";

/** The signed-in user's personal dictionary, newest first. RLS returns only their own rows. */
export function usePersonalDictionary() {
  const { user, ready } = useUser();
  const userId = user?.id ?? null;
  const [data, setData] = useState<Loaded | null>(null);
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    if (!userId || !supabase) return;
    let active = true;
    supabase
      .from("personal_dictionary")
      .select(COLS)
      .order("created_at", { ascending: false })
      .limit(2000)
      .then(({ data: rows, error }) => {
        if (!active) return;
        setData({ owner: userId, entries: (rows ?? []) as DictEntry[], failed: Boolean(error) });
      });
    return () => {
      active = false;
    };
  }, [userId]);

  // Ignore data that belongs to a previous account on this device.
  const current = userId && data?.owner === userId ? data : null;
  const entries = useMemo(() => current?.entries ?? [], [current]);
  const savedSlugs = useMemo(() => new Set(entries.flatMap((e) => (e.term_slug ? [e.term_slug] : []))), [entries]);
  const loaded = ready && (!userId || current !== null);

  const update = useCallback(
    (fn: (list: DictEntry[]) => DictEntry[]) =>
      setData((d) => (d && d.owner === userId ? { ...d, entries: fn(d.entries) } : d)),
    [userId],
  );

  /** Save a library term, or remove it if it is already saved. */
  const toggleTerm = useCallback(
    async (slug: string) => {
      const supabase = getSupabase();
      if (!supabase || !userId) return false;
      if (savedSlugs.has(slug)) {
        const removed = entries.filter((e) => e.term_slug === slug);
        update((list) => list.filter((e) => e.term_slug !== slug));
        const { error } = await supabase.from("personal_dictionary").delete().eq("term_slug", slug);
        if (error) update((list) => [...removed, ...list]);
        setSaveFailed(Boolean(error));
        return !error;
      }
      const { data: row, error } = await supabase.from("personal_dictionary").insert({ term_slug: slug }).select(COLS).single();
      // 23505 = already saved (for example from another tab): treat it as saved.
      const ok = !error || error.code === "23505";
      if (row) update((list) => [row as DictEntry, ...list]);
      else if (ok) update((list) => [{ id: -Date.now(), term_slug: slug, zh: null, pinyin: null, meaning: null, note: null, created_at: new Date().toISOString() }, ...list]);
      setSaveFailed(!ok);
      return ok;
    },
    [entries, savedSlugs, update, userId],
  );

  /** Add a word the user typed in. */
  const addOwn = useCallback(
    async (w: OwnWord) => {
      const supabase = getSupabase();
      if (!supabase || !userId) return false;
      const { data: row, error } = await supabase
        .from("personal_dictionary")
        .insert({ zh: w.zh, meaning: w.meaning, pinyin: w.pinyin || null, note: w.note || null })
        .select(COLS)
        .single();
      if (row) update((list) => [row as DictEntry, ...list]);
      setSaveFailed(Boolean(error));
      return !error;
    },
    [update, userId],
  );

  const remove = useCallback(
    async (id: number) => {
      const supabase = getSupabase();
      if (!supabase || !userId) return false;
      const removed = entries.filter((e) => e.id === id);
      update((list) => list.filter((e) => e.id !== id));
      const { error } = await supabase.from("personal_dictionary").delete().eq("id", id);
      if (error) update((list) => [...removed, ...list]);
      setSaveFailed(Boolean(error));
      return !error;
    },
    [entries, update, userId],
  );

  return {
    user,
    ready,
    loaded,
    entries,
    savedSlugs,
    loadFailed: Boolean(current?.failed),
    saveFailed,
    toggleTerm,
    addOwn,
    remove,
  };
}
