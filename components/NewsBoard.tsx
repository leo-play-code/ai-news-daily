"use client";

import { useEffect, useState } from "react";
import type { NewsDay, Topic } from "@/lib/news";

const CATEGORY_STYLES: Record<string, string> = {
  模型發布: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  架構創新: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
  技巧: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  工具更新: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  開源工具: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
  安全治理: "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
  研究突破: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300",
  產業動態: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
  影音生成: "bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300",
  硬體晶片: "bg-lime-100 text-lime-800 dark:bg-lime-950 dark:text-lime-300",
  機器人: "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300",
  募資併購: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
  法規政策: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  企業應用: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300",
  醫療科學: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
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

function CategoryBadge({ category }: { category: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryClass(
        category
      )}`}
    >
      {category}
    </span>
  );
}

function SourceLinks({ sources }: { sources: Topic["sources"] }) {
  return (
    <ul className="space-y-1">
      {sources.map((src) => (
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
  );
}

function TopicModal({
  topic,
  onClose,
}: {
  topic: Topic;
  onClose: () => void;
}) {
  // Esc 關閉 + 鎖定背景捲動
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const paragraphs = topic.detail
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={topic.title}
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl dark:bg-zinc-900 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 標頭 */}
        <div className="flex items-start justify-between gap-3 border-b border-black/10 px-6 py-4 dark:border-white/10">
          <div className="min-w-0">
            <div className="mb-2">
              <CategoryBadge category={topic.category} />
            </div>
            <h2 className="text-xl font-bold leading-snug">{topic.title}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="關閉"
            className="shrink-0 rounded-full p-1.5 text-black/50 transition hover:bg-black/5 dark:text-white/50 dark:hover:bg-white/10"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 內容(可捲動) */}
        <div className="overflow-y-auto px-6 py-5">
          <div className="space-y-3 leading-relaxed text-black/80 dark:text-white/80">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {topic.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {topic.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-black/[0.04] px-2 py-0.5 text-xs text-black/60 dark:bg-white/[0.06] dark:text-white/60"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 border-t border-black/5 pt-4 dark:border-white/5">
            <p className="mb-1.5 text-xs font-medium text-black/50 dark:text-white/50">
              閱讀原文
            </p>
            <SourceLinks sources={topic.sources} />
          </div>
        </div>
      </div>
    </div>
  );
}

function TopicCard({
  topic,
  onOpen,
}: {
  topic: Topic;
  onOpen: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      className="group w-full rounded-xl border border-black/10 bg-white p-5 text-left shadow-sm transition hover:border-black/20 hover:shadow-md dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20"
    >
      <div className="mb-2">
        <CategoryBadge category={topic.category} />
      </div>
      <h3 className="text-lg font-semibold leading-snug">{topic.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-black/70 dark:text-white/70">
        {topic.summary}
      </p>

      {topic.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {topic.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-black/[0.04] px-2 py-0.5 text-xs text-black/60 dark:bg-white/[0.06] dark:text-white/60"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:gap-1.5 dark:text-blue-400">
        點擊看完整內容
        <span aria-hidden className="transition-all">→</span>
      </span>
    </button>
  );
}

export default function NewsBoard({ days }: { days: NewsDay[] }) {
  const [selected, setSelected] = useState<Topic | null>(null);

  if (days.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-black/15 p-10 text-center text-black/50 dark:border-white/15 dark:text-white/50">
        目前尚無資料。每日 7:00 的排程更新後,內容會出現在這裡。
      </div>
    );
  }

  return (
    <>
      <div className="space-y-12">
        {days.map((day) => (
          <section key={day.date}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-black/40 dark:text-white/40">
              {formatDate(day.date)}
            </h2>
            <div className="grid gap-4">
              {day.topics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  onOpen={() => setSelected(topic)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {selected && (
        <TopicModal topic={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
