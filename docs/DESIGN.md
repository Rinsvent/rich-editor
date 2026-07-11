# Editor — проектирование библиотеки

> Статус: **обсуждение / проектирование**  
> Реализация начнётся после отдельного сигнала.

## Цель

JS-библиотека React-компонентов для **набора** и **отображения** форматированного текста уровня Telegram / ClickUp / Slack.

Основные сценарии:
- поле ввода сообщения в чате;
- описание задачи / комментарий в таск-трекере;
- любой UI, где нужно набрать текст с форматированием и потом показать его так же.

Компоненты должны **просто вставляться** в чужие проекты: минимум обвязки, настройка через props, расширение через слоты.

---

## Что уже есть (наработки из messenger)

В `src/` лежит код из проекта smart-messenger. Для библиотеки полезное и лишнее:

### Берём за основу

| Файл | Что даёт |
|------|----------|
| `src/components/editor/MessageEditor.tsx` | Lexical-редактор: toolbar, markdown shortcuts, Enter/Shift+Enter, экспорт HTML |
| `src/components/editor/MarkdownPastePlugin.tsx` | Вставка markdown/HTML из буфера |
| `src/components/editor/editorTheme.ts` | Тема Lexical (классы для bold/italic/code/quote/list/link) |
| `src/components/MessageContent.tsx` | Рендер сохранённого контента + подсветка кода |
| `src/lib/markdown.ts` | Набор markdown-трансформеров, конвертация markdown → HTML |
| `src/lib/contentHtml.ts` | Санитизация HTML (DOMPurify), определение HTML vs plain text |
| `src/lib/messageHtml.ts` | Нормализация экспорта Lexical (`<strong>` → `<b>`, flatten вложенности) |
| `src/app/globals.css` | Стили `.editor-*` и `.message-content` |

### Не входит в библиотеку (остатки приложения)

Чат, auth, sync, PouchDB, Centrifuge, scheduled messages и т.д.:

- `MessengerApp`, `ChatView`, `ChatSidebar`, `MessageComposer`, `MessageBubble`, …
- `src/lib/api.ts`, `syncEngine.ts`, `localDb.ts`, `realtime.ts`, …
- `src/lib/types.ts` (доменные типы messenger)

### Go

`main.go`, `go.mod` — заглушка GoLand, **удаляем** при старте реализации. Проект полностью на React + TypeScript.

---

## Принятые решения

| # | Вопрос | Решение |
|---|--------|---------|
| 1 | Имя пакета | **`rinsvent/rich-editor`** → npm: `@rinsvent/rich-editor` |
| 2 | Стили | **CSS-переменные + `editor.css`** в пакете. Без Tailwind в библиотеке — работает в любом проекте, темизация через variables. Tailwind только в demo при желании. |
| 3 | Управление значением | **`value`** для внешней подмены (draft, редактирование сообщения). **`ref`**: `setHtml`, `clear`, `getHtml`, `focus`, `isEmpty`. **`onSubmit`**, **`onBlur`**, **`clearOnSubmit`**. **`onChange` не нужен.** |
| 4 | Headings | **Есть**, включается через `features.headings` |
| 5 | Формат | **Только HTML** (markdown — способ ввода, не storage) |
| 6 | Demo | **Vite + React** — голый React без Next.js; библиотека не привязана к фреймворку |
| 7 | i18n toolbar | **Через props** (`labels={{ bold: "Жирный", … }}`) |
| 8 | Слоты | **Compound components** — дочерние компоненты внутри `<RichTextEditor>` |
| 9 | Высота поля | **`minRows` / `maxRows`** — props компонента (default: `1` / `8`) |

---

## Ключевые решения

### 1. Стек

- **React 19** + **TypeScript**
- **Lexical 0.44** (`@lexical/react`, rich-text, markdown, html, link, list, code)
- **DOMPurify** — санитизация на viewer
- **marked** — markdown → HTML при paste
- **highlight.js** — подсветка блоков кода в viewer (опционально через feature flag)
- Стили: **`editor.css`** с CSS-переменными

### 2. Формат хранения — HTML

Сейчас в messenger контент хранится как **HTML-строка** (подмножество тегов). Это хорошо для чата/тасков:

- один формат и для editor, и для viewer;
- легко отдавать на бэкенд как `content: string`;
- markdown — только как **способ ввода** (shortcuts + paste), не как storage format.

Альтернатива (Lexical JSON / custom AST) — мощнее, но сложнее для интеграции. Пока **оставляем HTML**.

Разрешённый подмножество тегов (из `contentHtml.ts`):

`p`, `br`, `b`/`strong`, `i`/`em`, `code`, `pre`, `blockquote`, `a`, `ul`, `ol`, `li`, `span`

### 3. Уровень форматирования (Telegram / ClickUp / Slack)

| Фича | Markdown shortcut | Toolbar | Viewer |
|------|-------------------|---------|--------|
| Bold | `**text**`, `__text__` | B | да |
| Italic | `*text*`, `_text_` | I | да |
| Inline code | `` `code` `` | `</>` | да |
| Block quote | `> text` | “ | да |
| Unordered list | `- item` | — | да |
| Ordered list | `1. item` | — | да |
| Code block | ` ```lang ` | — | да (+ highlight) |
| Link | `[text](url)` | — | да |
| Heading | `# H1` … | — | да (`features.headings`) |
| Strikethrough | `~~text~~` | S | да (`features.strikethrough`) |
| Mention `@user` | `@` + typeahead | — | да (`features.mentions`) |
| Emoji picker | — | — | **v2** |

Heading включается через `features.headings` (по умолчанию `false` для чата, `true` для task-режима в demo).

### 4. Монорепо / структура пакета

```
editor/
├── packages/
│   └── rich-editor/         # npm: @rinsvent/rich-editor
│       ├── src/
│       │   ├── components/
│       │   │   ├── RichTextEditor.tsx
│       │   │   ├── RichTextViewer.tsx
│       │   │   ├── slots/           # ToolbarEnd, ToolbarMenu, …
│       │   │   ├── toolbar/
│       │   │   └── plugins/
│       │   ├── context/
│       │   │   └── EditorContext.tsx
│       │   ├── core/
│       │   │   ├── features.ts
│       │   │   ├── markdown.ts
│       │   │   ├── html.ts
│       │   │   └── theme.ts
│       │   ├── styles/
│       │   │   └── editor.css
│       │   └── index.ts
│       └── package.json
├── apps/
│   └── demo/                # Vite + React
├── docs/
│   └── DESIGN.md
└── package.json
```

Текущий legacy messenger `src/` удалён — код живёт в `packages/rich-editor`.

### 5. Публичный API

#### `RichTextEditor`

```tsx
<RichTextEditor
  value={html}                      // внешняя подмена: draft, edit message
  onSubmit={(html) => …}
  onBlur={(html) => …}              // сохранение draft при уходе фокуса
  placeholder="…"
  disabled={false}
  features={{
    bold: true,
    italic: true,
    code: true,
    quote: true,
    lists: true,
    links: true,
    codeBlock: true,
    headings: false,
    mentions: false,
    markdownShortcuts: true,
    markdownPaste: true,
  }}
  mentionSearch={(query) => users.filter((u) => u.label.includes(query))}
  labels={{
    bold: "Жирный",
    italic: "Курсив",
    code: "Код",
    quote: "Цитата",
    submit: "Отправить",
  }}
  enterBehavior="submit" | "newline" | "shift-newline"  // default: shift-newline
  clearOnSubmit
  className="…"
  ref={editorRef}
>
  <RichTextEditor.ToolbarEnd>
    <ScheduledButton count={3} />
  </RichTextEditor.ToolbarEnd>
  <RichTextEditor.ToolbarMenu>
    <MenuItem onClick={scheduleNew}>Отложить…</MenuItem>
  </RichTextEditor.ToolbarMenu>
  <RichTextEditor.SubmitButton />   {/* дефолтная кнопка; можно заменить своим содержимым */}
  <RichTextEditor.Footer>
    <CharCounter />
  </RichTextEditor.Footer>
</RichTextEditor>
```

#### Управление значением (без `onChange`)

Типичные сценарии:

| Сценарий | Как |
|----------|-----|
| Загрузить draft | `value={draftHtml}` при монтировании / смене чата |
| Очистить после отправки | `clearOnSubmit` или `ref.current?.clear()` |
| Редактировать сообщение | `value={message.content}` при открытии режима edit |
| Сбросить полностью | `ref.clear()` или смена `key` на редакторе |

`value` — **внешний источник правды**: при изменении prop редактор подставляет новый HTML (как сейчас `InitialHtmlPlugin`). Внутреннее состояние при наборе живёт в Lexical, наружу уходит через `onSubmit` / `onBlur` / `ref.getHtml()`.

#### `RichTextViewer`

```tsx
<RichTextViewer
  content={html}
  features={{ codeHighlight: true, linkTarget: "_blank" }}
  className="…"
/>
```

Если `content` — plain text без тегов, viewer показывает как есть (как сейчас `MessageContent`).

#### Imperative handle

```ts
type EditorHandle = {
  getHtml: () => string;
  setHtml: (html: string) => void;
  clear: () => void;
  focus: () => void;
  isEmpty: () => boolean;
};
```

### 6. Слоты — compound components

**Решение:** слоты как дочерние компоненты внутри `<RichTextEditor>`, по аналогии с Radix / React-идиомой.

```tsx
<RichTextEditor value={html} onSubmit={handleSubmit} clearOnSubmit>
  <RichTextEditor.ToolbarEnd>
    <MyButton />
  </RichTextEditor.ToolbarEnd>
</RichTextEditor>
```

#### Доступные слоты

| Компонент | Куда рендерится |
|-----------|-----------------|
| `RichTextEditor.ToolbarStart` | Слева от кнопок форматирования |
| `RichTextEditor.ToolbarEnd` | Справа в toolbar (иконки, меню) |
| `RichTextEditor.ToolbarMenu` | Содержимое выпадающего меню (⋮) |
| `RichTextEditor.SubmitButton` | Кнопка отправки; без children — дефолтная иконка |
| `RichTextEditor.Footer` | Под полем ввода |

#### Как это работает внутри

1. `RichTextEditor` оборачивает всё в `EditorContext.Provider`.
2. Slot-компоненты (`ToolbarEnd` и т.д.) — **маркеры**: сами не рисуют UI, а регистрируют `children` в родителе (pattern как `Tabs.Trigger` / `Select.Item`).
3. Для доступа к API редактора из своих кнопок в слоте — хук **`useRichTextEditor()`**:

```tsx
function ScheduledButton() {
  const { getHtml, isEmpty, formatState } = useRichTextEditor();
  return <button disabled={isEmpty}>…</button>;
}

<RichTextEditor onSubmit={…}>
  <RichTextEditor.ToolbarEnd>
    <ScheduledButton />
  </RichTextEditor.ToolbarEnd>
</RichTextEditor>
```

```ts
type RichTextEditorContext = {
  getHtml: () => string;
  setHtml: (html: string) => void;
  clear: () => void;
  focus: () => void;
  isEmpty: boolean;
  formatState: { bold: boolean; italic: boolean; code: boolean; quote: boolean };
  format: {
    bold: () => void;
    italic: () => void;
    code: () => void;
    quote: () => void;
  };
  disabled: boolean;
};
```

Почему compound components лучше `slots={{ … }}`:
- привычный React JSX, автокомплит по `RichTextEditor.`;
- слоты можно выносить в отдельные компоненты с хуком;
- не нужен объект props с ReactNode внутри (меньше лишних ре-рендеров);
- типизация проще.

### 7. Отвязка от messenger-стилей

Сейчас компоненты завязаны на Tailwind-классы `tg-*` (telegram theme). Для библиотеки:

- базовые стили в `editor.css` с **CSS-переменными** (`--editor-accent`, `--editor-border`, …);
- опциональный prop `theme?: "light" | "dark" | "none"` или `className` на корень;
- Tailwind в **demo-приложении**, не в core-пакете (если не решим иначе).

### 8. Зависимости peer

```json
{
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18"
  }
}
```

Lexical-пакеты — **dependencies** библиотеки, не peer (чтобы версии не конфликтовали у потребителя).

---

## Демо-приложение

**Vite + React** (`apps/demo`), без Next.js. Роутинг — `react-router` или несколько entry-страниц.

Маршруты:

| Страница | Что показывает |
|----------|----------------|
| `/` | Overview + ссылки |
| `/editor/basic` | Минимальный редактор (bold/italic/code) |
| `/editor/full` | Все features |
| `/editor/chat` | Режим чата: Enter = send, слоты toolbarEnd |
| `/editor/task` | Режим task: headings, lists, save button |
| `/viewer` | Viewer с примерами HTML |
| `/playground` | Editor слева, live viewer справа |

Каждая страница — copy-paste пример для документации.

---

## Roadmap

### Фаза 0 — Подготовка репозитория
- [x] Удалить Go (`main.go`, `go.mod`)
- [x] Настроить monorepo (npm workspaces)
- [x] Вынести пакет `packages/rich-editor` (`@rinsvent/rich-editor`), очистить от messenger-кода
- [x] Зафиксировать public API в `DESIGN.md`

### Фаза 1 — Core MVP
- [x] `RichTextEditor` — рефакторинг `MessageEditor` без messenger props
- [x] `RichTextViewer` — рефакторинг `MessageContent`
- [x] `features` prop: bold, italic, code, quote
- [x] HTML export/import, sanitize, normalize
- [x] Markdown shortcuts для включённых features
- [x] `ref` handle: getHtml, clear, focus
- [x] Базовые стили (CSS variables)

### Фаза 2 — Расширенное форматирование
- [x] Lists (ul/ol)
- [x] Links (auto-link + markdown)
- [x] Code blocks + optional highlight.js в viewer
- [x] Markdown paste plugin (feature flag)
- [x] `enterBehavior` (submit / newline / shift-newline)

### Фаза 3 — Слоты и кастомизация
- [x] Compound components: `ToolbarStart`, `ToolbarEnd`, `ToolbarMenu`, `SubmitButton`, `Footer`
- [x] `useRichTextEditor()` hook + `EditorContext`
- [x] `labels` prop для i18n toolbar
- [x] `value` prop (внешняя подмена), `onBlur`, disabled state
- [x] `minRows` / `maxRows`

### Фаза 4 — Demo + DX
- [x] Demo app со всеми страницами
- [x] README: install, quick start
- [x] Сборка ESM + CJS + types (`tsup`)
- [x] Tree-shakeable exports (sideEffects на CSS)

### Фаза 5 — Полировка
- [x] Strikethrough (`features.strikethrough`, `~~text~~`, toolbar S)
- [x] Keyboard shortcuts (`features.keyboardShortcuts`: Ctrl+B/I/E, Ctrl+Shift+X)
- [x] Unit-тесты: html normalize, sanitize, markdown transformers (vitest)
- [x] Удалён legacy messenger `src/`
- [x] Mentions (`features.mentions` + `mentionSearch`, custom MentionNode)
- [x] Темы оформления (presets: dark, light, telegram, slack, clickup)
- [x] SSR-safe viewer (isomorphic-dompurify, prepareViewerContent, lazy highlight)
- [ ] a11y: расширенные aria, документация shortcuts

---

## Рефакторинг текущего `MessageEditor` → `RichTextEditor`

Что убрать из props:

- `scheduledCount`, `scheduleHint`, `onOpenScheduledList`, `onScheduleNew` → `<RichTextEditor.ToolbarEnd>` / `<ToolbarMenu>`
- `submitMode: "send" | "save"` → `<RichTextEditor.SubmitButton>` с children или `labels.submit`
- `onBlurDraft` → `onBlur={(html) => …}`
- hardcoded `id="message-editor-root"` → `useId()` или ref на container

Что сохранить как есть (логика):

- `exportEditorHtml` + `normalizeMessageHtml`
- `useFormatState` + toolbar buttons
- `EnterPlugin` (поведение через `enterBehavior`)
- `InitialHtmlPlugin`, `MarkdownPastePlugin`, `MarkdownShortcutPlugin`
- Lexical nodes: Quote, List, Code, Link (Heading — за feature flag)

---

## Пример целевого использования

```tsx
import {
  RichTextEditor,
  RichTextViewer,
  useRichTextEditor,
} from "@rinsvent/rich-editor";
import "@rinsvent/rich-editor/styles.css";

function ChatComposer({ chatId, draftHtml }: Props) {
  const editorRef = useRef<EditorHandle>(null);

  return (
    <RichTextEditor
      ref={editorRef}
      value={draftHtml}
      onBlur={(html) => saveDraft(chatId, html)}
      onSubmit={async (html) => sendMessage(chatId, html)}
      clearOnSubmit
      enterBehavior="submit"
      features={{ bold: true, italic: true, code: true, quote: true }}
      labels={{ bold: "Жирный", submit: "Отправить" }}
    >
      <RichTextEditor.ToolbarEnd>
        <AttachButton />
      </RichTextEditor.ToolbarEnd>
    </RichTextEditor>
  );
}

function EditMessage({ message, onSave, onCancel }: Props) {
  return (
    <RichTextEditor
      value={message.content}
      onSubmit={onSave}
      enterBehavior="submit"
      features={{ bold: true, italic: true, lists: true, headings: true }}
    >
      <RichTextEditor.ToolbarEnd>
        <button type="button" onClick={onCancel}>Отмена</button>
      </RichTextEditor.ToolbarEnd>
      <RichTextEditor.SubmitButton>Сохранить</RichTextEditor.SubmitButton>
    </RichTextEditor>
  );
}

function CommentThread({ comments }: Props) {
  return comments.map((c) => (
    <RichTextViewer key={c.id} content={c.content} />
  ));
}
```

---

## Changelog документа

| Дата | Изменение |
|------|-----------|
| 2026-06-27 | Первая версия: цели, анализ src, API, roadmap |
| 2026-06-28 | SSR-safe viewer: isomorphic-dompurify, prepareViewerContent |
