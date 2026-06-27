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
          <Link to="/editor/chat">Chat</Link> — Enter = send, слоты toolbar
        </li>
        <li>
          <Link to="/editor/task">Task</Link> — headings, save button
        </li>
        <li>
          <Link to="/viewer">Viewer</Link> — примеры отображения
        </li>
        <li>
          <Link to="/playground">Playground</Link> — editor + live viewer
        </li>
      </ul>
    </div>
  );
}
