import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Strip any leftover hash route (e.g. /#/area-guide → /area-guide) so the
// path-based router takes over cleanly on production. Old bookmarks and
// crawler links that still carry #/ get rewritten to the proper clean URL.
if (window.location.hash.startsWith("#/")) {
  const hashPath = window.location.hash.slice(1); // remove leading #
  const target = hashPath === "/" ? "/" : hashPath;
  window.history.replaceState(null, "", target + window.location.search);
}

createRoot(document.getElementById("root")!).render(<App />);
