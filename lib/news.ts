import newsJson from "@/data/news.json";

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
  /** 繁體中文短摘要 (卡片上顯示) */
  summary: string;
  /** 繁體中文完整內容 (彈窗中顯示,段落以換行分隔) */
  detail: string;
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

/** 讀取 data/news.json (建置時靜態載入,每次 git push 重建會帶入最新內容)。 */
export function getNews(): NewsData {
  const data = newsJson as NewsData;
  // 回傳前複製並由新到舊排序,避免變動模組快取
  const days = [...data.days].sort((a, b) => b.date.localeCompare(a.date));
  return { lastUpdated: data.lastUpdated, days };
}
