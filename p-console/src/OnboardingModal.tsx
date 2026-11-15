import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Compass, CheckCircle2 } from "lucide-react";

export type TourStep<P = string> = {
  page: P;
  selector: string;
  title: string;
  description: string;
  tag?: string;
};

export default function OnboardingModal<P extends string = string>({
  steps,
  index,
  page,
  onStepChange,
  onNavigate,
  onClose,
  blockedLabel = null,
  onPointNext,
}: {
  steps: TourStep<P>[];
  index: number;
  page: P;
  onStepChange: (newIndex: number) => void;
  onNavigate: (targetPage: P) => void;
  onClose: () => void;
  blockedLabel?: string | null;
  onPointNext?: () => void;
}) {
  const currentStep = steps[index] || steps[0];
  const isFirst = index === 0;
  const isLast = index === steps.length - 1;

  // Auto-navigate to page and scroll target element into view with highlight
  useEffect(() => {
    if (!currentStep) return;

    const timer = setTimeout(() => {
      // Remove any prior highlights
      document.querySelectorAll(".tour-active-highlight").forEach((el) => {
        el.classList.remove("tour-active-highlight");
      });

      if (currentStep.selector) {
        const target = document.querySelector<HTMLElement>(currentStep.selector);
        if (target) {
          target.classList.add("tour-active-highlight");
          target.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      document.querySelectorAll(".tour-active-highlight").forEach((el) => {
        el.classList.remove("tour-active-highlight");
      });
    };
  }, [index, currentStep]);

  const handleNext = () => {
    if (isLast) {
      onClose();
      return;
    }
    if (blockedLabel) {
      onPointNext?.();
      return;
    }
    onStepChange(index + 1);
  };

  const handlePrev = () => {
    if (!isFirst) {
      const prevIdx = index - 1;
      onStepChange(prevIdx);
      if (steps[prevIdx] && steps[prevIdx].page !== page) {
        onNavigate(steps[prevIdx].page);
      }
    }
  };

  return (
    <div
      className="tour-card"
      role="dialog"
      aria-modal="false"
      aria-labelledby="tour-modal-title"
    >
      <div className="tour-progress">
        <div className="flex items-center gap-1.5">
          <Compass size={14} className="text-sky-500 dark:text-cyan-400" />
          <span className="font-mono text-xs font-semibold tracking-wider">
            STEP {index + 1} OF {steps.length}
          </span>
        </div>
        <button
          type="button"
          className="tour-skip flex items-center gap-1"
          onClick={onClose}
          aria-label="Exit tour"
        >
          <X size={14} />
          <span>Exit</span>
        </button>
      </div>

      <div className="tour-bar" aria-hidden="true">
        <span style={{ width: `${((index + 1) / steps.length) * 100}%` }} />
      </div>

      {currentStep.tag && (
        <span className="tour-tag">
          {currentStep.tag}
        </span>
      )}

      <h2 id="tour-modal-title" className="tour-title">
        {currentStep.title}
      </h2>

      <p className="tour-text">
        {currentStep.description}
        {blockedLabel ? ` Then open ${blockedLabel} in the left menu. The outline shows which one.` : ""}
      </p>

      <div className="tour-actions">
        <button
          type="button"
          className="tour-btn-prev"
          onClick={handlePrev}
          disabled={isFirst}
          aria-label="Previous step"
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </button>

        <button
          type="button"
          className="tour-btn-next"
          onClick={handleNext}
          aria-label={isLast ? "Complete walkthrough" : blockedLabel ? `Show ${blockedLabel} in the menu` : "Next step"}
        >
          {isLast ? (
            <>
              <span>Finish Tour</span>
              <CheckCircle2 size={16} />
            </>
          ) : blockedLabel ? (
            <span>Open {blockedLabel}</span>
          ) : (
            <>
              <span>Next on this page</span>
              <ChevronRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
