import { useEffect, useState } from "react";

export type DisplayMode = "auto" | "desktop" | "touch";

export function useConsoleDisplay() {
  const [mode, setMode] = useState<DisplayMode>("auto");
  const [deviceTouch, setDeviceTouch] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse), (max-width: 1180px)");
    const update = () => setDeviceTouch(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const update = () => setFullscreen(Boolean(document.fullscreenElement));
    update();
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);
  async function toggleFullscreen() {
    if (document.fullscreenElement) await document.exitFullscreen();
    else if (document.documentElement.requestFullscreen)
      await document.documentElement.requestFullscreen();
    else throw new Error("Fullscreen is unavailable in this browser.");
  }
  return {
    mode,
    setMode,
    touch: mode === "touch" || (mode === "auto" && deviceTouch),
    fullscreen,
    toggleFullscreen,
  };
}
