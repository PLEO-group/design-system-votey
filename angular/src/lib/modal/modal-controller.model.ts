import type { Signal } from "@angular/core";
import type { VoteyModalActions } from "./modal-actions.model";
import type { VoteyModalCloseReason } from "./modal.model";

/** @internal Kontrakt komunikacji wewnątrz DS; nie używać w aplikacjach konsumenckich. */
export interface ModalController<TResult> {
  readonly busy: Signal<boolean>;
  readonly closing: Signal<boolean>;
  close(value?: TResult, reason?: VoteyModalCloseReason): Promise<boolean>;
  setBusy(busy: boolean): void;
  updateActions(actions: Partial<VoteyModalActions<TResult>>): void;
}

