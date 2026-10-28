import type { VoteyTableKey } from "./table.model";

export function resolveTablePage(page: number, size: number, total: number): number {
  const pageCount: number = size > 0 ? Math.ceil(Math.max(0, total) / size) : 0;
  return Math.min(Math.max(0, page), Math.max(0, pageCount - 1));
}

export function updateTableSelection(
  selected: readonly VoteyTableKey[],
  visible: readonly VoteyTableKey[],
  checked: boolean,
  index: number | null = null,
  anchor: number | null = null,
): VoteyTableKey[] {
  const result: Set<VoteyTableKey> = new Set(selected);
  const affected: readonly VoteyTableKey[] = index === null
    ? visible
    : visible.slice(Math.min(index, anchor ?? index), Math.max(index, anchor ?? index) + 1);
  for (const key of affected) {
    if (checked) result.add(key);
    else result.delete(key);
  }
  return [...result];
}

export function matchesTableSearch(values: readonly unknown[], search: string): boolean {
  const phrase: string = search.trim().toLocaleLowerCase();
  return !phrase || values.some((value: unknown) =>
    String(value ?? "").toLocaleLowerCase().includes(phrase),
  );
}
