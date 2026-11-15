import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Info } from "lucide-react";

/** Plain meanings for words a reader can forget. Not advice. */
export const TERMS: Record<string, string> = {
  "Heart rate": "How many times the heart beats in one minute.",
  "Blood pressure":
    "The push of blood in the arteries. The first number is when the heart squeezes. The second is when it rests.",
  Sleep: "Hours of sleep written down for this day.",
  "Sleep duration": "Hours of sleep in the last sleep period.",
  "How tired": "How tired you said you feel. 1 is low, 5 is high.",
  Fatigue: "How tired you said you feel. 1 is low, 5 is high.",
  "Fatigue level": "How tired you said you feel. 1 is low, 5 is high.",
  Mood: "How you said you feel today, in your own words.",
  Temperature: "Body temperature for this reading.",
  "Blood oxygen": "How full of oxygen the blood is, as a percent.",
  "Blood sugar": "Sugar in the blood at the time of the reading.",
  Breathing: "How many breaths in one minute.",
  "Air flow": "How fast air is moving in and out of the lungs right now, in liters each second.",
  Airflow: "How much air moves through the lungs in one minute. Size of each breath, times how often you breathe.",
  "Air per minute":
    "The total air breathed in one minute. It is the size of each breath times how often you breathe.",
  "Breathing ratio":
    "Carbon dioxide breathed out, divided by oxygen used. Near 0.83 often means the body is burning a mix of carbohydrate and fat.",
  "Oxygen in / out": "Oxygen in the air you breathe in, and the oxygen still left when you breathe out.",
  "Carbon dioxide in / out": "Carbon dioxide in the air you breathe in, and in the air you breathe out.",
  "Oxygen used": "How much oxygen the body takes from the air each minute.",
  "Breath temperature": "How warm the air is as you breathe it out.",
  "Carbon dioxide": "A gas you breathe out. Here it is how much of that gas is in the air.",
  Oxygen: "The share of the air that is oxygen.",
  Pressure: "How hard the air pushes. About 101 kPa is sea level on Earth.",
  Humidity: "How much water is in the air.",
  Noise: "How loud the cabin is, in decibels.",
  Altitude: "How high the craft is above Earth.",
  Velocity: "How fast the craft is moving.",
  Lighting: "Whether the craft is in sunlight or in Earth's shadow.",
  "Beta angle": "The angle between the orbit and the Sun. It changes how long the craft stays in daylight.",
  Eclipse: "How long the craft is in Earth's shadow on this pass.",
  Water: "How much water was logged for the day.",
  "Analog days": "Days this person has spent in a training habitat on Earth.",
  "Blood-type label": "The blood-type name stored on this profile.",
  "Dominant side": "The hand this person uses most.",
  Stature: "Standing height.",
  Mass: "Body mass.",
  Age: "Age in years.",
};

export function MaybeTerm({ children }: { children: string }) {
  if (!TERMS[children]) return <>{children}</>;
  return <Term>{children}</Term>;
}

export default function Term({ children, tip }: { children: ReactNode; tip?: string }) {
  const text = tip ?? (typeof children === "string" ? TERMS[children] : undefined);
  const ref = useRef<HTMLSpanElement>(null);
  const [hover, setHover] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, above: false });
  const open = hover || pinned;

  useEffect(() => {
    if (!open) return;
    function place() {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const width = 260;
      let left = rect.left;
      if (left + width > window.innerWidth - 12) left = window.innerWidth - width - 12;
      if (left < 12) left = 12;
      const above = rect.bottom + 96 > window.innerHeight;
      setPos({ top: above ? rect.top - 8 : rect.bottom + 8, left, above });
    }
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open]);

  useEffect(() => {
    if (!pinned) return;
    function onDoc(event: Event) {
      if (ref.current?.contains(event.target as Node)) return;
      setPinned(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setPinned(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [pinned]);

  if (!text) return <>{children}</>;

  function toggle(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    setPinned((value) => !value);
  }

  return (
    <span
      ref={ref}
      className={pinned ? "term is-open" : "term"}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      onMouseDown={(event) => event.stopPropagation()}
      onClick={toggle}
      tabIndex={0}
      role="note"
      aria-label={typeof children === "string" ? `${children}. ${text}` : text}
    >
      <span className="term-label">{children}</span>
      <span className="term-mark" aria-hidden="true">
        <Info size={11} className="shrink-0" />
      </span>
      {open &&
        createPortal(
          <span
            className="term-pop"
            role="tooltip"
            style={{
              top: pos.top,
              left: pos.left,
              transform: pos.above ? "translateY(-100%)" : undefined,
            }}
          >
            {text}
          </span>,
          document.body,
        )}
    </span>
  );
}
