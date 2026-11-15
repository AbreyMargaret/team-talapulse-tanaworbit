import { useEffect, useRef, useState } from "react";
import "./cognition.css";

export type CognitionEntry = {
  id: string;
  task: CognitionTask;
  label: string;
  score: number;
  unit: string;
  detail: string;
};

type CognitionTask = "mpt" | "volt" | "nback" | "am" | "lot" | "ert" | "mrt" | "dsst" | "bart" | "pvt";

type Score = Omit<CognitionEntry, "id">;

const TASKS: { id: CognitionTask; label: string; blurb: string }[] = [
  { id: "mpt", label: "Motor praxis", blurb: "Click each square as it appears." },
  { id: "volt", label: "Visual object learning", blurb: "Remember shapes, then say if you saw them." },
  { id: "nback", label: "Fractal 2-back", blurb: "Mark a pattern that matches two screens ago." },
  { id: "am", label: "Abstract matching", blurb: "Learn which group follows the hidden rule." },
  { id: "lot", label: "Line orientation", blurb: "Turn one line until it matches the other." },
  { id: "ert", label: "Emotion recognition", blurb: "Name the feeling on a drawn face." },
  { id: "mrt", label: "Matrix reasoning", blurb: "Pick the piece that completes the grid." },
  { id: "dsst", label: "Digit-symbol", blurb: "Press the number paired with the symbol." },
  { id: "bart", label: "Balloon risk", blurb: "Pump for practice points, and collect before it pops." },
  { id: "pvt", label: "Psychomotor vigilance", blurb: "Press the space bar when the timer starts." },
];

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (!sorted.length) return 0;
  return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

function useOnce(onDone: (score: Score) => void) {
  const sent = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const finish = useRef((score: Score) => {
    if (sent.current) return;
    sent.current = true;
    onDoneRef.current(score);
  });
  return finish.current;
}

export default function CognitionBattery({
  crewName,
  dominantSide,
  entries,
  onRecord,
}: {
  crewName: string;
  dominantSide: string;
  entries: CognitionEntry[];
  onRecord: (score: Score) => void;
}) {
  const [task, setTask] = useState<CognitionTask | null>(null);
  const [playKey, setPlayKey] = useState(0);
  const latest = new Map<CognitionTask, CognitionEntry>();
  for (const entry of entries) latest.set(entry.task, entry);
  const tried = TASKS.filter((item) => latest.has(item.id)).length;

  return (
    <section className="panel cog-board" aria-labelledby="cognition-title">
      <div>
        <h2 id="cognition-title">Cognition practice</h2>
        <p className="cog-note">
          Ten short practices for {crewName}, following the task list in NASA/TM–2020-5008023,
          Appendix C. Each run is shorter than the research test, and the pictures are drawn for
          this console. Scores stay in this browser until you refresh. They are not a result from
          that study.
        </p>
        <p className="cog-progress">
          {tried} of {TASKS.length} practices tried this session.
        </p>
        <div className="cog-meter" aria-hidden="true">
          <span style={{ width: `${(tried / TASKS.length) * 100}%` }} />
        </div>
      </div>
      <div className="cog-tasks">
        {TASKS.map((item) => {
          const saved = latest.get(item.id);
          return (
            <button
              key={item.id}
              type="button"
              className={[task === item.id ? "is-on" : "", saved ? "is-done" : ""].filter(Boolean).join(" ") || undefined}
              onClick={() => {
                setTask(item.id);
                setPlayKey((key) => key + 1);
              }}
            >
              <strong>{item.label}</strong>
              <small>{saved ? `${saved.score} ${saved.unit}` : item.blurb}</small>
            </button>
          );
        })}
      </div>
      {task && (
        <TaskPlay
          key={`${task}-${playKey}`}
          task={task}
          dominantSide={dominantSide}
          onDone={onRecord}
          onReplay={() => setPlayKey((key) => key + 1)}
        />
      )}
      {entries.length > 0 && (
        <table className="cog-log">
          <thead>
            <tr>
              <th>Task</th>
              <th>Score</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {[...entries].reverse().map((entry) => (
              <tr key={entry.id}>
                <td>{entry.label}</td>
                <td>
                  {entry.score} {entry.unit}
                </td>
                <td>{entry.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

function TaskPlay({
  task,
  dominantSide,
  onDone,
  onReplay,
}: {
  task: CognitionTask;
  dominantSide: string;
  onDone: (score: Score) => void;
  onReplay: () => void;
}) {
  const game = {
    mpt: <MotorPraxis onDone={onDone} />,
    volt: <ObjectLearning onDone={onDone} />,
    nback: <FractalNBack onDone={onDone} />,
    am: <AbstractMatch onDone={onDone} />,
    lot: <LineOrientation onDone={onDone} />,
    ert: <EmotionFaces onDone={onDone} />,
    mrt: <MatrixReasoning onDone={onDone} />,
    dsst: <DigitSymbol dominantSide={dominantSide} onDone={onDone} />,
    bart: <BalloonRisk onDone={onDone} />,
    pvt: <Vigilance onDone={onDone} />,
  }[task];
  return (
    <div className="cog-stage">
      {game}
      <div className="cog-actions">
        <button type="button" className="secondary-button" onClick={onReplay}>
          Start this practice again
        </button>
      </div>
    </div>
  );
}

function MotorPraxis({ onDone }: { onDone: (score: Score) => void }) {
  const finish = useOnce(onDone);
  const total = 8;
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);
  const [spot, setSpot] = useState({ x: 40, y: 40 });
  const times = useRef<number[]>([]);
  const shownAt = useRef(0);
  const size = 84 - step * 8;

  function place() {
    setSpot({ x: 18 + Math.random() * 64, y: 22 + Math.random() * 56 });
    shownAt.current = performance.now();
  }

  function begin() {
    times.current = [];
    setStep(0);
    setStarted(true);
    place();
  }

  function hit() {
    if (!started) return;
    times.current.push(Math.round(performance.now() - shownAt.current));
    if (times.current.length >= total) {
      setStarted(false);
      finish({
        task: "mpt",
        label: "Motor praxis",
        score: median(times.current),
        unit: "ms",
        detail: `median of ${total} clicks`,
      });
      return;
    }
    setStep(times.current.length);
    place();
  }

  return (
    <>
      <p className="cog-note">
        Click each square as soon as it appears. The next square is smaller and in a new place.
        This practice uses {total} squares.
      </p>
      {!started && times.current.length < total && (
        <button type="button" className="primary-button" onClick={begin}>
          Start
        </button>
      )}
      {started && (
        <div className="cog-arena">
          <button
            type="button"
            className="cog-square"
            style={{ width: size, height: size, left: `${spot.x}%`, top: `${spot.y}%` }}
            onClick={hit}
            aria-label="Click the square"
          />
        </div>
      )}
      {!started && times.current.length >= total && (
        <p className="cog-note">Median {median(times.current)} ms across {total} squares.</p>
      )}
    </>
  );
}

type ShapeSpec = { id: string; outer: "circle" | "square" | "diamond" | "triangle"; inner: "dot" | "bar" | "ring"; color: string };

const SHAPE_POOL: ShapeSpec[] = [
  { id: "a", outer: "circle", inner: "dot", color: "#3d5344" },
  { id: "b", outer: "square", inner: "bar", color: "#8a5a2a" },
  { id: "c", outer: "triangle", inner: "ring", color: "#8d4034" },
  { id: "d", outer: "diamond", inner: "dot", color: "#3d5344" },
  { id: "e", outer: "circle", inner: "bar", color: "#8d4034" },
  { id: "f", outer: "square", inner: "ring", color: "#3d5344" },
  { id: "g", outer: "triangle", inner: "dot", color: "#8a5a2a" },
  { id: "h", outer: "diamond", inner: "bar", color: "#8d4034" },
];

function ShapeView({ item, size = 64 }: { item: ShapeSpec; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" aria-hidden="true">
      {item.outer === "circle" && <circle cx="36" cy="36" r="28" fill={item.color} />}
      {item.outer === "square" && <rect x="10" y="10" width="52" height="52" rx="4" fill={item.color} />}
      {item.outer === "diamond" && <polygon points="36,6 66,36 36,66 6,36" fill={item.color} />}
      {item.outer === "triangle" && <polygon points="36,8 66,62 6,62" fill={item.color} />}
      {item.inner === "dot" && <circle cx="36" cy="38" r="8" fill="#f4f1ea" />}
      {item.inner === "bar" && <rect x="30" y="18" width="12" height="36" fill="#f4f1ea" />}
      {item.inner === "ring" && <circle cx="36" cy="38" r="10" fill="none" stroke="#f4f1ea" strokeWidth="4" />}
    </svg>
  );
}

function ObjectLearning({ onDone }: { onDone: (score: Score) => void }) {
  const finish = useOnce(onDone);
  const [deck] = useState(() => [...SHAPE_POOL].sort(() => Math.random() - 0.5));
  const study = deck.slice(0, 4);
  const probes = useState(() => [...study, ...deck.slice(4, 6)].sort(() => Math.random() - 0.5))[0];
  const [phase, setPhase] = useState<"study" | "test" | "done">("study");
  const [index, setIndex] = useState(0);
  const answers = useRef<boolean[]>([]);

  useEffect(() => {
    if (phase !== "study") return;
    if (index >= study.length) {
      setPhase("test");
      setIndex(0);
      return;
    }
    const timer = window.setTimeout(() => setIndex((value) => value + 1), 1100);
    return () => window.clearTimeout(timer);
  }, [phase, index, study.length]);

  function answer(yes: boolean) {
    const seen = study.some((item) => item.id === probes[index].id);
    answers.current.push(yes === seen);
    if (index + 1 >= probes.length) {
      const correct = answers.current.filter(Boolean).length;
      setPhase("done");
      finish({
        task: "volt",
        label: "Visual object learning",
        score: Math.round((correct / probes.length) * 100),
        unit: "%",
        detail: `${correct} of ${probes.length} matched the study set`,
      });
      return;
    }
    setIndex(index + 1);
  }

  const current = phase === "study" ? study[index] : probes[index];
  return (
    <>
      <p className="cog-note">
        Remember each shape, including the inner mark. Then say whether you saw it. Definitely and
        probably are both counted as yes or no. The research test uses 10 study shapes.
      </p>
      {phase !== "done" && current && (
        <div className="cog-shapes">
          <div className="cog-shape">
            <ShapeView item={current} />
          </div>
          <span className="cog-note">{phase === "study" ? `Study ${index + 1} of ${study.length}` : `Shape ${index + 1} of ${probes.length}`}</span>
        </div>
      )}
      {phase === "test" && (
        <div className="cog-choices">
          {[
            ["Definitely yes", true],
            ["Probably yes", true],
            ["Probably no", false],
            ["Definitely no", false],
          ].map(([label, yes]) => (
            <button key={String(label)} type="button" className="secondary-button" onClick={() => answer(Boolean(yes))}>
              {label}
            </button>
          ))}
        </div>
      )}
      {phase === "done" && <p className="cog-note">Practice saved for this session.</p>}
    </>
  );
}

const PATTERNS = [
  [1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 1, 1, 0, 0, 0, 1, 1, 1],
  [0, 1, 0, 1, 1, 1, 0, 1, 0],
  [1, 0, 0, 1, 0, 0, 1, 1, 1],
  [0, 0, 1, 0, 1, 0, 1, 0, 0],
  [1, 1, 0, 1, 1, 0, 1, 1, 0],
];

function makeSequence() {
  const seq = [0, 1];
  while (seq.length < 12) {
    const previous = seq[seq.length - 2];
    if (Math.random() < 0.35) seq.push(previous);
    else {
      let next = Math.floor(Math.random() * PATTERNS.length);
      if (next === previous) next = (next + 1) % PATTERNS.length;
      seq.push(next);
    }
  }
  return seq;
}

function Pattern({ id }: { id: number }) {
  return (
    <div className="cog-pattern" aria-hidden="true">
      {PATTERNS[id].map((cell, index) => (
        <i key={index} className={cell ? "on" : undefined} />
      ))}
    </div>
  );
}

function FractalNBack({ onDone }: { onDone: (score: Score) => void }) {
  const finish = useOnce(onDone);
  const [seq] = useState(makeSequence);
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const pressed = useRef(false);
  const marks = useRef<boolean[]>([]);

  useEffect(() => {
    if (done) return;
    pressed.current = false;
    const timer = window.setTimeout(() => {
      marks.current[index] = pressed.current;
      if (index + 1 >= seq.length) {
        let correct = 0;
        let hits = 0;
        let extras = 0;
        let counted = 0;
        for (let i = 2; i < seq.length; i += 1) {
          counted += 1;
          const match = seq[i] === seq[i - 2];
          const hit = marks.current[i];
          if (hit === match) correct += 1;
          if (match && hit) hits += 1;
          if (!match && hit) extras += 1;
        }
        setDone(true);
        finish({
          task: "nback",
          label: "Fractal 2-back",
          score: Math.round((correct / counted) * 100),
          unit: "%",
          detail: `${hits} matches found, ${extras} extra presses`,
        });
        return;
      }
      setIndex(index + 1);
    }, 1600);
    return () => window.clearTimeout(timer);
  }, [done, finish, index, seq]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.code !== "Space") return;
      event.preventDefault();
      pressed.current = true;
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <p className="cog-note">
        Press Same, or the space bar, when the pattern matches the one from two screens ago. These
        are simple grids standing in for fractal pictures. The research run shows 62 images and
        gives no feedback.
      </p>
      {!done && (
        <>
          <Pattern id={seq[index]} />
          <p className="cog-note">
            Picture {index + 1} of {seq.length}
          </p>
          <button type="button" className="primary-button" onClick={() => (pressed.current = true)}>
            Same as two ago
          </button>
        </>
      )}
      {done && <p className="cog-note">Practice saved for this session.</p>}
    </>
  );
}

type Piece = { shape: "circle" | "square" | "triangle"; color: string; count: number };
type Rule = "shape" | "color" | "count";

function samplePiece(): Piece {
  const shapes: Piece["shape"][] = ["circle", "square", "triangle"];
  const colors = ["#3d5344", "#8a5a2a", "#8d4034"];
  return {
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    color: colors[Math.floor(Math.random() * colors.length)],
    count: 1 + Math.floor(Math.random() * 3),
  };
}

function sameRule(rule: Rule, a: Piece, b: Piece) {
  if (rule === "shape") return a.shape === b.shape;
  if (rule === "color") return a.color === b.color;
  return a.count === b.count;
}

function matchTrial(rule: Rule) {
  const probe = samplePiece();
  const good: Piece = { ...probe, count: rule === "count" ? probe.count : probe.count === 3 ? 1 : probe.count + 1 };
  if (rule === "count") good.shape = probe.shape === "circle" ? "square" : "circle";
  let bad = samplePiece();
  for (let guard = 0; guard < 12 && sameRule(rule, probe, bad); guard += 1) bad = samplePiece();
  if (sameRule(rule, probe, bad)) {
    if (rule === "color") bad = { ...bad, color: probe.color === "#3d5344" ? "#8a5a2a" : "#3d5344" };
    else if (rule === "shape") bad = { ...bad, shape: probe.shape === "circle" ? "triangle" : "circle" };
    else bad = { ...bad, count: probe.count === 1 ? 3 : 1 };
  }
  const left = Math.random() < 0.5;
  return { probe, leftSet: left ? good : bad, rightSet: left ? bad : good, answer: left ? "left" : "right" as const };
}

function PieceRow({ piece }: { piece: Piece }) {
  return (
    <span className="cog-shapes">
      {Array.from({ length: piece.count }, (_, index) => (
        <ShapeView
          key={index}
          size={36}
          item={{
            id: `${piece.shape}-${index}`,
            outer: piece.shape === "circle" ? "circle" : piece.shape === "square" ? "square" : "triangle",
            inner: "dot",
            color: piece.color,
          }}
        />
      ))}
    </span>
  );
}

function AbstractMatch({ onDone }: { onDone: (score: Score) => void }) {
  const finish = useOnce(onDone);
  const [rule] = useState<Rule>(() => (["shape", "color", "count"] as Rule[])[Math.floor(Math.random() * 3)]);
  const [round, setRound] = useState(() => matchTrial(rule));
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<"yes" | "no" | null>(null);
  const correct = useRef(0);
  const total = 6;
  const pending = useRef(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  function choose(side: "left" | "right") {
    if (pending.current || feedback) return;
    pending.current = true;
    const hit = side === round.answer;
    if (hit) correct.current += 1;
    setFeedback(hit ? "yes" : "no");
    const next = index + 1;
    timer.current = window.setTimeout(() => {
      if (next >= total) {
        finish({
          task: "am",
          label: "Abstract matching",
          score: Math.round((correct.current / total) * 100),
          unit: "%",
          detail: `${correct.current} of ${total} followed the hidden rule`,
        });
        setIndex(total);
        return;
      }
      setIndex(next);
      setRound(matchTrial(rule));
      setFeedback(null);
      pending.current = false;
    }, 500);
  }

  return (
    <>
      <p className="cog-note">
        Choose the lower group that fits the top object. A hidden rule stays the same for this
        practice. The note above the groups says whether the last pick was right.
      </p>
      {index < total && (
        <>
          <PieceRow piece={round.probe} />
          <p className={`cog-feedback ${feedback === "yes" ? "is-yes" : feedback === "no" ? "is-no" : ""}`}>
            {feedback === "yes" ? "Correct" : feedback === "no" ? "Not this rule" : " "}
          </p>
          <div className="cog-sets">
            <button type="button" className="cog-set" onClick={() => choose("left")}>
              <PieceRow piece={round.leftSet} />
            </button>
            <button type="button" className="cog-set" onClick={() => choose("right")}>
              <PieceRow piece={round.rightSet} />
            </button>
          </div>
        </>
      )}
      {index >= total && <p className="cog-note">Practice saved for this session.</p>}
    </>
  );
}

function angleGap(a: number, b: number) {
  const gap = Math.abs(a - b) % 180;
  return Math.min(gap, 180 - gap);
}

function freshLine() {
  const target = 15 + Math.floor(Math.random() * 150);
  const offset = (Math.random() < 0.5 ? -1 : 1) * (25 + Math.floor(Math.random() * 40));
  return { target, angle: (target + offset + 360) % 180 };
}

function LineOrientation({ onDone }: { onDone: (score: Score) => void }) {
  const finish = useOnce(onDone);
  const total = 4;
  const [line, setLine] = useState(freshLine);
  const [index, setIndex] = useState(0);
  const errors = useRef<number[]>([]);

  function lock() {
    errors.current.push(angleGap(line.angle, line.target));
    if (errors.current.length >= total) {
      const mean = Math.round(errors.current.reduce((sum, value) => sum + value, 0) / total);
      setIndex(total);
      finish({
        task: "lot",
        label: "Line orientation",
        score: mean,
        unit: "degrees",
        detail: `mean gap across ${total} lines`,
      });
      return;
    }
    setIndex(errors.current.length);
    setLine(freshLine());
  }

  return (
    <>
      <p className="cog-note">Turn the sand line until it is parallel with the dark line, then mark it.</p>
      {index < total && (
        <>
          <svg className="cog-lines" viewBox="0 0 160 160" aria-label="Two lines">
            <line x1="80" y1="80" x2="80" y2="18" stroke="var(--text)" strokeWidth="4" transform={`rotate(${line.target} 80 80)`} />
            <line x1="80" y1="80" x2="80" y2="22" stroke="var(--accent)" strokeWidth="4" transform={`rotate(${line.angle} 80 80)`} />
          </svg>
          <div className="cog-actions">
            <button type="button" className="secondary-button" onClick={() => setLine((value) => ({ ...value, angle: (value.angle + 175) % 180 }))}>
              Turn left
            </button>
            <button type="button" className="secondary-button" onClick={() => setLine((value) => ({ ...value, angle: (value.angle + 5) % 180 }))}>
              Turn right
            </button>
            <button type="button" className="primary-button" onClick={lock}>
              They match
            </button>
          </div>
        </>
      )}
      {index >= total && <p className="cog-note">Practice saved for this session.</p>}
    </>
  );
}

const MOODS = ["happy", "sad", "angry", "afraid", "none"] as const;
type Mood = (typeof MOODS)[number];
const MOOD_LABEL: Record<Mood, string> = {
  happy: "Happy",
  sad: "Sad",
  angry: "Angry",
  afraid: "Afraid",
  none: "No emotion",
};

function Face({ mood }: { mood: Mood }) {
  return (
    <svg viewBox="0 0 72 72" width="120" height="120" aria-hidden="true">
      <circle cx="36" cy="36" r="30" fill="#e7e4dc" stroke="#1e1c17" strokeWidth="2" />
      <circle cx="27" cy="32" r="3" fill="#1e1c17" />
      <circle cx="45" cy="32" r="3" fill="#1e1c17" />
      {mood === "angry" && <path d="M20 24 L32 30 M52 24 L40 30" stroke="#1e1c17" strokeWidth="2" fill="none" />}
      {mood === "afraid" && <path d="M20 32 L32 24 M52 32 L40 24" stroke="#1e1c17" strokeWidth="2" fill="none" />}
      {mood === "happy" && <path d="M24 42 Q36 56 48 42" stroke="#1e1c17" strokeWidth="2" fill="none" />}
      {mood === "sad" && <path d="M24 54 Q36 40 48 54" stroke="#1e1c17" strokeWidth="2" fill="none" />}
      {mood === "none" && <path d="M26 48 H46" stroke="#1e1c17" strokeWidth="2" />}
      {mood === "angry" && <path d="M26 50 H46" stroke="#1e1c17" strokeWidth="2" />}
      {mood === "afraid" && <ellipse cx="36" cy="50" rx="5" ry="7" fill="#1e1c17" />}
    </svg>
  );
}

function EmotionFaces({ onDone }: { onDone: (score: Score) => void }) {
  const finish = useOnce(onDone);
  const [faces] = useState<Mood[]>(() => {
    const deck: Mood[] = [...MOODS, "happy"];
    return deck.sort(() => Math.random() - 0.5);
  });
  const [index, setIndex] = useState(0);
  const correct = useRef(0);

  function choose(mood: Mood) {
    if (mood === faces[index]) correct.current += 1;
    if (index + 1 >= faces.length) {
      setIndex(faces.length);
      finish({
        task: "ert",
        label: "Emotion recognition",
        score: Math.round((correct.current / faces.length) * 100),
        unit: "%",
        detail: `${correct.current} of ${faces.length} drawn faces`,
      });
      return;
    }
    setIndex(index + 1);
  }

  return (
    <>
      <p className="cog-note">
        These are drawn faces, not the research photographs. Choose happy, sad, angry, afraid, or
        no emotion.
      </p>
      {index < faces.length && (
        <>
          <Face mood={faces[index]} />
          <div className="cog-choices">
            {MOODS.map((mood) => (
              <button key={mood} type="button" className="secondary-button" onClick={() => choose(mood)}>
                {MOOD_LABEL[mood]}
              </button>
            ))}
          </div>
        </>
      )}
      {index >= faces.length && <p className="cog-note">Practice saved for this session.</p>}
    </>
  );
}

const MATRICES: { cells: string[]; options: string[]; answer: number }[] = [
  { cells: ["1", "2", "3", "?"], options: ["4", "5", "2", "6"], answer: 0 },
  { cells: ["▲", "●", "▲", "?"], options: ["●", "▲", "■", "◆"], answer: 0 },
  { cells: ["●", "●●", "●●●", "?"], options: ["●●●●", "●", "●●", "■"], answer: 0 },
  { cells: ["A", "B", "C", "?"], options: ["D", "A", "E", "C"], answer: 0 },
];

function MatrixReasoning({ onDone }: { onDone: (score: Score) => void }) {
  const finish = useOnce(onDone);
  const [index, setIndex] = useState(0);
  const correct = useRef(0);
  const puzzle = MATRICES[index];

  function choose(option: number) {
    if (option === puzzle.answer) correct.current += 1;
    if (index + 1 >= MATRICES.length) {
      setIndex(MATRICES.length);
      finish({
        task: "mrt",
        label: "Matrix reasoning",
        score: Math.round((correct.current / MATRICES.length) * 100),
        unit: "%",
        detail: `${correct.current} of ${MATRICES.length} grids`,
      });
      return;
    }
    setIndex(index + 1);
  }

  return (
    <>
      <p className="cog-note">Choose the piece that fills the empty cell.</p>
      {puzzle && (
        <>
          <div className="cog-matrix">
            {puzzle.cells.map((cell, cellIndex) => (
              <div key={cellIndex}>{cell}</div>
            ))}
          </div>
          <div className="cog-choices">
            {puzzle.options.map((option, optionIndex) => (
              <button key={option} type="button" className="cog-option" onClick={() => choose(optionIndex)}>
                {option}
              </button>
            ))}
          </div>
        </>
      )}
      {!puzzle && <p className="cog-note">Practice saved for this session.</p>}
    </>
  );
}

const SYMBOLS = ["circle", "square", "triangle", "diamond", "ring", "bar", "dot", "cross", "wave"] as const;

function Glyph({ name }: { name: (typeof SYMBOLS)[number] }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
      {name === "circle" && <circle cx="14" cy="14" r="8" fill="var(--accent)" />}
      {name === "square" && <rect x="6" y="6" width="16" height="16" fill="var(--accent)" />}
      {name === "triangle" && <polygon points="14,5 24,23 4,23" fill="var(--accent)" />}
      {name === "diamond" && <polygon points="14,4 24,14 14,24 4,14" fill="var(--accent)" />}
      {name === "ring" && <circle cx="14" cy="14" r="7" fill="none" stroke="var(--accent)" strokeWidth="3" />}
      {name === "bar" && <rect x="6" y="12" width="16" height="4" fill="var(--accent)" />}
      {name === "dot" && <circle cx="14" cy="14" r="4" fill="var(--accent)" />}
      {name === "cross" && <path d="M6 6 L22 22 M22 6 L6 22" stroke="var(--accent)" strokeWidth="3" />}
      {name === "wave" && <path d="M4 16 Q8 8 14 16 T24 16" fill="none" stroke="var(--accent)" strokeWidth="3" />}
    </svg>
  );
}

function DigitSymbol({ dominantSide, onDone }: { dominantSide: string; onDone: (score: Score) => void }) {
  const finish = useOnce(onDone);
  const [pairs] = useState(() =>
    SYMBOLS.map((symbol, index) => ({ symbol, key: index + 1 })).sort(() => Math.random() - 0.5),
  );
  const [order] = useState(() => Array.from({ length: 8 }, () => pairs[Math.floor(Math.random() * pairs.length)]));
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<"yes" | "no" | null>(null);
  const hits = useRef(0);
  const times = useRef<number[]>([]);
  const shownAt = useRef(performance.now());
  const busy = useRef(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  function choose(key: number) {
    if (busy.current || !order[index]) return;
    busy.current = true;
    const hit = key === order[index].key;
    const elapsed = Math.round(performance.now() - shownAt.current);
    if (hit) {
      hits.current += 1;
      times.current.push(elapsed);
    }
    const showNote = index < 3;
    const next = index + 1;
    setFeedback(showNote ? (hit ? "yes" : "no") : null);
    const advance = () => {
      if (next >= order.length) {
        setIndex(order.length);
        finish({
          task: "dsst",
          label: "Digit-symbol",
          score: Math.round((hits.current / order.length) * 100),
          unit: "%",
          detail: times.current.length
            ? `median ${median(times.current)} ms on correct picks`
            : "no correct picks",
        });
        return;
      }
      shownAt.current = performance.now();
      setFeedback(null);
      setIndex(next);
      busy.current = false;
    };
    if (showNote) timer.current = window.setTimeout(advance, 450);
    else advance();
  }

  const current = order[index];
  return (
    <>
      <p className="cog-note">
        Press the number paired with the symbol. The stored record lists the dominant side as{" "}
        {dominantSide}. The first three picks show whether they were right.
      </p>
      <div className="cog-legend">
        {pairs.map((pair) => (
          <span key={pair.symbol}>
            <Glyph name={pair.symbol} />
            {pair.key}
          </span>
        ))}
      </div>
      {current && (
        <>
          <Glyph name={current.symbol} />
          <p className={`cog-feedback ${feedback === "yes" ? "is-yes" : feedback === "no" ? "is-no" : ""}`}>
            {feedback === "yes" ? "Correct" : feedback === "no" ? "Try the legend" : " "}
          </p>
          <div className="cog-choices">
            {pairs.map((pair) => (
              <button key={pair.key} type="button" className="secondary-button" onClick={() => choose(pair.key)}>
                {pair.key}
              </button>
            ))}
          </div>
        </>
      )}
      {!current && <p className="cog-note">Practice saved for this session.</p>}
    </>
  );
}

function BalloonRisk({ onDone }: { onDone: (score: Score) => void }) {
  const finish = useOnce(onDone);
  const total = 5;
  const [balloon, setBalloon] = useState(1);
  const [pumps, setPumps] = useState(0);
  const [pot, setPot] = useState(0);
  const [bank, setBank] = useState(0);
  const [limit, setLimit] = useState(() => 3 + Math.floor(Math.random() * 5));
  const [popped, setPopped] = useState(false);
  const [done, setDone] = useState(false);
  const pops = useRef(0);

  function reset(nextBank: number, nextBalloon: number) {
    if (nextBalloon > total) {
      setBank(nextBank);
      setDone(true);
      finish({
        task: "bart",
        label: "Balloon risk",
        score: nextBank,
        unit: "points",
        detail: `${pops.current} pops in ${total} balloons`,
      });
      return;
    }
    setBank(nextBank);
    setBalloon(nextBalloon);
    setPumps(0);
    setPot(0);
    setPopped(false);
    setLimit(3 + Math.floor(Math.random() * 5));
  }

  function inflate() {
    if (popped || done) return;
    const next = pumps + 1;
    if (next >= limit) {
      pops.current += 1;
      setPumps(next);
      setPot(0);
      setPopped(true);
      return;
    }
    setPumps(next);
    setPot(next);
  }

  return (
    <>
      <p className="cog-note">
        Each pump adds one practice point. Collect moves those points into the total. A pop clears
        only that balloon. These points are not money. This practice uses {total} balloons.
      </p>
      {!done && (
        <>
          <div className={`cog-balloon ${popped ? "is-popped" : ""}`} style={{ ["--size" as string]: `${56 + pumps * 16}px` }} />
          <p className="cog-note">
            Balloon {balloon} of {total}. This balloon: {pot}. Collected: {bank}.
          </p>
          <div className="cog-actions">
            {!popped && (
              <>
                <button type="button" className="primary-button" onClick={inflate}>
                  Pump
                </button>
                <button type="button" className="secondary-button" onClick={() => reset(bank + pot, balloon + 1)} disabled={pot === 0}>
                  Collect
                </button>
              </>
            )}
            {popped && (
              <button type="button" className="secondary-button" onClick={() => reset(bank, balloon + 1)}>
                Next balloon
              </button>
            )}
          </div>
        </>
      )}
      {done && <p className="cog-note">Collected {bank} practice points.</p>}
    </>
  );
}

function Vigilance({ onDone }: { onDone: (score: Score) => void }) {
  const finish = useOnce(onDone);
  const [phase, setPhase] = useState<"idle" | "wait" | "go" | "done">("idle");
  const [shown, setShown] = useState(0);
  const [trial, setTrial] = useState(0);
  const phaseRef = useRef(phase);
  const times = useRef<number[]>([]);
  const falseStarts = useRef(0);
  const startedAt = useRef(0);
  const waitTimer = useRef<number | null>(null);
  const tickTimer = useRef<number | null>(null);
  phaseRef.current = phase;

  function clearTimers() {
    if (waitTimer.current) window.clearTimeout(waitTimer.current);
    if (tickTimer.current) window.clearInterval(tickTimer.current);
  }

  function arm() {
    clearTimers();
    setShown(0);
    setPhase("wait");
    waitTimer.current = window.setTimeout(() => {
      startedAt.current = performance.now();
      setPhase("go");
      tickTimer.current = window.setInterval(() => {
        setShown(Math.max(1, Math.round(performance.now() - startedAt.current)));
      }, 16);
    }, 1400 + Math.random() * 2600);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.code !== "Space") return;
      event.preventDefault();
      if (phaseRef.current === "wait") {
        clearTimers();
        falseStarts.current += 1;
        setPhase("idle");
        return;
      }
      if (phaseRef.current === "go") {
        const elapsed = Math.max(1, Math.round(performance.now() - startedAt.current));
        clearTimers();
        times.current.push(elapsed);
        if (times.current.length >= 5) {
          setPhase("done");
          setTrial(5);
          finish({
            task: "pvt",
            label: "Psychomotor vigilance",
            score: median(times.current),
            unit: "ms",
            detail: `${falseStarts.current} early presses`,
          });
          return;
        }
        setTrial(times.current.length);
        arm();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimers();
    };
  }, [finish]);

  return (
    <>
      <p className="cog-note">
        Wait, then press the space bar as soon as the numbers appear. Pressing too early starts
        that wait over. The research screen is a blue rectangle. This practice uses the console
        color. Five timers are recorded.
      </p>
      <div className="cog-pvt" aria-live="polite">
        {phase === "go" ? shown : phase === "wait" ? "Wait" : phase === "done" ? "Saved" : "Ready"}
      </div>
      <p className="cog-note">Recorded {trial} of 5.</p>
      {phase === "idle" && (
        <button type="button" className="primary-button" onClick={arm}>
          {trial === 0 ? "Start" : "Continue"}
        </button>
      )}
    </>
  );
}
