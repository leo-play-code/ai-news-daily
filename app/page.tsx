import { getNews } from "@/lib/news";
import NewsBoard from "@/components/NewsBoard";

function formatUpdated(iso: string): string {
  if (!iso) return "尚未更新";
  // 取 ISO 字串前 16 字 (YYYY-MM-DDTHH:mm) 顯示,避免時區轉換差異
  return iso.slice(0, 16).replace("T", " ");
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
          每天早上 7:00 自動彙整最新 AI 新技術與技巧,整理成主題摘要。點擊卡片即可在彈窗中閱讀完整中文內容。
        </p>
        <p className="mt-2 text-sm text-black/45 dark:text-white/45">
          最後更新:{formatUpdated(data.lastUpdated)} ・ 共 {totalTopics} 則主題
        </p>
      </header>

      <NewsBoard days={data.days} />

      <footer className="mt-16 border-t border-black/5 pt-6 text-center text-xs text-black/40 dark:border-white/5 dark:text-white/40">
        由 Claude Code 排程代理每日自動產生 ・ 完整內容為中文整理,原文連結見各主題彈窗
      </footer>
    </main>
  );
}
