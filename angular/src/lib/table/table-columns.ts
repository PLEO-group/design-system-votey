import type { VoteyTableColumn, VoteyTableValue } from "./table.model";

export function readTableValue<T>(row: T, column: VoteyTableColumn<T>): VoteyTableValue {
  const value: unknown = column.value ? column.value(row) : row[column.field];
  return value == null || ["string", "number", "boolean"].includes(typeof value)
    ? value as VoteyTableValue : undefined;
}

export function resolveTableColumns<T>(
  rows: readonly T[], columns: readonly VoteyTableColumn<T>[], auto: boolean,
  excluded: readonly string[], headerPrefix: string,
): readonly VoteyTableColumn<T>[] {
  return resolveTableColumnsFromKeys(tableColumnKeys(rows), columns, auto, excluded, headerPrefix);
}

export function tableColumnKeys<T>(rows: readonly T[]): readonly string[] {
  const first: T | undefined = rows[0];
  return first !== null && typeof first === "object" ? Object.keys(first) : [];
}

export function resolveTableColumnsFromKeys<T>(
  keys: readonly string[], columns: readonly VoteyTableColumn<T>[], auto: boolean,
  excluded: readonly string[], headerPrefix: string,
): readonly VoteyTableColumn<T>[] {
  if (!auto) return columns.filter(column => !excluded.includes(column.id));
  const generated: VoteyTableColumn<T>[] = keys.map(id => columns.find(column => column.id === id)
    ?? { id, header: (headerPrefix + id).toUpperCase(), field: id as Extract<keyof T, string> });
  return [...generated, ...columns.filter(column => !keys.includes(column.id))]
    .filter(column => !excluded.includes(column.id));
}
