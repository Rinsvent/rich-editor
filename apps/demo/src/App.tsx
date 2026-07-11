import { NavLink, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { BasicEditorPage } from "./pages/BasicEditorPage";
import { FullEditorPage } from "./pages/FullEditorPage";
import { ChatPage } from "./pages/ChatPage";
import { TaskPage } from "./pages/TaskPage";
import { ViewerPage } from "./pages/ViewerPage";
import { PlaygroundPage } from "./pages/PlaygroundPage";
import { MentionsPage } from "./pages/MentionsPage";
import { ThemesPage } from "./pages/ThemesPage";
import { A11yPage } from "./pages/A11yPage";
import { EnterBehaviorPage } from "./pages/EnterBehaviorPage";

const links = [
  { to: "/", label: "Overview" },
  { to: "/editor/basic", label: "Basic" },
  { to: "/editor/full", label: "Full" },
  { to: "/editor/chat", label: "Chat" },
  { to: "/editor/task", label: "Task" },
  { to: "/viewer", label: "Viewer" },
  { to: "/playground", label: "Playground" },
  { to: "/mentions", label: "Mentions" },
  { to: "/themes", label: "Themes" },
  { to: "/a11y", label: "A11y" },
  { to: "/enter", label: "Enter keys" },
];

export function App() {
  return (
    <div className="demo-layout">
      <h1>@rinsvent/rich-editor</h1>
      <nav className="demo-nav">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/editor/basic" element={<BasicEditorPage />} />
        <Route path="/editor/full" element={<FullEditorPage />} />
        <Route path="/editor/chat" element={<ChatPage />} />
        <Route path="/editor/task" element={<TaskPage />} />
        <Route path="/viewer" element={<ViewerPage />} />
        <Route path="/playground" element={<PlaygroundPage />} />
        <Route path="/mentions" element={<MentionsPage />} />
        <Route path="/themes" element={<ThemesPage />} />
        <Route path="/a11y" element={<A11yPage />} />
        <Route path="/enter" element={<EnterBehaviorPage />} />
      </Routes>
    </div>
  );
}
