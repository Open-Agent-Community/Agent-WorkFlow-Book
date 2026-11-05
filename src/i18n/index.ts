import { zhCN } from "./zh-CN";

export type Locale = "zh-CN";
export const DEFAULT_LOCALE: Locale = "zh-CN";

const dictionaries = { "zh-CN": zhCN } as const;

/** UI strings for the active locale. v1 ships zh-CN only. */
export const t = dictionaries[DEFAULT_LOCALE];
export type Dictionary = typeof zhCN;
