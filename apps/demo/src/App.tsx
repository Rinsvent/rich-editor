import { NavLink, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { BasicEditorPage } from "./pages/BasicEditorPage";
import { FullEditorPage } from "./pages/FullEditorPage";
import { ChatPage } from "./pages/ChatPage";
import { TaskPage } from "./pages/TaskPage";
import { ViewerPage } from "./pages/ViewerPage";
import { PlaygroundPage } from "./pages/PlaygroundPage";
import { MentionsPage } from "./pages/MentionsPage";

const links = [
  { to: "/", label: "Overview" },
  { to: "/editor/basic", label: "Basic" },
  { to: "/editor/full", label: "Full" },
  { to: "/editor/chat", label: "Chat" },
  { to: "/editor/task", label: "Task" },
  { to: "/viewer", label: "Viewer" },
  { to: "/playground", label: "Playground" },
  { to: "/mentions", label: "Mentions" },
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
      </Routes>
    </div>
  );
}
