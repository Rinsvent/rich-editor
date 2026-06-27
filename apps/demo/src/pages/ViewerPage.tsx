import { RichTextViewer } from "@rinsvent/rich-editor";

const samples = [
  {
    title: "Plain text",
    content: "Простой текст без HTML",
  },
  {
    title: "Inline formatting",
    content: "<p><b>Жирный</b>, <i>курсив</i> и <code>код</code></p>",
  },
  {
    title: "Quote + list",
    content:
      "<blockquote>Цитата</blockquote><ul><li>Пункт 1</li><li>Пункт 2</li></ul>",
  },
  {
    title: "Code block",
    content:
      '<pre><code class="language-javascript">const x = 1;\nconsole.log(x);</code></pre>',
  },
  {
    title: "Link",
    content: '<p>Ссылка: <a href="https://example.com">example.com</a></p>',
  },
];

export function ViewerPage() {
  return (
    <>
      {samples.map((s) => (
        <div key={s.title} className="demo-card">
          <h2>{s.title}</h2>
          <RichTextViewer content={s.content} />
        </div>
      ))}
    </>
  );
}
