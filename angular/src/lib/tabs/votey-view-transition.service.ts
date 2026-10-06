import { Injectable } from "@angular/core";

/** Coordinates document transitions, including those created by the consumer router. */
@Injectable({ providedIn: "root" })
export class VoteyViewTransitionService {
  private active: ViewTransition | null = null;
  private cleanup: (() => void) | null = null;

  public adopt(transition: ViewTransition, cleanup: () => void): void {
    this.cancel();
    this.active = transition;
    this.cleanup = cleanup;
    void transition.finished.then(
      () => this.release(transition),
      () => this.release(transition),
    );
  }

  public cancel(): void {
    this.active?.skipTransition();
    this.active = null;
    this.cleanup?.();
    this.cleanup = null;
  }

  private release(transition: ViewTransition): void {
    if (this.active !== transition) return;
    this.active = null;
    this.cleanup?.();
    this.cleanup = null;
  }
}
