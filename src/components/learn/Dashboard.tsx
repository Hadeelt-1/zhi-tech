"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { LESSONS } from "@/content/lessons";
import { getSupabase, supabaseConfigured } from "@/lib/supabase/client";
import { computeStats, currentWeek, localDay, PASS_SCORE, type BadgeKey } from "@/lib/learning-stats";
import { fmt } from "@/lib/text";
import { useFavorites } from "@/components/auth/useFavorites";
import { useLessonProgress } from "./useLessonProgress";

type Settings = { daily: number; weekly: number; days: number[] };
const DEFAULTS: Settings = { daily: 1, weekly: 5, days: [0, 1, 2, 3, 4] };
const BADGES: BadgeKey[] = ["firstLesson", "perfect", "halfway", "allLessons", "explorer", "persistent", "streak3"];
type Loaded = { owner: string; activity: string[]; settings: Settings; failed: boolean };

function Meter({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="bar" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} style={{ marginBottom: 0 }}>
      <i style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function Dashboard({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const D = dict.dash;
  const { user, ready, rows } = useLessonProgress();
  const { slugs: favorites } = useFavorites();
  const userId = user?.id ?? null;
  const [data, setData] = useState<Loaded | null>(null);
  const [editing, setEditing] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // Activity (local days of each attempt) and personal settings.
  useEffect(() => {
    const supabase = getSupabase();
    if (!userId || !supabase) return;
    let active = true;
    Promise.all([
      supabase.from("learning_activity").select("created_at").order("created_at", { ascending: false }).limit(1000),
      supabase.from("learning_settings").select("daily_target, weekly_target, study_days").maybeSingle(),
    ]).then(([act, set]) => {
      if (!active) return;
      const s = set.data as { daily_target: number; weekly_target: number; study_days: number[] } | null;
      setData({
        owner: userId,
        activity: (act.data ?? []).map((r: { created_at: string }) => localDay(new Date(r.created_at))),
        settings: s ? { daily: s.daily_target, weekly: s.weekly_target, days: s.study_days } : DEFAULTS,
        failed: Boolean(act.error || set.error),
      });
    });
    return () => {
      active = false;
    };
  }, [userId]);

  const current = userId && data?.owner === userId ? data : null;
  const activity = useMemo(() => current?.activity ?? [], [current]);
  const settings = current?.settings ?? DEFAULTS;
  const stats = computeStats(rows, LESSONS.map((l) => l.slug), favorites.length, activity);

  const startsSunday = lang === "ar";
  const week = currentWeek(new Date(), startsSunday);
  const weekDays = new Set(week.map(localDay));
  const today = localDay(new Date());
  const doneToday = activity.filter((d) => d === today).length;
  const doneWeek = activity.filter((d) => weekDays.has(d)).length;
  const next = LESSONS.find((l) => (rows[l.slug]?.best ?? 0) < PASS_SCORE);
  const dayOrder = startsSunday ? [0, 1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5, 6, 0];

  if (!supabaseConfigured) return <p className="detail">{dict.auth.notConfigured}</p>;
  if (!ready) return <p role="status">{dict.auth.wait}</p>;
  if (!user) {
    return (
      <div className="detail">
        <b>{D.signedOut}</b>
        <span><a href={`/${lang}/login`}>{dict.auth.signinTab}</a></span>
      </div>
    );
  }

  const saveSettings = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const supabase = getSupabase();
    if (!supabase || !userId) return;
    const f = new FormData(e.currentTarget);
    const next: Settings = {
      daily: Math.min(10, Math.max(1, Number(f.get("daily")) || 1)),
      weekly: Math.min(50, Math.max(1, Number(f.get("weekly")) || 1)),
      days: [0, 1, 2, 3, 4, 5, 6].filter((d) => f.get(`day${d}`) === "on"),
    };
    const { error } = await supabase
      .from("learning_settings")
      .upsert({ daily_target: next.daily, weekly_target: next.weekly, study_days: next.days, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
    if (error) {
      setSaveMsg(dict.auth.errGeneric);
      return;
    }
    setData((d) => (d && d.owner === userId ? { ...d, settings: next } : d));
    setSaveMsg(D.saved);
    setEditing(false);
  };

  return (
    <>
      <div className="dash-stats">
        <div className="tp-card">
          <span className="dash-label">{D.level}</span>
          <b className="dash-big">{D.levels[stats.level]}</b>
        </div>
        <div className="tp-card">
          <span className="dash-label">{D.progress}</span>
          <b className="dash-big">{stats.progressPct}%</b>
          <Meter value={stats.passed} max={stats.total} label={D.progress} />
          <small>{fmt(D.progressText, { p: stats.passed, t: stats.total })}</small>
        </div>
        <div className="tp-card">
          <span className="dash-label">{D.points}</span>
          <b className="dash-big">{stats.points}</b>
          <small>{fmt(D.pointsText, { m: stats.maxPoints })}</small>
        </div>
      </div>

      <div className="detail" style={{ marginTop: 20 }}>
        {next ? (
          <>
            <b>{stats.passed === 0 && !rows[next.slug] ? D.startFirst : D.next}</b>
            <span><a href={`/${lang}/learn/lessons/${next.slug}`}>{fmt(dict.lessons.lesson, { n: next.order })}: {next.title[lang]}</a></span>
          </>
        ) : (
          <span>{D.nextDone}</span>
        )}
      </div>

      <section className="tp-related" style={{ marginTop: 40 }}>
        <h2 className="sec-title">{D.goals}</h2>
        {current?.failed && <p className="fb" role="alert">{D.loadFailed}</p>}
        <div className="dash-goals">
          {[
            { label: D.today, done: doneToday, target: settings.daily },
            { label: D.thisWeek, done: doneWeek, target: settings.weekly },
          ].map((g) => (
            <div key={g.label} className="tp-card">
              <span className="dash-label">{g.label}</span>
              <b style={{ fontSize: 20 }}>{fmt(D.goalText, { d: g.done, t: g.target })}</b>
              <Meter value={g.done} max={g.target} label={g.label} />
              {g.done >= g.target && <span className="pill pill-done" style={{ justifySelf: "start" }}>{D.goalMet}</span>}
            </div>
          ))}
        </div>

        <h3 style={{ fontSize: 22, margin: "28px 0 12px" }}>{D.schedule}</h3>
        <ol className="dash-week">
          {week.map((d) => {
            const key = localDay(d);
            const planned = settings.days.includes(d.getDay());
            const studied = activity.includes(key);
            return (
              <li key={key} className={`dash-day${planned ? " planned" : ""}${studied ? " studied" : ""}${key === today ? " today" : ""}`}>
                <span className="dash-dayname">{D.days[d.getDay()]}</span>
                <span className="dash-daynum">{d.getDate()}</span>
                <span className="dash-daystate">{studied ? `✓ ${D.studied}` : planned ? D.planned : ""}</span>
              </li>
            );
          })}
        </ol>

        {!editing ? (
          <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <button type="button" className="btn" onClick={() => { setEditing(true); setSaveMsg(""); }}>{D.editGoals}</button>
            {saveMsg && <span role="status">{saveMsg}</span>}
          </div>
        ) : (
          <form className="auth-box auth-form" style={{ marginTop: 16, maxWidth: 560 }} onSubmit={saveSettings}>
            <label className="field"><span>{D.dailyTarget}</span><input name="daily" type="number" min={1} max={10} defaultValue={settings.daily} dir="ltr" /></label>
            <label className="field"><span>{D.weeklyTarget}</span><input name="weekly" type="number" min={1} max={50} defaultValue={settings.weekly} dir="ltr" /></label>
            <fieldset className="ex-group">
              <legend>{D.studyDays}</legend>
              {dayOrder.map((d) => (
                <label key={d} className="chip day-check">
                  <input type="checkbox" name={`day${d}`} defaultChecked={settings.days.includes(d)} />
                  <span>{D.days[d]}</span>
                </label>
              ))}
            </fieldset>
            <p className="fb" role="alert">{saveMsg}</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button type="submit" className="btn pri">{D.save}</button>
              <button type="button" className="btn" onClick={() => setEditing(false)}>{dict.build.back}</button>
            </div>
          </form>
        )}
      </section>

      <section className="tp-related">
        <h2 className="sec-title">{D.badges}</h2>
        <ul className="dash-badges">
          {BADGES.map((b) => {
            const earned = stats.badges[b];
            return (
              <li key={b} className={`tp-card dash-badge${earned ? " earned" : ""}`}>
                <span className="dash-badge-icon" aria-hidden="true">{earned ? "★" : "☆"}</span>
                <b>{D.badgeNames[b]}</b>
                <small>{D.badgeHow[b]}</small>
                <span className="sr-only">{earned ? D.earned : D.locked}</span>
                {!earned && <small className="muted" aria-hidden="true">{D.locked}</small>}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="tp-related">
        <h2 style={{ fontSize: 22, marginBottom: 10 }}>{D.rulesTitle}</h2>
        <ul className="tp-list">{D.rules.map((r) => <li key={r}>{r}</li>)}</ul>
      </section>
    </>
  );
}
