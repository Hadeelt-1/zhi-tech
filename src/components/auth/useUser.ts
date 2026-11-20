"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabase, supabaseConfigured } from "@/lib/supabase/client";

type State = { user: User | null; ready: boolean };

/** Current signed-in user (null when signed out). `ready` is false until the session is known. */
export function useUser() {
  const [state, setState] = useState<State>({ user: null, ready: false });

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setState({ user: data.session?.user ?? null, ready: true });
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setState({ user: session?.user ?? null, ready: true });
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  // Without Supabase settings there is no session to wait for.
  return { user: state.user, ready: supabaseConfigured ? state.ready : true };
}
