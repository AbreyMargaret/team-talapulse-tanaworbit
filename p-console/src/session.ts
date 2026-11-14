export type DemoSession =
  | { kind: "astronaut"; crewId: string }
  | { kind: "backend"; role: "admin" | "tester" };

const KEY = "tanaworbit-demo-gate";

export function readSession(): DemoSession | null {
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as DemoSession;
    if (value.kind === "astronaut" && typeof value.crewId === "string") return value;
    if (value.kind === "backend" && (value.role === "admin" || value.role === "tester")) return value;
  } catch {
    return null;
  }
  return null;
}

export function writeSession(session: DemoSession) {
  sessionStorage.setItem(KEY, JSON.stringify(session));
}

export function clearSession() {
  sessionStorage.removeItem(KEY);
}
