import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
} from "@angular/core";

@Component({
  selector: "ds-grid-overlay",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (enabled()) {
      <div class="grid-overlay" aria-hidden="true">
        @for (_ of columns(); track $index) {
          <div class="grid-column"></div>
        }
      </div>
    }
  `,
  styles: `
    :host {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      display: block;
      pointer-events: none;
    }

    .grid-overlay {
      box-sizing: border-box;
      display: grid;
      grid-template-columns: repeat(var(--grid-columns), minmax(0, 1fr));
      column-gap: var(--grid-column-gap);
      width: 100%;
      height: 100%;
      padding-inline: var(--grid-margin);
    }

    .grid-column {
      min-width: 0;
      background: rgb(255 0 128 / 16%);
      outline: 1px solid rgb(255 0 128 / 36%);
    }
  `,
})
export class DesignSystemGridOverlayComponent implements AfterViewInit {
  readonly #element = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly #destroyRef = inject(DestroyRef);

  readonly enabled = input(false);
  readonly columns = signal<readonly number[]>([]);

  ngAfterViewInit(): void {
    const browserWindow = this.#element.nativeElement.ownerDocument.defaultView;
    if (!browserWindow) return;

    const refresh = (): void => {
      const value = browserWindow.getComputedStyle(this.#element.nativeElement)
        .getPropertyValue("--grid-columns");
      const count = Number.parseInt(value, 10);
      this.columns.set(Number.isInteger(count) && count > 0
        ? Array.from({ length: count }, (_, index) => index)
        : []);
    };

    const observer = new MutationObserver(refresh);
    observer.observe(this.#element.nativeElement.ownerDocument.documentElement, {
      attributes: true,
      subtree: true,
      attributeFilter: ["data-device", "data-grid-type"],
    });
    browserWindow.addEventListener("resize", refresh, { passive: true });
    browserWindow.requestAnimationFrame(refresh);

    this.#destroyRef.onDestroy(() => {
      observer.disconnect();
      browserWindow.removeEventListener("resize", refresh);
    });
  }
}
