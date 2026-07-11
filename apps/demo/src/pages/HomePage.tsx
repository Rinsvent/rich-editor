import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="demo-card">
      <h2>Rich text editor for React</h2>
      <p>
        Lexical-based компоненты для набора и отображения форматированного текста
        (уровень Telegram / ClickUp / Slack).
      </p>
      <ul>
        <li>
          <Link to="/editor/basic">Basic</Link> — минимальный набор фич
        </li>
        <li>
          <Link to="/editor/full">Full</Link> — все форматирования
        </li>
        <li>
          <Link to="/editor/chat">Chat</Link> — composer, attachments
        </li>
        <li>
          <Link to="/editor/task">Task tracker</Link> — ClickUp-style blur save
        </li>
        <li>
          <Link to="/viewer">Viewer</Link> — примеры отображения
        </li>
        <li>
          <Link to="/performance">Performance</Link> — большие документы
        </li>
        <li>
          <Link to="/playground">Playground</Link> — editor + live viewer
        </li>
        <li>
          <Link to="/mentions">Mentions</Link> — @user typeahead
        </li>
        <li>
          <Link to="/themes">Themes</Link> — presets: dark, light, telegram, slack, clickup
        </li>
      </ul>
    </div>
  );
}
