import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {
  AdminPortal,
  AstronautLogin,
  AstronautPortal,
  BackendLogin,
  PortalHome,
  TesterPortal,
} from "./Portals";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortalHome />} />
        <Route path="/a-login" element={<AstronautLogin />} />
        <Route path="/b-login" element={<BackendLogin />} />
        <Route path="/Astronaut" element={<AstronautPortal />} />
        <Route path="/astronaut" element={<Navigate to="/Astronaut" replace />} />
        <Route path="/admin" element={<AdminPortal />} />
        <Route path="/tester" element={<TesterPortal />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
