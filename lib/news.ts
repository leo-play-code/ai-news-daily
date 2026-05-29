import fs from "node:fs";
import path from "node:path";

export interface Source {
  /** 來源標題,例如媒體或部落格名稱 */
  title: string;
  /** 點擊後跳轉的原始連結 */
  url: string;
}

export interface Topic {
  /** 穩定的識別碼 (供 key 使用) */
  id: string;
  /** 主題標題 (繁體中文) */
  title: string;
  /** 分類,例如「模型發布」「技巧」「開源工具」 */
  category: string;
  /** 繁體中文摘要 */
  summary: string;
  /** 關鍵字標籤 */
  tags: string[];
  /** 一或多個來源連結 */
  sources: Source[];
}

export interface NewsDay {
  /** 該批新聞的日期 (YYYY-MM-DD) */
  date: string;
  topics: Topic[];
}

export interface NewsData {
  /** 最後更新時間 (ISO 8601) */
  lastUpdated: string;
  /** 由新到舊排列的每日新聞 */
  days: NewsDay[];
}

const DATA_PATH = path.join(process.cwd(), "data", "news.json");

/** 讀取 data/news.json。檔案不存在或解析失敗時回傳空資料。 */
export function getNews(): NewsData {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    const data = JSON.parse(raw) as NewsData;
    // 確保由新到舊排序
    data.days.sort((a, b) => b.date.localeCompare(a.date));
    return data;
  } catch {
    return { lastUpdated: "", days: [] };
  }
}

/** 所有出現過的分類 (依出現頻率) */
export function getCategories(data: NewsData): string[] {
  const seen = new Set<string>();
  for (const day of data.days) {
    for (const topic of day.topics) seen.add(topic.category);
  }
  return [...seen];
}
