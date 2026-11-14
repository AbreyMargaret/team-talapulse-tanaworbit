import { useEffect, useState } from "react";

export function useRoutineReminders(enabled: boolean, crewId: string, complete: boolean) {
  const [minutes, setMinutes] = useState(5);
  const [nextAt, setNextAt] = useState<number | null>(null);
  const [due, setDue] = useState(false);

  useEffect(() => {
    setDue(false);
    setNextAt(enabled && !complete && minutes > 0 ? Date.now() + minutes * 60_000 : null);
  }, [enabled, crewId, complete, minutes]);

  useEffect(() => {
    if (!enabled || complete || nextAt === null) return;
    const timer = window.setTimeout(() => setDue(true), Math.max(0, nextAt - Date.now()));
    return () => window.clearTimeout(timer);
  }, [enabled, complete, nextAt]);

  function reschedule(delay: number) {
    setDue(false);
    setNextAt(enabled && !complete && delay > 0 ? Date.now() + delay * 60_000 : null);
  }
  return {
    minutes,
    setMinutes,
    nextAt,
    due,
    snooze: () => reschedule(5),
    dismiss: () => reschedule(minutes),
  };
}
