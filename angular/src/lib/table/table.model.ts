export type VoteyTableKey = string | number;
export const VoteyTableHeaderVariants = ["standard", "heavy"] as const;
export type VoteyTableHeaderVariant = (typeof VoteyTableHeaderVariants)[number];
export type VoteyTableValue = string | number | boolean | null | undefined;
export type VoteyTableSearchMode = "none" | "local" | "remote";
export type VoteyTableFilters = Readonly<Record<string, unknown>>;

export interface VoteyTableColumn<T> {
  id: string;
  header: string;
  width?: number;
  align?: "left" | "center" | "right";
  searchable?: boolean;
  role?: "data" | "actions";
  value: (row: T) => VoteyTableValue;
}

export interface VoteyTableQuery {
  page: number;
  size: number;
  search: string;
  filters: VoteyTableFilters;
}

export interface VoteyTableCellContext<T> {
  $implicit: T;
  column: VoteyTableColumn<T>;
  value: VoteyTableValue;
  index: number;
}

export interface VoteyTableSelectionContext {
  $implicit: readonly VoteyTableKey[];
}
