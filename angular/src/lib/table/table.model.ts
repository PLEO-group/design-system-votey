export type VoteyTableKey = string | number;
export const VoteyTableHeaderVariants = ["standard", "heavy"] as const;
export type VoteyTableHeaderVariant = (typeof VoteyTableHeaderVariants)[number];
export type VoteyTableValue = string | number | boolean | null | undefined;
export type VoteyTablePaginationMode = "none" | "local" | "remote";
export type VoteyTableSearchMode = "none" | "local" | "remote";
export type VoteyTableFilters = Readonly<Record<string, unknown>>;

export interface VoteyTableRowConfig {
  tone?: "default" | "accent" | "error";
  tooltip?: string;
  attributes?: Readonly<Record<`data-${string}`, string | number | null>>;
  groupAttributes?: Readonly<Record<`data-${string}`, string | number | null>>;
}

interface VoteyTableColumnOptions {
  id: string;
  header: string;
  headerTooltip?: string;
  width?: number;
  align?: "left" | "center" | "right";
  searchable?: boolean;
  role?: "data" | "actions";
}

export type VoteyTableColumn<T> = VoteyTableColumnOptions & (
  | { field: Extract<keyof T, string>; value?: never }
  | { value: (row: T) => VoteyTableValue; field?: never }
);

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
  parent: T | null;
  childIndex: number | null;
}

export interface VoteyTableReorderEvent<T> {
  row: T;
  rows: readonly T[];
  previousIndex: number;
  currentIndex: number;
}

export interface VoteyTableSelectionContext {
  $implicit: readonly VoteyTableKey[];
}
