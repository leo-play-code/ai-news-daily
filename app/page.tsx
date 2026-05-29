import { getNews, type Topic } from "@/lib/news";

// 讀取本地 JSON,內容每天更新,故採動態渲染
export const dynamic = "force-dynamic";

const CATEGORY_STYLES: Record<string, string> = {
  模型發布: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  架構創新: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
  技巧: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  工具更新: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  開源工具: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
  安全治理: "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
};

function categoryClass(category: string): string {
  return (
    CATEGORY_STYLES[category] ??
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  );
}

function formatDate(date: string): string {
  const [y, m, d] = date.split("-");
  return `${y} 年 ${Number(m)} 月 ${Number(d)} 日`;
}

function formatUpdated(iso: string): string {
  if (!iso) return "尚未更新";
  // 取 ISO 字串前 16 字 (YYYY-MM-DDTHH:mm) 顯示,避免時區轉換差異
  return iso.slice(0, 16).replace("T", " ");
}

function TopicCard({ topic }: { topic: Topic }) {
  return (
    <article className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/[0.03] p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryClass(
            topic.category
          )}`}
        >
          {topic.category}
        </span>
      </div>
      <h3 className="text-lg font-semibold leading-snug">{topic.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-black/70 dark:text-white/70">
        {topic.summary}
      </p>

      {topic.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {topic.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-black/[0.04] dark:bg-white/[0.06] px-2 py-0.5 text-xs text-black/60 dark:text-white/60"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 border-t border-black/5 dark:border-white/5 pt-3">
        <p className="mb-1.5 text-xs font-medium text-black/50 dark:text-white/50">
          來源連結
        </p>
        <ul className="space-y-1">
          {topic.sources.map((src) => (
            <li key={src.url}>
              <a
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                <span aria-hidden>↗</span>
                {src.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function Home() {
  const data = getNews();
  const totalTopics = data.days.reduce((n, d) => n + d.topics.length, 0);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          每日 AI 新技術日報
        </h1>
        <p className="mt-3 text-black/60 dark:text-white/60">
          每天早上 7:00 自動彙整最新 AI 新技術與技巧,整理成主題摘要,點擊即可前往原始來源。
        </p>
        <p className="mt-2 text-sm text-black/45 dark:text-white/45">
          最後更新:{formatUpdated(data.lastUpdated)} ・ 共 {totalTopics} 則主題
        </p>
      </header>

      {data.days.length === 0 ? (
        <div className="rounded-xl border border-dashed border-black/15 dark:border-white/15 p-10 text-center text-black/50 dark:text-white/50">
          目前尚無資料。每日 7:00 的排程更新後,內容會出現在這裡。
        </div>
      ) : (
        <div className="space-y-12">
          {data.days.map((day) => (
            <section key={day.date}>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-black/40 dark:text-white/40">
                {formatDate(day.date)}
              </h2>
              <div className="grid gap-4">
                {day.topics.map((topic) => (
                  <TopicCard key={topic.id} topic={topic} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <footer className="mt-16 border-t border-black/5 dark:border-white/5 pt-6 text-center text-xs text-black/40 dark:text-white/40">
        由 Claude Code 排程代理每日自動產生 ・ 資料來源為各原始連結
      </footer>
    </main>
  );
}
