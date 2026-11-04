export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** 标记当前页面存在未保存的输入，供版本切换前提示（§3.7） */
export function markDirty(dirty: boolean) {
  if (typeof window !== "undefined") {
    (window as unknown as { __yqDirty?: boolean }).__yqDirty = dirty;
  }
}

export function isDirty(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean((window as unknown as { __yqDirty?: boolean }).__yqDirty);
}
