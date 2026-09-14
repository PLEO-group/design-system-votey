import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import { Injectable, PLATFORM_ID, inject } from "@angular/core";

export type DesignSystemTheme = "light" | "dark";

type ViewTransitionDocument = Document & {
  startViewTransition?: (updateCallback: () => void) => unknown;
};

@Injectable({ providedIn: "root" })
export class DesignSystemThemeService {
  readonly #document = inject(DOCUMENT) as ViewTransitionDocument;
  readonly #platformId = inject(PLATFORM_ID);
  readonly #themeKey = "theme";

  /** Persist and apply a conscious user choice. */
  setTheme(isDark: boolean): void {
    if (!isPlatformBrowser(this.#platformId)) return;

    const theme: DesignSystemTheme = isDark ? "dark" : "light";
    this.#sessionStorage()?.setItem(this.#themeKey, theme);

    const apply = (): void => this.#document.body.setAttribute("data-theme", theme);
    if (this.#document.startViewTransition) {
      this.#document.startViewTransition(apply);
    } else {
      apply();
    }
  }

  /** Restore the session choice. With no saved value, preserve body[data-theme="light"]. */
  loadTheme(): boolean {
    if (!isPlatformBrowser(this.#platformId)) return false;

    const savedTheme = this.#sessionStorage()?.getItem(this.#themeKey);
    if (savedTheme === "light" || savedTheme === "dark") {
      this.#document.body.setAttribute("data-theme", savedTheme);
      return savedTheme === "dark";
    }
    return false;
  }

  #sessionStorage(): Storage | null {
    try {
      return this.#document.defaultView?.sessionStorage ?? null;
    } catch {
      return null;
    }
  }
}
