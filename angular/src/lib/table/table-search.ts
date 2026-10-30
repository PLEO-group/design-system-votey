import { debounceTime, map, type Observable } from "rxjs";

/** Deduplicate against the applied query in submitSearch, not a stale draft. */
export function tableSearchTerms(values: Observable<string | null>): Observable<string> {
  return values.pipe(map((value: string | null): string => (value ?? "").trim()), debounceTime(300));
}
