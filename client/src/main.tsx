import { createRoot } from "react-dom/client";
import App from "./App";
import { Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import "./index.css";

// Strip any leftover hash route (e.g. /#/area-guide → /area-guide) so the
// path-based router takes over cleanly on production. Old bookmarks and
// crawler links that still carry #/ get rewritten to the proper clean URL.
const isPreview = import.meta.env.VITE_PREVIEW === "true";
if (!isPreview && window.location.hash.startsWith("#/")) {
  const hashPath = window.location.hash.slice(1); // remove leading #
  const target = hashPath === "/" ? "/" : hashPath;
  window.history.replaceState(null, "", target + window.location.search);
}

if (isPreview && !window.location.hash) window.location.hash = "/event-center";
createRoot(document.getElementById("root")!).render(
  <Router hook={isPreview ? useHashLocation : undefined}><App /></Router>
);
