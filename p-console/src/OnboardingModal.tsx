import { useEffect, useState } from "react";

export type TourStep = {
  page: string;
  label: string;
  text: string;
};

/**
 * Walks the sidebar in order. The reader advances by opening the highlighted page.
 * Nothing else moves the tour forward.
 */
export default function OnboardingModal({
  steps,
  index,
  page,
  menuClosed,
  onClose,
}: {
  steps: TourStep[];
  index: number;
  page: string;
  menuClosed: boolean;
  onClose: () => void;
}) {
  const here = steps[index];
  const next = steps[index + 1];
  const onStep = Boolean(here && page === here.page);
  const targetPage = here ? (onStep && next ? next.page : here.page) : "";
  const [box, setBox] = useState<{ top: number; left: number; width: number; height: number } | null>(
    null,
  );

  useEffect(() => {
    if (!here) return;
    const place = () => {
      const selector = menuClosed ? "[data-tour-menu]" : `[data-tour-page="${targetPage}"]`;
      const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector));
      const el =
        nodes.find((node) => node.closest(".sidebar")) ??
        nodes.find((node) => {
          const rect = node.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        }) ??
        nodes[0];
      if (!el) {
        setBox(null);
        return;
      }
      el.scrollIntoView({ block: "nearest", inline: "nearest" });
      const rect = el.getBoundingClientRect();
      setBox({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
    };
    place();
    const id = window.setInterval(place, 300);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [here, menuClosed, targetPage, page, index]);

  if (!here) return null;

  const width = Math.min(300, window.innerWidth - 24);
  let left = 248;
  let top = 88;
  if (box) {
    left = box.left + box.width + 14;
    top = box.top;
    if (left + width > window.innerWidth - 12) {
      left = Math.max(12, Math.min(box.left, window.innerWidth - width - 12));
      top = box.top + box.height + 12;
    }
  }
  const maxTop = window.innerHeight - 210;
  if (top > maxTop) top = Math.max(12, maxTop);
  if (top < 12) top = 12;

  const prompt = menuClosed
    ? `Open the menu, then click ${onStep && next ? next.label : here.label}.`
    : onStep && next
      ? `Click ${next.label}.`
      : onStep
        ? ""
        : `Click ${here.label}.`;

  return (
    <div
      className="tour-card"
      role="dialog"
      aria-modal="false"
      aria-labelledby="tour-title"
      style={{ top, left, width }}
    >
      <div className="tour-progress">
        <span>
          {index + 1} of {steps.length}
        </span>
        <button type="button" className="tour-skip" onClick={onClose}>
          Skip
        </button>
      </div>
      <div className="tour-bar" aria-hidden="true">
        <span style={{ width: `${((index + (onStep ? 1 : 0)) / steps.length) * 100}%` }} />
      </div>
      <h2 id="tour-title">{onStep ? here.label : `Open ${here.label}`}</h2>
      <p>{onStep ? here.text : "The list on the left is the order to read these pages."}</p>
      {prompt && <p className="tour-next">{prompt}</p>}
      {onStep && !next && (
        <button type="button" className="tour-done" onClick={onClose}>
          Done
        </button>
      )}
    </div>
  );
}
