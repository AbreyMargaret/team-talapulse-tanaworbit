import { useEffect, useRef, useState, type FormEvent } from "react";
import { rules, type Reading } from "./data";
import {
  fillGuideTemplate,
  guideQuestions,
  selectGuideAnswer,
  sourceFor,
  type FaqRecord,
  type ToolkitTab,
} from "./toolkitData";

type Message = {
  id: number;
  role: "user" | "guide";
  text: string;
  sourceIds?: string[];
  action?: ToolkitTab | "exercise";
  actionLabel?: string;
};
const welcome: Message = {
  id: 0,
  role: "guide",
  text: "Hello, I'm Tanaw Guide. I can help explain this demo's measurements, routines, exercise logs, and sources. My answers come from a fixed educational library—not a live AI model. I cannot diagnose a condition or recommend treatment.",
};

export default function TanawGuide({
  name,
  reading,
  baseline,
  context,
  onClose,
  onAction,
}: {
  name: string;
  reading: Reading;
  baseline: Reading;
  context: string;
  onClose: () => void;
  onAction: (action: ToolkitTab | "exercise") => void;
}) {
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [query, setQuery] = useState("");
  const close = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLElement>(null);
  const stream = useRef<HTMLDivElement>(null);
  const sequence = useRef(0);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    close.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      requestAnimationFrame(() => {
        const launcher = document.querySelector<HTMLButtonElement>(
          '[aria-label="Open Tanaw Guide"]',
        );
        if (launcher) launcher.focus();
        else previousFocus?.focus();
      });
    };
  }, []);
  useEffect(() => {
    if (stream.current) stream.current.scrollTop = stream.current.scrollHeight;
  }, [messages]);

  function answer(text: string, record?: FaqRecord) {
    const question = text.trim();
    if (!question) return;
    const result = record ? { text: record.answer, record } : selectGuideAnswer(question);
    const reply = fillGuideTemplate(
      result.text,
      name,
      reading,
      baseline,
      context,
      rules.baselineWindowDays,
    );
    const userId = ++sequence.current;
    const replyId = ++sequence.current;
    setMessages((old) => [
      ...old,
      { id: userId, role: "user", text: question },
      {
        id: replyId,
        role: "guide",
        text: reply,
        sourceIds: result.record?.sourceIds ?? ["project"],
        action: result.record?.action,
        actionLabel: result.record?.actionLabel,
      },
    ]);
    setQuery("");
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    answer(query);
  }

  return (
    <div className="tanaw-guide-backdrop" onClick={onClose}>
      <section
        ref={dialog}
        className="tanaw-guide-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tanaw-guide-title"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === "Escape") onClose();
          if (event.key !== "Tab") return;
          const controls = Array.from(
            dialog.current?.querySelectorAll<HTMLElement>(
              "button:not([disabled]), input:not([disabled]), a[href]",
            ) ?? [],
          );
          if (event.shiftKey && document.activeElement === controls[0]) {
            event.preventDefault();
            controls[controls.length - 1]?.focus();
          }
          if (!event.shiftKey && document.activeElement === controls[controls.length - 1]) {
            event.preventDefault();
            controls[0]?.focus();
          }
        }}
      >
        <header className="tanaw-guide-header">
          <img src="/images/tanaworbit-mark.svg" alt="" />
          <div>
            <h2 id="tanaw-guide-title">Tanaw Guide</h2>
            <span>SCRIPTED DEMO · NOT LIVE AI</span>
          </div>
          <button
            onClick={() => {
              setMessages([welcome]);
              setQuery("");
            }}
            className="guide-reset"
          >
            Reset
          </button>
          <button
            ref={close}
            onClick={onClose}
            aria-label="Close Tanaw Guide"
            className="guide-close"
          >
            <svg
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path d="m6 6 12 12M6 18 18 6" />
            </svg>
          </button>
        </header>
        <div className="guide-context">
          <span className="status-dot" />
          <span>
            {name} · {context} preview
          </span>
        </div>
        <div
          className="guide-messages"
          ref={stream}
          role="log"
          aria-label="Demo guide conversation"
          aria-live="polite"
          aria-relevant="additions"
        >
          {messages.map((message) => (
            <article key={message.id} className={`guide-message ${message.role}`}>
              <span className="guide-message-author">
                {message.role === "guide" ? "TANAW GUIDE / FIXED ANSWER LIBRARY" : "YOU"}
              </span>
              <p>{message.text}</p>
              {message.sourceIds && (
                <div className="guide-message-sources">
                  {message.sourceIds.map((id) => {
                    const source = sourceFor(id);
                    return source.url ? (
                      <a key={id} href={source.url} target="_blank" rel="noreferrer">
                        {source.name}
                        <span aria-hidden="true">↗</span>
                      </a>
                    ) : (
                      <span key={id}>{source.name}</span>
                    );
                  })}
                </div>
              )}
              {message.action && (
                <button className="guide-action-link" onClick={() => onAction(message.action!)}>
                  {message.actionLabel}
                  <span aria-hidden="true">→</span>
                </button>
              )}
            </article>
          ))}
        </div>
        <div className="guide-quick-questions">
          <span>EXPLORE A TOPIC</span>
          <div>
            {guideQuestions.map((record) => (
              <button key={record.id} onClick={() => answer(record.question, record)}>
                {record.question}
              </button>
            ))}
          </div>
        </div>
        <form className="guide-query-form" onSubmit={submit}>
          <label className="sr-only" htmlFor="guide-question">
            Ask the demo guide
          </label>
          <input
            id="guide-question"
            value={query}
            maxLength={400}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find a topic in the demo library…"
            autoComplete="off"
          />
          <button type="submit" aria-label="Find guidance" disabled={!query.trim()}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              aria-hidden="true"
            >
              <path d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </button>
        </form>
        <p className="guide-disclaimer">
          No diagnosis or medication advice. Nothing sent to an AI service or saved. Closing this
          guide clears the conversation.
        </p>
      </section>
    </div>
  );
}
